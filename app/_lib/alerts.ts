import "server-only";
import { prisma } from "@/app/_lib/db";
import { sendAlertEmail } from "@/app/_lib/email";
import { describeAlert, termFor } from "@/app/_lib/format";

// Email everyone whose saved search matches a newly posted listing. One email
// per person even if several of their alerts match; never the poster.
export async function notifySearchAlerts(listingId: string): Promise<void> {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { owner: { select: { vtVerifiedAt: true } } },
  });
  if (!listing || listing.isTaken || listing.removedAt) return;

  const alerts = await prisma.searchAlert.findMany({
    where: { userId: { not: listing.ownerId ?? undefined } },
    include: { user: { select: { email: true, name: true } } },
  });

  const term = termFor(listing.availability, listing.startDate);
  const haystack = [listing.city, listing.neighborhood, listing.title]
    .join(" ")
    .toLowerCase();
  const verified = Boolean(listing.owner?.vtVerifiedAt);

  const matches = alerts.filter(
    (a) =>
      (!a.q || haystack.includes(a.q.toLowerCase())) &&
      (a.maxPrice === null || listing.pricePerMonth <= a.maxPrice) &&
      (a.bedrooms === null || listing.bedrooms >= a.bedrooms) &&
      (!a.term || a.term === term) &&
      (!a.verified || verified),
  );

  const byUser = new Map<string, (typeof matches)[number]>();
  for (const alert of matches) {
    if (!byUser.has(alert.userId)) byUser.set(alert.userId, alert);
  }

  for (const alert of byUser.values()) {
    try {
      await sendAlertEmail({
        to: alert.user.email,
        name: alert.user.name,
        search: describeAlert(alert),
        listing: {
          id: listing.id,
          title: listing.title,
          pricePerMonth: listing.pricePerMonth,
          neighborhood: listing.neighborhood,
          availability: listing.availability,
        },
      });
    } catch (error) {
      console.error("Alert email failed:", error);
    }
  }
}
