"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/app/_lib/db";
import { SITE_URL, sendMessageEmail } from "@/app/_lib/email";

export type MessageState = { error?: string; sentAt?: number };

const MAX_LENGTH = 2000;

function readBody(formData: FormData): string | { error: string } {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Write a message first." };
  if (body.length > MAX_LENGTH) {
    return { error: `Keep it under ${MAX_LENGTH} characters.` };
  }
  return body;
}

// At most 30 messages per person per 10 minutes: plenty for a real chat,
// too few to spam with.
async function overLimit(senderId: string): Promise<boolean> {
  const recent = await prisma.message.count({
    where: {
      senderId,
      createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
    },
  });
  return recent >= 30;
}

// Add a message to a thread, bump it to the top of both inboxes, and email
// the other person if this is the first thing they haven't seen yet.
async function postMessage(
  conversationId: string,
  senderId: string,
  body: string,
): Promise<void> {
  const convo = await prisma.conversation.findUniqueOrThrow({
    where: { id: conversationId },
    include: {
      listing: { select: { title: true } },
      host: { select: { id: true, email: true, name: true } },
      guest: { select: { id: true, email: true, name: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  const senderIsHost = convo.hostId === senderId;
  const recipient = senderIsHost ? convo.guest : convo.host;
  const sender = senderIsHost ? convo.host : convo.guest;
  const recipientReadAt = senderIsHost ? convo.guestReadAt : convo.hostReadAt;

  // Did the recipient already have something unread from us?
  const last = convo.messages[0];
  const alreadyUnread =
    last !== undefined &&
    last.senderId === senderId &&
    (!recipientReadAt || last.createdAt > recipientReadAt);

  const now = new Date();
  await prisma.$transaction([
    prisma.message.create({ data: { conversationId, senderId, body } }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: now,
        // Sending counts as having read the thread.
        ...(senderIsHost ? { hostReadAt: now } : { guestReadAt: now }),
      },
    }),
  ]);

  if (!alreadyUnread) {
    after(() =>
      sendMessageEmail({
        to: recipient.email,
        toName: recipient.name,
        fromName: sender.name?.trim() || "A SummerStay member",
        listingTitle: convo.listing.title,
        body,
        threadUrl: `${SITE_URL}/messages/${conversationId}`,
      }),
    );
  }
}

// First message from a student to a host, from the listing page.
export async function startConversation(
  _prev: MessageState,
  formData: FormData,
): Promise<MessageState> {
  const session = await auth();
  const userId = session?.user?.id;
  const listingId = String(formData.get("listingId") ?? "");
  if (!userId) redirect(`/login?next=/listings/${listingId}`);

  const body = readBody(formData);
  if (typeof body !== "string") return body;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (
    !listing ||
    !listing.ownerId ||
    listing.isTaken ||
    listing.removedAt ||
    (listing.endDate && listing.endDate < today)
  ) {
    return { error: "This listing isn't taking messages anymore." };
  }
  if (listing.ownerId === userId) {
    return { error: "This is your own listing." };
  }
  if (await overLimit(userId)) {
    return {
      error: "You're sending a lot of messages. Try again in a few minutes.",
    };
  }

  const convo = await prisma.conversation.upsert({
    where: { listingId_guestId: { listingId, guestId: userId } },
    create: { listingId, hostId: listing.ownerId, guestId: userId },
    update: {},
  });
  await postMessage(convo.id, userId, body);

  revalidatePath("/messages");
  redirect(`/messages/${convo.id}`);
}

// A reply inside an existing thread.
export async function sendMessage(
  _prev: MessageState,
  formData: FormData,
): Promise<MessageState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "Your session ended. Log in again." };

  const conversationId = String(formData.get("conversationId") ?? "");
  const convo = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { hostId: true, guestId: true },
  });
  if (!convo || (convo.hostId !== userId && convo.guestId !== userId)) {
    return { error: "That conversation doesn't exist." };
  }

  const body = readBody(formData);
  if (typeof body !== "string") return body;
  if (await overLimit(userId)) {
    return {
      error: "You're sending a lot of messages. Try again in a few minutes.",
    };
  }

  await postMessage(conversationId, userId, body);
  revalidatePath(`/messages/${conversationId}`);
  revalidatePath("/messages");
  return { sentAt: Date.now() };
}
