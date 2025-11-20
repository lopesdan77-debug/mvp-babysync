"use client";

import { useState, useEffect } from "react";
import { Milk, Moon, Droplet, Clock, TrendingUp, ArrowRight } from "lucide-react";

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

export function Dashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
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

  const getTimeSince = (timeStr: string) => {
    const now = new Date();
    const time = new Date(timeStr);
    const diffMs = now.getTime() - time.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `Há ${diffHours}h ${diffMins}m`;
    }
    return `Há ${diffMins}m`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const lastFeeding = feedingRecords[0];
  const lastSleep = sleepRecords[0];
  const lastDiaper = diaperRecords[0];

  const todayFeedings = feedingRecords.filter(
    (r) => r.date === new Date().toLocaleDateString("pt-BR")
  );
  const todaySleep = sleepRecords.filter(
    (r) => r.date === new Date().toLocaleDateString("pt-BR")
  );
  const todayDiapers = diaperRecords.filter(
    (r) => r.date === new Date().toLocaleDateString("pt-BR")
  );

  // Calcular próxima ação sugerida
  const getNextAction = () => {
    if (!lastFeeding && !lastSleep && !lastDiaper) {
      return { action: "Registrar primeira atividade", icon: Clock, tab: "feeding" };
    }

    const feedingReminder = localStorage.getItem("feedingReminder");
    if (feedingReminder) {
      const data = JSON.parse(feedingReminder);
      if (data.enabled && lastFeeding) {
        const nextFeedingTime = new Date(
          new Date(lastFeeding.time).getTime() + data.interval * 60000
        );
        if (new Date() >= nextFeedingTime) {
          return { action: "Hora da mamada", icon: Milk, tab: "feeding" };
        }
      }
    }

    // Verificar se passou muito tempo desde última mamada (4h)
    if (lastFeeding) {
      const timeSinceFeeding = new Date().getTime() - new Date(lastFeeding.time).getTime();
      if (timeSinceFeeding > 4 * 60 * 60 * 1000) {
        return { action: "Hora da mamada", icon: Milk, tab: "feeding" };
      }
    }

    // Verificar se bebê está acordado há muito tempo (2h)
    if (lastSleep) {
      const timeSinceSleep = new Date().getTime() - new Date(lastSleep.endTime).getTime();
      if (timeSinceSleep > 2 * 60 * 60 * 1000) {
        return { action: "Hora de dormir", icon: Moon, tab: "sleep" };
      }
    }

    return { action: "Tudo em dia!", icon: TrendingUp, tab: "" };
  };

  const nextAction = getNextAction();
  const ActionIcon = nextAction.icon;

  return (
    <div className="space-y-6">
      {/* Próxima Ação Sugerida */}
      <div className="bg-gradient-to-br from-[#4A90E2] to-[#3ED1C8] rounded-2xl p-6 shadow-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <ActionIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-white/80 font-medium">Próxima Ação</p>
              <h3 className="text-2xl font-bold">{nextAction.action}</h3>
            </div>
          </div>
          {nextAction.tab && (
            <button
              onClick={() => onNavigate(nextAction.tab)}
              className="bg-white text-[#4A90E2] px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Registrar agora
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Última Atividade */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Última Atividade</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Última Mamada */}
          <div
            onClick={() => onNavigate("feeding")}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#A8D1FF] hover:border-[#4A90E2] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#D9CFFF] p-3 rounded-lg group-hover:bg-[#4A90E2] transition-colors">
                <Milk className="w-6 h-6 text-[#4A90E2] group-hover:text-white transition-colors" />
              </div>
              <span className="text-gray-600 font-medium">Última Mamada</span>
            </div>
            {lastFeeding ? (
              <>
                <p className="text-2xl font-bold text-gray-800 mb-1">
                  {getTimeSince(lastFeeding.time)}
                </p>
                <p className="text-sm text-gray-600">
                  {lastFeeding.type === "breast" ? "Peito" : "Mamadeira"}
                </p>
              </>
            ) : (
              <p className="text-gray-500">Nenhum registro</p>
            )}
          </div>

          {/* Último Sono */}
          <div
            onClick={() => onNavigate("sleep")}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#A8D1FF] hover:border-[#4A90E2] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#D9CFFF] p-3 rounded-lg group-hover:bg-[#4A90E2] transition-colors">
                <Moon className="w-6 h-6 text-[#4A90E2] group-hover:text-white transition-colors" />
              </div>
              <span className="text-gray-600 font-medium">Último Sono</span>
            </div>
            {lastSleep ? (
              <>
                <p className="text-2xl font-bold text-gray-800 mb-1">
                  {getTimeSince(lastSleep.endTime)}
                </p>
                <p className="text-sm text-gray-600">
                  Duração: {formatDuration(lastSleep.duration)}
                </p>
              </>
            ) : (
              <p className="text-gray-500">Nenhum registro</p>
            )}
          </div>

          {/* Última Fralda */}
          <div
            onClick={() => onNavigate("diaper")}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#A8D1FF] hover:border-[#4A90E2] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#D9CFFF] p-3 rounded-lg group-hover:bg-[#4A90E2] transition-colors">
                <Droplet className="w-6 h-6 text-[#4A90E2] group-hover:text-white transition-colors" />
              </div>
              <span className="text-gray-600 font-medium">Última Fralda</span>
            </div>
            {lastDiaper ? (
              <>
                <p className="text-2xl font-bold text-gray-800 mb-1">
                  {getTimeSince(lastDiaper.time)}
                </p>
                <p className="text-sm text-gray-600">
                  {lastDiaper.type === "wet"
                    ? "Xixi"
                    : lastDiaper.type === "dirty"
                    ? "Cocô"
                    : "Ambos"}
                </p>
              </>
            ) : (
              <p className="text-gray-500">Nenhum registro</p>
            )}
          </div>
        </div>
      </div>

      {/* Resumo de Hoje */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo de Hoje</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-[#D9CFFF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Milk className="w-8 h-8 text-[#4A90E2]" />
            </div>
            <p className="text-4xl font-bold text-gray-800 mb-1">{todayFeedings.length}</p>
            <p className="text-sm text-gray-600">mamadas</p>
          </div>

          <div className="text-center">
            <div className="bg-[#D9CFFF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Moon className="w-8 h-8 text-[#4A90E2]" />
            </div>
            <p className="text-4xl font-bold text-gray-800 mb-1">{todaySleep.length}</p>
            <p className="text-sm text-gray-600">sonecas</p>
          </div>

          <div className="text-center">
            <div className="bg-[#D9CFFF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Droplet className="w-8 h-8 text-[#4A90E2]" />
            </div>
            <p className="text-4xl font-bold text-gray-800 mb-1">{todayDiapers.length}</p>
            <p className="text-sm text-gray-600">fraldas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
