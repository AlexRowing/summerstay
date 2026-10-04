import { redirect } from "next/navigation";

// The inbox moved to /messages. Kept so older email links still work.
export default function InboxPage() {
  redirect("/messages");
}
