import "server-only";
import { prisma } from "@/app/_lib/db";

export type Role = "host" | "guest";

export type ConversationSummary = {
  id: string;
  role: Role;
  listing: { id: string; title: string; imageUrl: string };
  other: { name: string };
  lastMessage: { body: string; fromMe: boolean; createdAt: Date } | null;
  unread: boolean;
};

const displayName = (u: { name: string | null }) =>
  u.name?.trim() || "A SummerStay member";

type Row = {
  hostId: string;
  hostReadAt: Date | null;
  guestReadAt: Date | null;
  lastMessageAt: Date;
  messages: { senderId: string }[];
};

// A conversation is unread for me when the newest message is from the other
// person and arrived after I last opened the thread.
function isUnread(row: Row, userId: string): boolean {
  const last = row.messages[0];
  if (!last || last.senderId === userId) return false;
  const readAt = row.hostId === userId ? row.hostReadAt : row.guestReadAt;
  return !readAt || row.lastMessageAt > readAt;
}

// Every conversation the user is in (as host or as student), newest first.
export async function getConversations(
  userId: string,
): Promise<ConversationSummary[]> {
  const rows = await prisma.conversation.findMany({
    where: { OR: [{ hostId: userId }, { guestId: userId }] },
    orderBy: { lastMessageAt: "desc" },
    include: {
      listing: { select: { id: true, title: true, imageUrl: true } },
      host: { select: { name: true } },
      guest: { select: { name: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  return rows.map((row) => {
    const role: Role = row.hostId === userId ? "host" : "guest";
    const last = row.messages[0];
    return {
      id: row.id,
      role,
      listing: row.listing,
      other: { name: displayName(role === "host" ? row.guest : row.host) },
      lastMessage: last
        ? {
            body: last.body,
            fromMe: last.senderId === userId,
            createdAt: last.createdAt,
          }
        : null,
      unread: isUnread(row, userId),
    };
  });
}

// Unread threads plus unread email inquiries, for the navbar badge.
export async function countAllUnread(userId: string): Promise<number> {
  const [rows, inquiries] = await Promise.all([
    prisma.conversation.findMany({
      where: { OR: [{ hostId: userId }, { guestId: userId }] },
      select: {
        hostId: true,
        hostReadAt: true,
        guestReadAt: true,
        lastMessageAt: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { senderId: true },
        },
      },
    }),
    prisma.inquiry.count({
      where: { readAt: null, listing: { ownerId: userId } },
    }),
  ]);
  return rows.filter((r) => isUnread(r, userId)).length + inquiries;
}

// One thread with its messages, only if the user is in it.
export async function getThread(id: string, userId: string) {
  const row = await prisma.conversation.findUnique({
    where: { id },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
          pricePerMonth: true,
          availability: true,
          isTaken: true,
          removedAt: true,
        },
      },
      host: { select: { id: true, name: true, vtVerifiedAt: true } },
      guest: { select: { id: true, name: true, vtVerifiedAt: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!row || (row.hostId !== userId && row.guestId !== userId)) return null;
  const role: Role = row.hostId === userId ? "host" : "guest";
  const other = role === "host" ? row.guest : row.host;
  return {
    id: row.id,
    role,
    listing: row.listing,
    other: {
      name: displayName(other),
      verified: Boolean(other.vtVerifiedAt),
    },
    messages: row.messages.map((m) => ({
      id: m.id,
      body: m.body,
      createdAt: m.createdAt,
      fromMe: m.senderId === userId,
    })),
  };
}

// Record that the user has seen everything in this thread.
export async function markThreadRead(id: string, role: Role): Promise<void> {
  await prisma.conversation.update({
    where: { id },
    data:
      role === "host"
        ? { hostReadAt: new Date() }
        : { guestReadAt: new Date() },
  });
}

// The thread a student already has about a listing, if any.
export async function findConversation(listingId: string, guestId: string) {
  return prisma.conversation.findUnique({
    where: { listingId_guestId: { listingId, guestId } },
    select: { id: true },
  });
}
