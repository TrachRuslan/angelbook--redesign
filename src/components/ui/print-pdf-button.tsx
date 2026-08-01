"use client";

import { Printer } from "lucide-react";
import { Button } from "./button";

interface PrintPdfButtonProps {
  label: string;
}

export function PrintPdfButton({ label }: PrintPdfButtonProps) {
  return (
    <Button
      onClick={() => window.print()}
      variant="outline"
      className="h-14 px-6 text-ivory-200/80 border-white/10 hover:border-gold-500/30 hover:bg-gold-500/10 hover:text-gold-300 gap-2 cursor-pointer"
    >
      <Printer className="h-4 w-4 text-gold-400" />
      <span>{label}</span>
    </Button>
  );
}
