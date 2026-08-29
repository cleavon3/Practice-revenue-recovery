"use client";

declare global {
  interface Window {
    fbq?: (
      command: string,
      eventName: string,
      parameters?: Record<string, unknown>,
    ) => void;
  }
}

export function trackMetaEvent(
  eventName: string,
  parameters?: Record<string, unknown>,
) {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.fbq !== "function") {
    console.warn("Meta Pixel is not available.");

    return;
  }

  window.fbq("track", eventName, parameters);
}
