"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Flame,
  LayoutDashboard,
  Settings,
  HeartHandshake,
  AlertTriangle,
  X,
  Loader2,
  Search,
  CheckCircle,
  MessageSquare,
  Save,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deleteMemorialRecord } from "@/app/actions/memorials";
import { toggleMissingStatus, deleteMissingPerson } from "@/app/actions/missing";
import { updateUserProfile } from "@/app/actions/auth";
import { CreateMemorialForm } from "@/components/forms/create-memorial-form";
import { formatMemorialDates } from "@/lib/memorial-format";
import type { Memorial, MissingPerson, MissingReport } from "@prisma/client";

export type MissingPersonWithReports = MissingPerson & {
  reports: MissingReport[];
};

export interface UserProfileData {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

interface CabinetViewProps {
  user: UserProfileData;
  memorials: Memorial[];
  missingPersons?: MissingPersonWithReports[];
  supportTickets?: any[];
}

export function CabinetView({
  user,
  memorials,
  missingPersons = [],
  supportTickets = [],
}: CabinetViewProps) {
  const t = useTranslations("Cabinet");
  const locale = useLocale();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "memorials" | "missing" | "reports" | "support" | "settings"
  >("memorials");
  const [editingMemorial, setEditingMemorial] = useState<Memorial | null>(null);
  const [deletingMemorial, setDeletingMemorial] = useState<Memorial | null>(null);
  const [deletingMissing, setDeletingMissing] = useState<MissingPerson | null>(null);
  const [selectedReportsPerson, setSelectedReportsPerson] =
    useState<MissingPersonWithReports | null>(null);

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [isPending, startTransition] = useTransition();

  const allReports = missingPersons.flatMap((p) =>
    p.reports.map((r) => ({ ...r, personName: p.fullName }))
  );

  const totalCandles = memorials.reduce(
    (sum, m) => sum + (m.candleCount || 0),
    0
  );

  const handleDeleteMemorial = () => {
    if (!deletingMemorial) return;

    startTransition(async () => {
      const res = await deleteMemorialRecord(deletingMemorial.id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(t("toast.deleted"));
        setDeletingMemorial(null);
        router.refresh();
      }
    });
  };

  const handleDeleteMissing = () => {
    if (!deletingMissing) return;

    startTransition(async () => {
      const res = await deleteMissingPerson(deletingMissing.id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Объявление о пропаже удалено");
        setDeletingMissing(null);
        router.refresh();
      }
    });
  };

  const handleToggleStatus = (personId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "SEARCHING" ? "FOUND" : "SEARCHING";

    startTransition(async () => {
      const res = await toggleMissingStatus(personId, nextStatus);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(
          nextStatus === "FOUND"
            ? "Статус изменен на 'Найден'!"
            : "Статус изменен на 'В поиске'"
        );
        router.refresh();
      }
    });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", firstName.trim());
    formData.append("lastName", lastName.trim());

    startTransition(async () => {
      const res = await updateUserProfile(formData);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Профиль успешно обновлен!");
        router.refresh();
      }
    });
  };

  return (
    <main className="min-h-screen bg-charcoal-950 px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-light text-ivory-50 sm:text-4xl">
              {user.firstName ? t("greeting", { name: user.firstName }) : t("title")}
            </h1>
            <p className="mt-1 text-sm font-light text-ivory-200/50">
              {user.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/create">
              <Button className="gap-2 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-medium cursor-pointer">
                <Plus className="h-4 w-4" />
                <span>{t("addMemorial")}</span>
              </Button>
            </Link>
            <Link href="/missing/create">
              <Button variant="outline" className="gap-2 border-gold-500/30 text-gold-400 cursor-pointer">
                <Plus className="h-4 w-4" />
                <span>{t("addMissing")}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-light tracking-wide text-ivory-200/50 uppercase">
                {t("stats.totalMemorials")}
              </span>
              <HeartHandshake className="h-5 w-5 text-gold-400" />
            </div>
            <p className="mt-4 text-3xl font-light text-ivory-50">{memorials.length}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-light tracking-wide text-ivory-200/50 uppercase">
                {t("stats.missingPersons")}
              </span>
              <Search className="h-5 w-5 text-sky-400" />
            </div>
            <p className="mt-4 text-3xl font-light text-ivory-50">{missingPersons.length}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-light tracking-wide text-ivory-200/50 uppercase">
                {t("stats.witnessReports")}
              </span>
              <MessageSquare className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="mt-4 text-3xl font-light text-ivory-50">{allReports.length}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-light tracking-wide text-ivory-200/50 uppercase">
                {t("stats.totalCandles")}
              </span>
              <Flame className="h-5 w-5 text-amber-500" />
            </div>
            <p className="mt-4 text-3xl font-light text-ivory-50">{totalCandles}</p>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-2 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <button
                onClick={() => setActiveTab("memorials")}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-light transition-all cursor-pointer",
                  activeTab === "memorials"
                    ? "bg-gold-500/15 text-gold-300 border border-gold-500/30"
                    : "text-ivory-200/60 hover:bg-white/5 hover:text-ivory-100"
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>{t("nav.memorials")}</span>
              </button>

              <button
                onClick={() => setActiveTab("missing")}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-light transition-all cursor-pointer",
                  activeTab === "missing"
                    ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                    : "text-ivory-200/60 hover:bg-white/5 hover:text-ivory-100"
                )}
              >
                <Search className="h-4 w-4" />
                <span>{t("nav.missing")}</span>
              </button>

              <button
                onClick={() => setActiveTab("reports")}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-light transition-all cursor-pointer",
                  activeTab === "reports"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "text-ivory-200/60 hover:bg-white/5 hover:text-ivory-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4" />
                  <span>{t("nav.reports")}</span>
                </div>
                {allReports.length > 0 && (
                  <span className="rounded-full bg-emerald-500/30 px-2 py-0.5 text-xs text-emerald-300">
                    {allReports.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("support")}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-light transition-all cursor-pointer",
                  activeTab === "support"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "text-ivory-200/60 hover:bg-white/5 hover:text-ivory-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <HeartHandshake className="h-4 w-4" />
                  <span>{t("nav.support")}</span>
                </div>
                {supportTickets.length > 0 && (
                  <span className="rounded-full bg-sky-500/30 px-2 py-0.5 text-xs text-sky-300">
                    {supportTickets.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-light transition-all cursor-pointer",
                  activeTab === "settings"
                    ? "bg-gold-500/15 text-gold-300 border border-gold-500/30"
                    : "text-ivory-200/60 hover:bg-white/5 hover:text-ivory-100"
                )}
              >
                <Settings className="h-4 w-4" />
                <span>{t("nav.settings")}</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === "memorials" && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                <h2 className="mb-6 text-xl font-light text-ivory-50">
                  {t("sections.myMemorials", { count: memorials.length })}
                </h2>

                {memorials.length > 0 ? (
                  <div className="space-y-4">
                    {memorials.map((m) => {
                      const dates = formatMemorialDates(
                        m.dateOfBirth,
                        m.dateOfDeath,
                        locale
                      );

                      return (
                        <div
                          key={m.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 transition-all hover:border-white/20"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-white/10 bg-zinc-800">
                              {m.imageUrl ? (
                                <Image
                                  src={m.imageUrl}
                                  alt={m.firstName}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-ivory-200/40">
                                  <UserIcon className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="text-base font-medium text-ivory-100">
                                {m.firstName} {m.lastName}
                              </h3>
                              <p className="text-xs font-light text-ivory-200/50">
                                {dates} • {m.candleCount || 0} {t("items.candles")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link href={`/memorials/${m.id}`}>
                              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-ivory-200/60 hover:text-ivory-100 cursor-pointer">
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>{t("items.open")}</span>
                              </Button>
                            </Link>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingMemorial(m)}
                              className="gap-1.5 text-xs text-gold-400 hover:text-gold-300 cursor-pointer"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span>{t("items.edit")}</span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletingMemorial(m)}
                              className="gap-1.5 text-xs text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center text-sm font-light text-ivory-200/40">
                    {t("items.emptyMemorials")}
                  </div>
                )}
              </div>
            )}

            {activeTab === "missing" && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                <h2 className="mb-6 text-xl font-light text-ivory-50">
                  {t("sections.myMissing", { count: missingPersons.length })}
                </h2>

                {missingPersons.length > 0 ? (
                  <div className="space-y-4">
                    {missingPersons.map((p) => (
                      <div
                        key={p.id}
                        className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-white/10 bg-zinc-800">
                              {p.photoUrl ? (
                                <Image
                                  src={p.photoUrl}
                                  alt={p.fullName}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-ivory-200/40">
                                  <UserIcon className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-medium text-ivory-100">
                                  {p.fullName}
                                </h3>
                                <span
                                  className={cn(
                                    "rounded-full px-2.5 py-0.5 text-[10px] font-medium border",
                                    p.status === "SEARCHING"
                                      ? "bg-red-500/20 text-red-300 border-red-500/30"
                                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                  )}
                                >
                                  {p.status === "SEARCHING" ? t("items.searching") : t("items.found")}
                                </span>
                              </div>
                              <p className="text-xs font-light text-ivory-200/50 mt-1">
                                {p.lastLocation || t("items.noLocation")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isPending}
                              onClick={() => handleToggleStatus(p.id, p.status)}
                              className={cn(
                                "gap-1.5 text-xs border-white/10 cursor-pointer",
                                p.status === "SEARCHING"
                                  ? "text-emerald-400 hover:bg-emerald-500/10"
                                  : "text-red-400 hover:bg-red-500/10"
                              )}
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>
                                {p.status === "SEARCHING"
                                  ? t("items.markFound")
                                  : t("items.returnSearching")}
                              </span>
                            </Button>

                            {p.reports.length > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedReportsPerson(p)}
                                className="gap-1.5 text-xs border-sky-500/30 text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 cursor-pointer"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                                <span>{t("items.reports", { count: p.reports.length })}</span>
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletingMissing(p)}
                              className="gap-1.5 text-xs text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-sm font-light text-ivory-200/40">
                    {t("items.emptyMissing")}
                  </div>
                )}
              </div>
            )}

            {activeTab === "reports" && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                <h2 className="mb-6 text-xl font-light text-ivory-50">
                  {t("sections.witnessReports", { count: allReports.length })}
                </h2>

                {allReports.length > 0 ? (
                  <div className="space-y-4">
                    {allReports.map((report) => (
                      <div
                        key={report.id}
                        className="rounded-2xl border border-emerald-500/20 bg-black/40 p-5 space-y-2"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                          <div>
                            <span className="text-xs text-emerald-400 font-medium">
                              {t("items.byNotice")}: {report.personName}
                            </span>
                            <h4 className="text-sm font-medium text-ivory-100">
                              {t("items.questionFrom")}: {report.reporterName || t("items.anonymous")}
                            </h4>
                          </div>
                          <span className="text-xs text-ivory-200/40 font-mono">
                            {new Date(report.createdAt).toLocaleString(
                              locale === "ru" ? "ru-RU" : locale === "uk" ? "uk-UA" : "en-US"
                            )}
                          </span>
                        </div>

                        <div className="text-xs font-mono text-sky-300">
                          {t("items.contacts")}: {report.contactInfo}
                        </div>

                        <p className="text-sm font-light text-ivory-100/90 whitespace-pre-wrap pt-2">
                          {report.message}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-sm font-light text-ivory-200/40">
                    {t("items.emptyReports")}
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                <h2 className="mb-6 text-xl font-light text-ivory-50">
                  {t("sections.profileSettings")}
                </h2>

                <form onSubmit={handleProfileSubmit} className="space-y-5 max-w-md">
                  <div>
                    <label className="block text-xs font-light text-ivory-200/60 uppercase mb-2">
                      {t("items.emailAccount")}
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user.email}
                      className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ivory-200/50 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-light text-ivory-200/60 uppercase mb-2">
                      {t("items.firstName")}
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={t("items.firstNamePlaceholder")}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-ivory-100 placeholder:text-ivory-200/30 focus:border-gold-500/50 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-light text-ivory-200/60 uppercase mb-2">
                      {t("items.lastName")}
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={t("items.lastNamePlaceholder")}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-ivory-100 placeholder:text-ivory-200/30 focus:border-gold-500/50 focus:outline-none"
                    />
                  </div>

                  <Button type="submit" disabled={isPending} className="gap-2 cursor-pointer">
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{t("items.saving")}</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>{t("items.saveProfile")}</span>
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}

            {activeTab === "support" && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                <h2 className="mb-6 text-xl font-light text-ivory-50">
                  {t("sections.supportTickets", { count: supportTickets.length })}
                </h2>

                {supportTickets.length > 0 ? (
                  <div className="space-y-6">
                    {supportTickets.map((ticket: any) => (
                      <div
                        key={ticket.id}
                        className="rounded-2xl border border-white/5 bg-black/35 p-5 space-y-4"
                      >
                        <div className="flex justify-between items-center text-xs font-light text-ivory-200/40">
                          <span>{t("items.questionFrom")} {new Date(ticket.createdAt).toLocaleString()}</span>
                          <span className={cn(
                            "rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase",
                            ticket.adminResponse
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          )}>
                            {ticket.adminResponse ? t("items.answered") : t("items.inProgress")}
                          </span>
                        </div>

                        <p className="text-sm font-light text-ivory-100 bg-white/5 p-4 rounded-xl leading-relaxed">
                          {ticket.message}
                        </p>

                        {ticket.adminResponse ? (
                          <div className="border-t border-white/5 pt-4">
                            <div className="text-xs font-medium text-sky-400 mb-1 flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
                              {t("items.supportResponse")}
                            </div>
                            <p className="text-sm font-light text-sky-200/90 bg-sky-500/5 p-4 rounded-xl leading-relaxed border border-sky-500/10">
                              {ticket.adminResponse}
                            </p>
                          </div>
                        ) : (
                          <div className="text-xs font-light text-ivory-200/40 italic">
                            {t("supportPending")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-sm font-light text-ivory-200/40">
                    {t("emptySupport")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Memorial Modal */}
      <AnimatePresence>
        {editingMemorial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setEditingMemorial(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/15 bg-charcoal-900 p-6 shadow-2xl sm:p-8">
              <button
                onClick={() => setEditingMemorial(null)}
                className="absolute right-6 top-6 rounded-full p-2 text-ivory-200/50 hover:bg-white/10 hover:text-ivory-100"
              >
                <X className="h-5 w-5" />
              </button>
              <CreateMemorialForm
                initialData={editingMemorial}
                onSuccess={() => {
                  setEditingMemorial(null);
                  router.refresh();
                }}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Received Info Reports Modal for Owner */}
      <AnimatePresence>
        {selectedReportsPerson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setSelectedReportsPerson(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/15 bg-charcoal-900 p-6 shadow-2xl sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-medium text-ivory-50">
                    {t("sections.witnessReports", { count: selectedReportsPerson.reports.length })}
                  </h3>
                  <p className="text-xs text-sky-400 mt-0.5">
                    {t("items.byNotice")}: {selectedReportsPerson.fullName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReportsPerson(null)}
                  className="rounded-full p-1.5 text-ivory-200/50 hover:bg-white/10 hover:text-ivory-100 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 pt-6">
                {selectedReportsPerson.reports.map((report) => (
                  <div
                    key={report.id}
                    className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-ivory-200/50">
                      <span className="font-medium text-gold-400">
                        {report.reporterName || t("items.anonymous")}
                      </span>
                      <span>
                        {new Date(report.createdAt).toLocaleString(
                          locale === "ru" ? "ru-RU" : locale === "uk" ? "uk-UA" : "en-US"
                        )}
                      </span>
                    </div>

                    <div className="text-xs text-sky-300 font-mono">
                      {t("items.contacts")}: {report.contactInfo}
                    </div>

                    <p className="text-sm font-light text-ivory-100 whitespace-pre-wrap pt-1">
                      {report.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Memorial Confirmation Modal */}
      <AnimatePresence>
        {deletingMemorial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setDeletingMemorial(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <div className="relative w-full max-w-md rounded-3xl border border-red-500/20 bg-charcoal-900 p-6 text-center shadow-2xl sm:p-8">
              <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <h3 className="text-xl font-medium text-ivory-50">
                {t("deleteModal.title")}
              </h3>
              <p className="mt-2 text-sm font-light text-ivory-200/60">
                {t("deleteModal.description")}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeletingMemorial(null)}
                  className="cursor-pointer"
                >
                  {t("deleteModal.cancel")}
                </Button>
                <Button
                  variant="destructive"
                  disabled={isPending}
                  onClick={handleDeleteMemorial}
                  className="cursor-pointer"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t("deleteModal.confirm")
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Missing Person Confirmation Modal */}
      <AnimatePresence>
        {deletingMissing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setDeletingMissing(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <div className="relative w-full max-w-md rounded-3xl border border-red-500/20 bg-charcoal-900 p-6 text-center shadow-2xl sm:p-8">
              <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <h3 className="text-xl font-medium text-ivory-50">
                {t("deleteMissingModal.title")}
              </h3>
              <p className="mt-2 text-sm font-light text-ivory-200/60">
                {t("deleteMissingModal.description", { name: deletingMissing.fullName })}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeletingMissing(null)}
                  className="cursor-pointer"
                >
                  {t("deleteMissingModal.cancel")}
                </Button>
                <Button
                  variant="destructive"
                  disabled={isPending}
                  onClick={handleDeleteMissing}
                  className="cursor-pointer"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>{t("deleteMissingModal.confirm")}</span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
