"use client";

import { useState } from "react";
import { QrCode, Printer, X } from "lucide-react";
import { Button } from "./button";
import { useTranslations } from "next-intl";

interface QrPrintButtonProps {
  pageUrl: string;
  fullName: string;
  dates: string;
  imageUrl?: string | null;
}

export function QrPrintButton({ pageUrl, fullName, dates, imageUrl }: QrPrintButtonProps) {
  const t = useTranslations("QR");
  const [isOpen, setIsOpen] = useState(false);

  // Generate QR code URL using api.qrserver.com (rendered as gold/dark styling!)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=d4af37&bgcolor=12110f&data=${encodeURIComponent(pageUrl)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="h-14 px-6 text-ivory-200/80 border-white/10 hover:border-gold-500/30 hover:bg-gold-500/10 hover:text-gold-300 gap-2"
      >
        <QrCode className="h-4 w-4" />
        <span>{t("buttonLabel")}</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-charcoal-900 p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-medium text-ivory-50">
                {t("modalTitle")}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-ivory-200/50 hover:bg-white/10 hover:text-ivory-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col items-center py-8 space-y-6 text-center">
              {/* QR Image */}
              <div className="relative h-52 w-52 overflow-hidden rounded-2xl border border-gold-500/20 bg-black/40 p-2">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-light text-ivory-100">{fullName}</h4>
                <p className="text-sm font-light text-gold-500/60">{dates}</p>
              </div>

              <p className="text-xs font-light leading-relaxed text-ivory-200/40 max-w-xs">
                {t("instruction")}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                {t("close")}
              </Button>
              <Button onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                <span>{t("print")}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Print Container */}
      <div className="hidden-print-container hidden">
        <div className="print-card flex flex-col items-center justify-center p-12 text-center text-black bg-white rounded-3xl border border-gray-200 w-[500px] mx-auto my-12">
          <div className="text-2xl font-bold mb-1">AngelBook</div>
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-6">{t("bookTitle")}</div>

          {imageUrl ? (
            <div className="relative h-44 w-44 overflow-hidden rounded-full border-2 border-gray-300 mb-6">
              <img
                src={imageUrl}
                alt={fullName}
                className="h-full w-full object-cover rounded-full"
              />
            </div>
          ) : (
            <div className="h-44 w-44 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <div className="h-10 w-10 border border-gray-300 rounded-full bg-white" />
            </div>
          )}

          <h2 className="text-3xl font-light mb-2">{fullName}</h2>
          <p className="text-sm font-light text-gray-600 mb-8">{dates}</p>

          {/* QR Code */}
          <div className="border border-gray-200 p-4 rounded-3xl bg-white mb-6">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=000000&bgcolor=ffffff&data=${encodeURIComponent(pageUrl)}`}
              alt="QR Code"
              className="h-48 w-48 object-contain"
            />
          </div>

          <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
            {t("printInstruction")}
          </p>
        </div>
      </div>

      {/* Print Specific CSS style injection */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .hidden-print-container,
          .hidden-print-container * {
            visibility: visible !important;
          }
          .hidden-print-container {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: white !important;
            color: black !important;
          }
          .print-card {
            border: none !important;
            box-shadow: none !important;
            margin: 40px auto !important;
          }
        }
      `}</style>
    </>
  );
}
