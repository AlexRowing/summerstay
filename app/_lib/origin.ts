import "server-only";
import { headers } from "next/headers";
import { SITE_URL } from "@/app/_lib/email";

// The base URL for links in emails. Production always uses the configured
// site URL: building links from the request's Host header would let anyone
// send a password-reset email pointing at their own domain. In development
// the request host is used so links open the local server.
export async function linkOrigin(): Promise<string> {
  if (process.env.NODE_ENV === "production") return SITE_URL;
  const host = (await headers()).get("host");
  return host ? `http://${host}` : SITE_URL;
}
