"use client";

import { useEffect } from "react";

export function ResponseLogger() {
  useEffect(() => {
    const logResponse = async () => {
      try {
        const requestId = document
          .querySelector('meta[name="x-request-id"]')
          ?.getAttribute("content");

        if (!requestId) return;

        const pathname = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);

        let responseStatus = 200;

        if (document.title.includes("404") || pathname === "/404") {
          responseStatus = 404;
        } else if (document.title.includes("500") || pathname === "/500") {
          responseStatus = 500;
        }

        await fetch("/api/logger", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            level: "info",
            response: {
              url: window.location.href,
              status: responseStatus,
              pathname,
              searchParams: Object.fromEntries(searchParams.entries()),
              requestId,
              timestamp: new Date().toISOString(),
            },
          }),
        });
      } catch (error) {
        try {
          await fetch("/api/logger", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              level: "error",
              error: (error as Error).message,
            }),
          });
        } catch (err) {
          console.error("Failed to log response:", err);
        }
      }
    };

    const timer = setTimeout(logResponse, 100);
    return () => clearTimeout(timer);
  }, []);

  return null;
}

