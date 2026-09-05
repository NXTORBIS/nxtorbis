import { company } from "@/content/site";

export type ContactPayload = {
  name: string;
  email: string;
  service: string;
  message: string;
  /** Optional context carried from the page the visitor came from. */
  context?: string;
};

export type SubmitResult =
  | { kind: "sent" }
  | { kind: "mailto"; href: string }
  | { kind: "error"; message: string };

/**
 * Optional backend endpoint. When set (e.g. NEXT_PUBLIC_CONTACT_ENDPOINT=https://…),
 * the form POSTs JSON to it. When it is not set, the form falls back to
 * opening the visitor's email client with a pre-filled message — and says so.
 * Nothing here pretends a message was delivered when it was not.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

export function buildMailto(payload: ContactPayload): string {
  const subject = `Project enquiry — ${payload.service}${payload.context ? ` (${payload.context})` : ""}`;
  const body = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Service: ${payload.service}`,
    payload.context ? `Context: ${payload.context}` : null,
    "",
    payload.message,
  ]
    .filter((l) => l !== null)
    .join("\n");
  return `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export async function submitContact(payload: ContactPayload): Promise<SubmitResult> {
  if (!ENDPOINT) {
    return { kind: "mailto", href: buildMailto(payload) };
  }
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return { kind: "error", message: `The server responded with ${res.status}. Please try again or email us directly.` };
    }
    return { kind: "sent" };
  } catch {
    return { kind: "error", message: "We could not reach the server. Please check your connection or email us directly." };
  }
}

export const hasBackend = Boolean(ENDPOINT);
