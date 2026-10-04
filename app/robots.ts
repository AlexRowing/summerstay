import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/_lib/email";

// Keep crawlers on public pages; private and one-time pages stay out.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account",
        "/messages",
        "/admin",
        "/api",
        "/verify",
        "/reset-password",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
