import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/_lib/email";
import { getListings } from "@/app/_lib/listings";

// Rebuilt at most hourly so new listings get found by search engines.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getListings();
  const pages = ["", "/listings", "/host", "/contact", "/privacy", "/terms"];
  return [
    ...pages.map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "daily" as const,
      priority: path === "" ? 1 : 0.6,
    })),
    ...listings.map((l) => ({
      url: `${SITE_URL}/listings/${l.id}`,
      lastModified: l.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
