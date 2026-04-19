"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as RadixToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
import { useToastStore, type ToastType } from "@/stores/toastStore";

function variantFor(type: ToastType) {
  return type === "error" ? ("destructive" as const) : ("default" as const);
}

export function ToastProvider() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <RadixToastProvider>
      {toasts.map(({ id, type, message }) => (
        <Toast
          key={id}
          variant={variantFor(type)}
          onOpenChange={(open) => {
            if (!open) dismiss(id);
          }}
        >
          <div className="grid gap-1">
            <ToastDescription>{message}</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </RadixToastProvider>
  );
}
