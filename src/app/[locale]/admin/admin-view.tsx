"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Check,
  Trash2,
  Calendar,
  MapPin,
  User,
  Activity,
  Undo2,
  MessageSquare,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import {
  approveMemorial,
  rejectMemorial,
  approveMissingPerson,
  rejectMissingPerson,
  unapproveMemorial,
  unapproveMissingPerson,
} from "@/app/actions/admin";
import { respondToSupportTicket } from "@/app/actions/support";

interface AdminViewProps {
  isAdmin: boolean;
  userId: string;
  pendingMemorials: any[];
  approvedMemorials: any[];
  pendingMissing: any[];
  approvedMissing: any[];
  pendingTickets: any[];
  repliedTickets: any[];
}

export function AdminView({
  isAdmin,
  userId,
  pendingMemorials = [],
  approvedMemorials = [],
  pendingMissing = [],
  approvedMissing = [],
  pendingTickets = [],
  repliedTickets = [],
}: AdminViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"memorials" | "missing" | "support">("memorials");
  const [subTab, setSubTab] = useState<"pending" | "live">("pending");
  const [isPending, startTransition] = useTransition();
  const [ticketReplies, setTicketReplies] = useState<Record<string, string>>({});

  const handleApproveMemorial = (id: string) => {
    startTransition(async () => {
      const res = await approveMemorial(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Мемориал одобрен и опубликован!");
        router.refresh();
      }
    });
  };

  const handleRejectMemorial = (id: string) => {
    startTransition(async () => {
      const res = await rejectMemorial(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Мемориал успешно удален.");
        router.refresh();
      }
    });
  };

  const handleUnapproveMemorial = (id: string) => {
    startTransition(async () => {
      const res = await unapproveMemorial(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Мемориал возвращен на модерацию.");
        router.refresh();
      }
    });
  };

  const handleApproveMissing = (id: string) => {
    startTransition(async () => {
      const res = await approveMissingPerson(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Объявление одобрено и опубликовано!");
        router.refresh();
      }
    });
  };

  const handleRejectMissing = (id: string) => {
    startTransition(async () => {
      const res = await rejectMissingPerson(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Объявление успешно удалено.");
        router.refresh();
      }
    });
  };

  const handleUnapproveMissing = (id: string) => {
    startTransition(async () => {
      const res = await unapproveMissingPerson(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Объявление возвращено на модерацию.");
        router.refresh();
      }
    });
  };

  const handleSendReply = (ticketId: string) => {
    const text = ticketReplies[ticketId]?.trim();
    if (!text) {
      toast.error("Пожалуйста, напишите ответ перед отправкой.");
      return;
    }

    startTransition(async () => {
      const res = await respondToSupportTicket(ticketId, text);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Ответ успешно отправлен пользователю!");
        setTicketReplies((prev) => ({ ...prev, [ticketId]: "" }));
        router.refresh();
      }
    });
  };

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">
          <ShieldAlert className="mx-auto h-16 w-16 text-gold-400 mb-6" />
          <h1 className="text-2xl font-light text-ivory-50 mb-3">Доступ ограничен</h1>
          <p className="text-sm font-light text-ivory-200/50">
            Данный раздел доступен только администраторам системы.
          </p>
        </div>
      </main>
    );
  }

  const memorialsToShow = subTab === "pending" ? pendingMemorials : approvedMemorials;
  const missingToShow = subTab === "pending" ? pendingMissing : approvedMissing;
  const ticketsToShow = subTab === "pending" ? pendingTickets : repliedTickets;

  return (
    <main className="min-h-screen bg-charcoal-950 px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-light text-ivory-50 sm:text-4xl">Панель модерации</h1>
          <p className="mt-1 text-sm font-light text-ivory-200/50">
            Одобрение, отклонение и управление всеми записями
          </p>
        </div>

        {/* Model Tabs Selector */}
        <div className="mb-6 flex border-b border-white/10">
          <button
            onClick={() => {
              setActiveTab("memorials");
              setSubTab("pending");
            }}
            className={`px-6 py-3 text-sm font-light transition-all border-b-2 ${
              activeTab === "memorials"
                ? "border-gold-500 text-gold-300 font-medium"
                : "border-transparent text-ivory-200/60 hover:text-ivory-100"
            }`}
          >
            Мемориалы ({pendingMemorials.length + approvedMemorials.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("missing");
              setSubTab("pending");
            }}
            className={`px-6 py-3 text-sm font-light transition-all border-b-2 ${
              activeTab === "missing"
                ? "border-sky-500 text-sky-300 font-medium"
                : "border-transparent text-ivory-200/60 hover:text-ivory-100"
            }`}
          >
            Пропавшие без вести ({pendingMissing.length + approvedMissing.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("support");
              setSubTab("pending");
            }}
            className={`px-6 py-3 text-sm font-light transition-all border-b-2 ${
              activeTab === "support"
                ? "border-emerald-500 text-emerald-300 font-medium"
                : "border-transparent text-ivory-200/60 hover:text-ivory-100"
            }`}
          >
            Служба поддержки ({pendingTickets.length + repliedTickets.length})
          </button>
        </div>

        {/* Status Sub-tabs Selector */}
        <div className="mb-8 flex gap-2">
          <button
            onClick={() => setSubTab("pending")}
            className={`rounded-xl px-4 py-2 text-xs font-light transition-all border ${
              subTab === "pending"
                ? activeTab === "memorials"
                  ? "bg-gold-500/10 text-gold-400 border-gold-500/30"
                  : activeTab === "missing"
                    ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-transparent text-ivory-200/50 border-white/5 hover:border-white/10 hover:text-ivory-200"
            }`}
          >
            {activeTab === "support" ? "Новые вопросы" : "На модерации"} (
            {activeTab === "memorials"
              ? pendingMemorials.length
              : activeTab === "missing"
                ? pendingMissing.length
                : pendingTickets.length}
            )
          </button>

          <button
            onClick={() => setSubTab("live")}
            className={`rounded-xl px-4 py-2 text-xs font-light transition-all border ${
              subTab === "live"
                ? activeTab === "memorials"
                  ? "bg-gold-500/10 text-gold-400 border-gold-500/30"
                  : activeTab === "missing"
                    ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-transparent text-ivory-200/50 border-white/5 hover:border-white/10 hover:text-ivory-200"
            }`}
          >
            {activeTab === "support" ? "Отвеченные" : "Опубликованные"} (
            {activeTab === "memorials"
              ? approvedMemorials.length
              : activeTab === "missing"
                ? approvedMissing.length
                : repliedTickets.length}
            )
          </button>
        </div>

        {/* Render Lists */}
        <div>
          {activeTab === "memorials" ? (
            memorialsToShow.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {memorialsToShow.map((m) => (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-white/15"
                  >
                    {/* Image */}
                    <div className="relative h-44 w-full md:w-44 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                      {m.imageUrl ? (
                        <Image
                          src={m.imageUrl}
                          alt={m.firstName}
                          fill
                          sizes="176px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-ivory-200/20">
                          <User className="h-10 w-10" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-xl font-medium text-ivory-50">
                          {m.firstName} {m.lastName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-light text-ivory-200/50">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {m.dateOfBirth
                              ? new Date(m.dateOfBirth).toLocaleDateString()
                              : "—"}{" "}
                            -{" "}
                            {m.dateOfDeath
                              ? new Date(m.dateOfDeath).toLocaleDateString()
                              : "—"}
                          </span>
                        </div>
                        {m.biography && (
                          <p className="text-sm font-light text-ivory-200/70 line-clamp-3">
                            {m.biography}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-4">
                        {subTab === "pending" ? (
                          <>
                            <Button
                              disabled={isPending}
                              onClick={() => handleApproveMemorial(m.id)}
                              className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                            >
                              <Check className="h-4 w-4" />
                              <span>Одобрить</span>
                            </Button>
                            <Button
                              disabled={isPending}
                              onClick={() => handleRejectMemorial(m.id)}
                              variant="destructive"
                              className="gap-1.5"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Отклонить и удалить</span>
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              disabled={isPending}
                              onClick={() => handleUnapproveMemorial(m.id)}
                              variant="outline"
                              className="gap-1.5 border-white/10 text-ivory-200 hover:bg-white/5"
                            >
                              <Undo2 className="h-4 w-4" />
                              <span>Вернуть на модерацию</span>
                            </Button>
                            <Button
                              disabled={isPending}
                              onClick={() => handleRejectMemorial(m.id)}
                              variant="destructive"
                              className="gap-1.5"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Удалить</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-sm font-light text-ivory-200/40 border border-dashed border-white/10 rounded-3xl">
                {subTab === "pending"
                  ? "Нет новых мемориалов на модерации."
                  : "Опубликованные мемориалы отсутствуют."}
              </div>
            )
          ) : activeTab === "missing" ? (
            missingToShow.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {missingToShow.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-white/15"
                  >
                    {/* Photo */}
                    <div className="relative h-44 w-full md:w-44 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                      {p.photoUrl ? (
                        <Image
                          src={p.photoUrl}
                          alt={p.fullName}
                          fill
                          sizes="176px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-ivory-200/20">
                          <User className="h-10 w-10" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-xl font-medium text-ivory-50">{p.fullName}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-light text-ivory-200/50">
                          {p.age && (
                            <div className="flex items-center gap-1.5">
                              <Activity className="h-3.5 w-3.5" />
                              <span>Возраст: {p.age} лет</span>
                            </div>
                          )}
                          {p.lastLocation && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>Последнее место: {p.lastLocation}</span>
                            </div>
                          )}
                        </div>
                        {p.distinctiveFeatures && (
                          <p className="text-sm font-light text-ivory-200/70 line-clamp-3">
                            <span className="font-medium text-gold-400">Особые приметы:</span>{" "}
                            {p.distinctiveFeatures}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-4">
                        {subTab === "pending" ? (
                          <>
                            <Button
                              disabled={isPending}
                              onClick={() => handleApproveMissing(p.id)}
                              className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                            >
                              <Check className="h-4 w-4" />
                              <span>Одобрить</span>
                            </Button>
                            <Button
                              disabled={isPending}
                              onClick={() => handleRejectMissing(p.id)}
                              variant="destructive"
                              className="gap-1.5"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Отклонить и удалить</span>
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              disabled={isPending}
                              onClick={() => handleUnapproveMissing(p.id)}
                              variant="outline"
                              className="gap-1.5 border-white/10 text-ivory-200 hover:bg-white/5"
                            >
                              <Undo2 className="h-4 w-4" />
                              <span>Вернуть на модерацию</span>
                            </Button>
                            <Button
                              disabled={isPending}
                              onClick={() => handleRejectMissing(p.id)}
                              variant="destructive"
                              className="gap-1.5"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Удалить</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-sm font-light text-ivory-200/40 border border-dashed border-white/10 rounded-3xl">
                {subTab === "pending"
                  ? "Нет новых объявлений на модерации."
                  : "Опубликованные объявления отсутствуют."}
              </div>
            )
          ) : (
            /* Support Tickets Tab */
            ticketsToShow.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {ticketsToShow.map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div className="text-xs font-light text-ivory-200/50">
                        Отправитель:{" "}
                        <span className="font-medium text-emerald-400">
                          {t.user?.email || "Пользователь"}
                        </span>
                      </div>
                      <div className="text-xs font-light text-ivory-200/30">
                        {new Date(t.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="text-sm font-light text-ivory-100/90 leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/5">
                      {t.message}
                    </div>

                    {t.adminResponse ? (
                      <div className="mt-2 space-y-1">
                        <div className="text-xs font-medium text-gold-400">Ваш ответ:</div>
                        <div className="text-sm font-light text-ivory-200/80 bg-gold-500/5 border border-gold-500/10 p-4 rounded-2xl">
                          {t.adminResponse}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 flex flex-col gap-2">
                        <textarea
                          rows={2}
                          placeholder="Напишите ответ..."
                          value={ticketReplies[t.id] || ""}
                          onChange={(e) =>
                            setTicketReplies((prev) => ({ ...prev, [t.id]: e.target.value }))
                          }
                          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-ivory-100 placeholder:text-ivory-200/30 focus:border-emerald-500/50 focus:outline-none resize-none"
                        />
                        <div className="flex justify-end">
                          <Button
                            disabled={isPending}
                            onClick={() => handleSendReply(t.id)}
                            className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                          >
                            {isPending ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Send className="h-3.5 w-3.5" />
                            )}
                            <span>Ответить</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-sm font-light text-ivory-200/40 border border-dashed border-white/10 rounded-3xl">
                {subTab === "pending"
                  ? "Нет новых вопросов от пользователей."
                  : "История ответов пуста."}
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}
