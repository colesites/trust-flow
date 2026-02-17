import { revalidateTag } from "next/cache";

const missingStoreMessage = "static generation store missing";

export function safeRevalidateTag(
  tag: string,
  profile: "max" | undefined = "max",
) {
  try {
    revalidateTag(tag, profile);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (!message.includes(missingStoreMessage)) {
      throw error;
    }
  }
}
