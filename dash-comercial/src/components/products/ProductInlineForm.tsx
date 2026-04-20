"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductInlineFormProps {
  onCreate: (name: string) => void;
  onUpdate?: (name: string) => void;
  onCancel?: () => void;
  initial?: string;
}

export function ProductInlineForm({
  onCreate,
  onUpdate,
  onCancel,
  initial,
}: ProductInlineFormProps) {
  const [value, setValue] = useState(initial ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initial !== undefined) inputRef.current?.focus();
  }, [initial]);

  const isEdit = initial !== undefined;
  const trimmed = value.trim();
  const changed = trimmed !== (initial ?? "");
  const canSubmit = trimmed.length > 0 && (isEdit ? changed : true);

  function submit() {
    if (!canSubmit) return;
    if (isEdit) onUpdate?.(trimmed);
    else {
      onCreate(trimmed);
      setValue("");
    }
  }

  function handleBlur() {
    if (!isEdit) return;
    if (!changed) onCancel?.();
    else if (canSubmit) onUpdate?.(trimmed);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex items-center gap-2"
    >
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={isEdit ? undefined : "Novo produto"}
        maxLength={60}
      />
      <Button
        type="submit"
        size="icon"
        aria-label="Salvar"
        disabled={!canSubmit}
      >
        <Check className="size-4" aria-hidden />
      </Button>
    </form>
  );
}
