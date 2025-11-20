"use client";

import { useState, useEffect } from "react";
import { Moon, AlertTriangle, TrendingUp, Clock, Lightbulb } from "lucide-react";

interface SleepRecord {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  date: string;
}

interface FeedingRecord {
  id: string;
  type: "breast" | "bottle";
  time: string;
  date: string;
}

export function SleepAnalysis() {
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[]>([]);
  const [babyAge, setBabyAge] = useState(0); // em meses

  useEffect(() => {
    const sleep = localStorage.getItem("sleepRecords");
    const feeding = localStorage.getItem("feedingRecords");
    const birthDate = localStorage.getItem("babyBirthDate");

    if (sleep) setSleepRecords(JSON.parse(sleep));
    if (feeding) setFeedingRecords(JSON.parse(feeding));

    if (birthDate) {
      const birth = new Date(birthDate);
      const now = new Date();
      const months = Math.floor(
        (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30)
      );
      setBabyAge(months);
    }
  }, []);

  // Calcular total de sono nas últimas 24h
  const getLast24HoursSleep = () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return sleepRecords
      .filter((record) => new Date(record.endTime) >= yesterday)
      .reduce((total, record) => total + record.duration, 0);
  };

  // Obter horas recomendadas por idade
  const getRecommendedSleep = () => {
    if (babyAge <= 3) return { min: 14, max: 17 };
    if (babyAge <= 11) return { min: 12, max: 15 };
    if (babyAge <= 24) return { min: 11, max: 14 };
    return { min: 10, max: 13 };
  };

  // Analisar padrão de sono após mamadas
  const analyzeSleepPattern = () => {
    const last7Days = sleepRecords.filter((record) => {
      const recordDate = new Date(record.startTime);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return recordDate >= weekAgo;
    });

    if (last7Days.length === 0 || feedingRecords.length === 0) return null;

    // Encontrar sonos longos (>2h)
    const longSleeps = last7Days.filter((sleep) => sleep.duration > 120);

    if (longSleeps.length === 0) return null;

    // Analisar mamadas antes dos sonos longos
    const feedingHours: { [key: string]: number } = {};

    longSleeps.forEach((sleep) => {
      const sleepStart = new Date(sleep.startTime);
      // Procurar mamadas nas 2h antes do sono
      const relevantFeedings = feedingRecords.filter((feeding) => {
        const feedingTime = new Date(feeding.time);
        const timeDiff = sleepStart.getTime() - feedingTime.getTime();
        return timeDiff > 0 && timeDiff <= 2 * 60 * 60 * 1000;
      });

      relevantFeedings.forEach((feeding) => {
        const hour = new Date(feeding.time).getHours();
        feedingHours[hour] = (feedingHours[hour] || 0) + 1;
      });
    });

    // Encontrar hora mais comum
    const mostCommonHour = Object.entries(feedingHours).sort(
      ([, a], [, b]) => b - a
    )[0];

    if (!mostCommonHour) return null;

    return {
      hour: parseInt(mostCommonHour[0]),
      count: mostCommonHour[1],
    };
  };

  // Sugerir janela de sono ideal
  const getSleepWindowSuggestion = () => {
    if (babyAge <= 3) {
      return "Bebês de 0-3 meses dormem em ciclos curtos. Tente criar rotina de sono após mamadas.";
    }
    if (babyAge <= 11) {
      return "Estabeleça horários regulares para sonecas (manhã e tarde) e sono noturno às 19h-20h.";
    }
    if (babyAge <= 24) {
      return "Mantenha 1-2 sonecas durante o dia e sono noturno consistente às 19h-20h.";
    }
    return "Mantenha 1 soneca após almoço e sono noturno consistente às 20h-21h.";
  };

  const totalSleep24h = getLast24HoursSleep();
  const totalSleepHours = totalSleep24h / 60;
  const recommended = getRecommendedSleep();
  const sleepPattern = analyzeSleepPattern();
  const isBelowRecommended = totalSleepHours < recommended.min;

  return (
    <div className="space-y-6">
      {/* Indicador de Sono */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#D9CFFF] p-3 rounded-lg">
            <Moon className="w-6 h-6 text-[#4A90E2]" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Sono nas Últimas 24h</h3>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Bebê dormiu {totalSleepHours.toFixed(1)}h de {recommended.min}-{recommended.max}h recomendadas</span>
            <span>{Math.round((totalSleepHours / recommended.max) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isBelowRecommended
                  ? "bg-gradient-to-r from-orange-400 to-red-500"
                  : "bg-gradient-to-r from-[#4A90E2] to-[#3ED1C8]"
              }`}
              style={{
                width: `${Math.min((totalSleepHours / recommended.max) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {isBelowRecommended && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-orange-800">
                ⚠️ Bebê está dormindo abaixo do esperado para a idade
              </p>
              <p className="text-sm text-orange-700 mt-1">
                Tente estabelecer uma rotina de sono mais consistente e consulte o pediatra se persistir.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tabela de Referência */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#D9CFFF] p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-[#3ED1C8]" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Horas Recomendadas por Idade</h3>
        </div>

        <div className="space-y-3">
          {[
            { age: "0-3 meses", hours: "14-17h", active: babyAge <= 3 },
            { age: "4-11 meses", hours: "12-15h", active: babyAge >= 4 && babyAge <= 11 },
            { age: "1-2 anos", hours: "11-14h", active: babyAge >= 12 && babyAge <= 24 },
            { age: "3-5 anos", hours: "10-13h", active: babyAge > 24 },
          ].map((item) => (
            <div
              key={item.age}
              className={`p-4 rounded-xl transition-all ${
                item.active
                  ? "bg-gradient-to-r from-[#4A90E2] to-[#3ED1C8] text-white"
                  : "bg-[#F2F4F7] text-gray-700"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{item.age}</span>
                <span className="text-lg font-bold">{item.hours}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Padrão Identificado */}
      {sleepPattern && (
        <div className="bg-gradient-to-br from-[#D9CFFF] to-[#A8D1FF] rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/50 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-[#4A90E2]" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Padrão Identificado</h3>
          </div>

          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-gray-800 font-medium">
              🌙 Bebê costuma dormir melhor após mamada às{" "}
              <span className="text-[#4A90E2] font-bold">
                {sleepPattern.hour}:00h
              </span>
            </p>
            <p className="text-sm text-gray-700 mt-2">
              Identificado em {sleepPattern.count} ocasiões nos últimos 7 dias
            </p>
          </div>
        </div>
      )}

      {/* Sugestão de Janela de Sono */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#D9CFFF] p-3 rounded-lg">
            <Lightbulb className="w-6 h-6 text-[#4A90E2]" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Janela de Sono Ideal</h3>
        </div>

        <div className="bg-[#F2F4F7] rounded-xl p-4">
          <p className="text-gray-800">{getSleepWindowSuggestion()}</p>
        </div>
      </div>
    </div>
  );
}
