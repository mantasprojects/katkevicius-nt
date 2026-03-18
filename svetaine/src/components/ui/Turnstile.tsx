"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface TurnstileProps {
  onVerify: (token: string) => void;
  theme?: "light" | "dark" | "auto";
}

export default function Turnstile({ onVerify, theme = "auto" }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const renderTurnstile = () => {
    if (typeof window !== "undefined" && (window as any).turnstile && containerRef.current) {
      // Clear previous widget if exists to avoid duplicates on re-render
      if (widgetIdRef.current) {
        try {
          (window as any).turnstile.remove(widgetIdRef.current);
        } catch (err) {
          // ignore
        }
      }

      const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";
      const siteKey = isLocalhost ? "1x00000000000000000000BB" : process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

      widgetIdRef.current = (window as any).turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        theme: theme,
        "response-field": false, // We handle the token manually via callback to form state
      });
    }
  };

  useEffect(() => {
    // If Script is already loaded, render immediately
    if (typeof window !== "undefined" && (window as any).turnstile) {
      renderTurnstile();
    }
    
    return () => {
      if (widgetIdRef.current && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(widgetIdRef.current);
        } catch (err) {
          // ignore
        }
      }
    };
  }, [onVerify, theme]);

  return (
    <div className="flex justify-center my-3">
      <Script 
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" 
        onLoad={renderTurnstile}
        strategy="lazyOnload"
      />
      <div ref={containerRef} className="cf-turnstile" style={{ minHeight: '65px' }} />
    </div>
  );
}
