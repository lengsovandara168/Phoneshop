"use client";

import React, { useEffect } from "react";

export default function Modal({
  open,
  onCloseAction,
  title,
  children,
  className = "w-full max-w-2xl",
}: {
  open: boolean;
  onCloseAction: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseAction();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onCloseAction]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-green/40 p-4"
      onClick={onCloseAction}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Dialog"}
        onClick={(e) => e.stopPropagation()}
        className={`${className} bg-white rounded-xl shadow-xl border border-gray-100 p-6`}
      >
        {children}
      </div>
    </div>
  );
}
