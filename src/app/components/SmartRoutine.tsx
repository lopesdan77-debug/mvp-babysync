"use client";

import { useState, useEffect } from "react";
import { Clock, Milk, Moon, Droplet, TrendingUp, CheckCircle } from "lucide-react";

interface FeedingRecord {
  id: string;
  type: "breast" | "bottle";
  time: string;
  date: string;
}

interface SleepRecord {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  date: string;
}

interface DiaperRecord {
  id: string;
  type: "wet" | "dirty" | "both";
  time: string;
  date: string;
}

interface TimelineEvent {
  time: Date;
  type: "feeding" | "sleep" | "diaper" | "suggestion";
  label: string;
  icon: any;
  color: string;
}

export function SmartRoutine({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[]>([]);
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [diaperRecords, setDiaperRecords] = useState<DiaperRecord[]>([]);

  useEffect(() => {
    const feeding = localStorage.getItem("feedingRecords");
    const sleep = localStorage.getItem("sleepRecords");
    const diaper = localStorage.getItem("diaperRecords");

    if (feeding) setFeedingRecords(JSON.parse(feeding));
    if (sleep) setSleepRecords(JSON.parse(sleep));
    if (diaper) setDiaperRecords(JSON.parse(diaper));
  }, []);

  // Calcular intervalo médio entre mamadas (últimos 7 dias)
  const getAverageFeedingInterval = () => {
    const last7Days = feedingRecords.filter((record) => {
      const recordDate = new Date(record.time);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return recordDate >= weekAgo;
    });

    if (last7Days.length < 2) return 180; // padrão 3h

    let totalInterval = 0;
    for (let i = 0; i < last7Days.length - 1; i++) {
      const current = new Date(last7Days[i].time);
      const next = new Date(last7Days[i + 1].time);
      totalInterval += (current.getTime() - next.getTime()) / (1000 * 60);
    }

    return Math.round(totalInterval / (last7Days.length - 1));
  };

  // Calcular intervalo médio entre sonecas
  const getAverageSleepInterval = () => {
    const last7Days = sleepRecords.filter((record) => {
      const recordDate = new Date(record.startTime);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return recordDate >= weekAgo;
    });

    if (last7Days.length < 2) return 240; // padrão 4h

    let totalInterval = 0;
    for (let i = 0; i < last7Days.length - 1; i++) {
      const current = new Date(last7Days[i].startTime);
      const next = new Date(last7Days[i + 1].startTime);
      totalInterval += (current.getTime() - next.getTime()) / (1000 * 60);
    }

    return Math.round(totalInterval / (last7Days.length - 1));
  };

  // Gerar timeline do dia
  const getTodayTimeline = (): TimelineEvent[] => {
    const today = new Date().toLocaleDateString("pt-BR");
    const events: TimelineEvent[] = [];

    // Adicionar eventos de hoje
    feedingRecords
      .filter((r) => r.date === today)
      .forEach((r) => {
        events.push({
          time: new Date(r.time),
          type: "feeding",
          label: r.type === "breast" ? "Peito" : "Mamadeira",
          icon: Milk,
          color: "bg-[#4A90E2]",
        });
      });

    sleepRecords
      .filter((r) => r.date === today)
      .forEach((r) => {
        events.push({
          time: new Date(r.startTime),
          type: "sleep",
          label: `Sono (${Math.round(r.duration / 60)}h)`,
          icon: Moon,
          color: "bg-[#D9CFFF]",
        });
      });

    diaperRecords
      .filter((r) => r.date === today)
      .forEach((r) => {
        events.push({
          time: new Date(r.time),
          type: "diaper",
          label: r.type === "wet" ? "Xixi" : r.type === "dirty" ? "Cocô" : "Ambos",
          icon: Droplet,
          color: "bg-[#3ED1C8]",
        });
      });

    // Adicionar sugestões
    const avgFeedingInterval = getAverageFeedingInterval();
    const lastFeeding = feedingRecords.find((r) => r.date === today);

    if (lastFeeding) {
      const nextFeedingTime = new Date(
        new Date(lastFeeding.time).getTime() + avgFeedingInterval * 60000
      );
      if (nextFeedingTime > new Date()) {
        events.push({
          time: nextFeedingTime,
          type: "suggestion",
          label: "Mamada sugerida",
          icon: Milk,
          color: "bg-orange-400",
        });
      }
    }

    const avgSleepInterval = getAverageSleepInterval();
    const lastSleep = sleepRecords.find((r) => r.date === today);

    if (lastSleep) {
      const nextSleepTime = new Date(
        new Date(lastSleep.endTime).getTime() + avgSleepInterval * 60000
      );
      if (nextSleepTime > new Date()) {
        events.push({
          time: nextSleepTime,
          type: "suggestion",
          label: "Sono sugerido",
          icon: Moon,
          color: "bg-purple-400",
        });
      }
    }

    // Ordenar por horário
    return events.sort((a, b) => a.time.getTime() - b.time.getTime());
  };

  const avgFeedingInterval = getAverageFeedingInterval();
  const avgSleepInterval = getAverageSleepInterval();
  const timeline = getTodayTimeline();

  const lastFeeding = feedingRecords[0];
  const nextFeedingTime = lastFeeding
    ? new Date(new Date(lastFeeding.time).getTime() + avgFeedingInterval * 60000)
    : null;

  return (
    <div className="space-y-6">
      {/* Análise de Padrões */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Intervalo de Mamadas */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#A8D1FF]">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#D9CFFF] p-3 rounded-lg">
              <Milk className="w-6 h-6 text-[#4A90E2]" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Padrão de Mamadas</h3>
          </div>
          <p className="text-gray-700 mb-2">
            Bebê costuma mamar a cada{" "}
            <span className="font-bold text-[#4A90E2]">
              {Math.floor(avgFeedingInterval / 60)}h {avgFeedingInterval % 60}m
            </span>
          </p>
          {nextFeedingTime && (
            <div className="bg-[#F2F4F7] rounded-xl p-3 mt-3">
              <p className="text-sm text-gray-600">Próxima mamada sugerida:</p>
              <p className="text-lg font-bold text-[#4A90E2]">
                {nextFeedingTime.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </div>

        {/* Intervalo de Sono */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#A8D1FF]">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#D9CFFF] p-3 rounded-lg">
              <Moon className="w-6 h-6 text-[#4A90E2]" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Padrão de Sono</h3>
          </div>
          <p className="text-gray-700 mb-2">
            Bebê costuma dormir a cada{" "}
            <span className="font-bold text-[#4A90E2]">
              {Math.floor(avgSleepInterval / 60)}h {avgSleepInterval % 60}m
            </span>
          </p>
          <div className="bg-[#F2F4F7] rounded-xl p-3 mt-3">
            <p className="text-sm text-gray-600">Baseado nos últimos 7 dias</p>
          </div>
        </div>
      </div>

      {/* Timeline do Dia */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#D9CFFF] p-3 rounded-lg">
            <Clock className="w-6 h-6 text-[#4A90E2]" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Timeline de Hoje</h3>
        </div>

        {timeline.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhuma atividade registrada hoje</p>
        ) : (
          <div className="relative">
            {/* Linha vertical */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

            {/* Eventos */}
            <div className="space-y-6">
              {timeline.map((event, index) => {
                const EventIcon = event.icon;
                const isPast = event.time <= new Date();
                const isSuggestion = event.type === "suggestion";

                return (
                  <div key={index} className="relative flex items-start gap-4">
                    {/* Ícone */}
                    <div
                      className={`relative z-10 ${event.color} p-2 rounded-full ${
                        isSuggestion ? "ring-4 ring-orange-100 animate-pulse" : ""
                      }`}
                    >
                      <EventIcon className="w-5 h-5 text-white" />
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1">
                      <div
                        className={`rounded-xl p-4 ${
                          isSuggestion
                            ? "bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200"
                            : "bg-[#F2F4F7]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-bold text-gray-800">{event.label}</p>
                          <p className="text-sm text-gray-600">
                            {event.time.toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {isSuggestion && (
                          <button
                            onClick={() => onNavigate(event.type === "suggestion" && event.label.includes("Mamada") ? "feeding" : "sleep")}
                            className="mt-2 w-full bg-gradient-to-r from-[#4A90E2] to-[#3ED1C8] text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Seguir sugestão
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="bg-gradient-to-br from-[#D9CFFF] to-[#A8D1FF] rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/50 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-[#4A90E2]" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Análise dos Últimos 7 Dias</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">
              {feedingRecords.filter((r) => {
                const recordDate = new Date(r.time);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return recordDate >= weekAgo;
              }).length}
            </p>
            <p className="text-sm text-gray-700">Mamadas</p>
          </div>

          <div className="bg-white/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">
              {sleepRecords.filter((r) => {
                const recordDate = new Date(r.startTime);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return recordDate >= weekAgo;
              }).length}
            </p>
            <p className="text-sm text-gray-700">Sonecas</p>
          </div>

          <div className="bg-white/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">
              {diaperRecords.filter((r) => {
                const recordDate = new Date(r.time);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return recordDate >= weekAgo;
              }).length}
            </p>
            <p className="text-sm text-gray-700">Fraldas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
