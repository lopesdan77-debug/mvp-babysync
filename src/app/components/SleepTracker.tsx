"use client";

import { useState, useEffect } from "react";
import { Moon, Plus, Clock, TrendingUp, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ReportGenerator } from "./ReportGenerator";
import { ReportGenerator } from "./ReportGenerator";
import { ReportGenerator } from "./ReportGenerator";
import { ReportGenerator } from "./ReportGenerator";
import { ReportGenerator } from "./ReportGenerator";
import { ReportGenerator } from "./ReportGenerator";
import { ReportGenerator } from "./ReportGenerator";

interface SleepRecord {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  date: string;
}

export function SleepTracker() {
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem("sleepRecords");
    if (stored) {
      setSleepRecords(JSON.parse(stored));
    }

    const tracking = localStorage.getItem("sleepTracking");
    if (tracking) {
      const data = JSON.parse(tracking);
      setIsTracking(true);
      setStartTime(data.startTime);
    }
  }, []);

  const startSleep = () => {
    const now = new Date().toISOString();
    setStartTime(now);
    setIsTracking(true);
    localStorage.setItem("sleepTracking", JSON.stringify({ startTime: now }));
  };

  const endSleep = () => {
    const endTime = new Date().toISOString();
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // minutos

    const newRecord: SleepRecord = {
      id: Date.now().toString(),
      startTime,
      endTime,
      duration,
      date: new Date().toLocaleDateString("pt-BR"),
    };

    const updated = [newRecord, ...sleepRecords];
    setSleepRecords(updated);
    localStorage.setItem("sleepRecords", JSON.stringify(updated));
    localStorage.removeItem("sleepTracking");
    setIsTracking(false);
    setStartTime("");
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getChartData = () => {
    const last7Days = sleepRecords.slice(0, 7).reverse();
    return last7Days.map((record) => ({
      date: record.date.split("/").slice(0, 2).join("/"),
      horas: (record.duration / 60).toFixed(1),
    }));
  };

  const totalSleepToday = sleepRecords
    .filter((r) => r.date === new Date().toLocaleDateString("pt-BR"))
    .reduce((acc, r) => acc + r.duration, 0);

  const averageSleep = sleepRecords.length > 0
    ? sleepRecords.reduce((acc, r) => acc + r.duration, 0) / sleepRecords.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Report Generator */}
      <ReportGenerator />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#A8D1FF]">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#D9CFFF] p-2 rounded-lg">
              <Clock className="w-5 h-5 text-[#4A90E2]" />
            </div>
            <span className="text-gray-600 font-medium">Sono Hoje</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{formatDuration(totalSleepToday)}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#A8D1FF]">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#D9CFFF] p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-[#3ED1C8]" />
            </div>
            <span className="text-gray-600 font-medium">Média</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{formatDuration(Math.round(averageSleep))}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#A8D1FF]">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#D9CFFF] p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-[#4A90E2]" />
            </div>
            <span className="text-gray-600 font-medium">Registros</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{sleepRecords.length}</p>
        </div>
      </div>

      {/* Tracking Button */}
      <div className="bg-gradient-to-br from-[#4A90E2] to-[#3ED1C8] rounded-2xl p-6 md:p-8 shadow-xl text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Moon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Rastreamento de Sono</h3>
              <p className="text-white/90 text-sm">
                {isTracking ? "Sono em andamento..." : "Iniciar novo registro"}
              </p>
            </div>
          </div>
          <button
            onClick={isTracking ? endSleep : startSleep}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
              isTracking
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-white text-[#4A90E2] hover:shadow-lg"
            }`}
          >
            {isTracking ? "Finalizar Sono" : "Iniciar Sono"}
          </button>
        </div>
        {isTracking && (
          <div className="mt-4 text-center text-white/90">
            Iniciado às {new Date(startTime).toLocaleTimeString("pt-BR")}
          </div>
        )}
      </div>

      {/* Chart */}
      {sleepRecords.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Últimos 7 Dias</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "2px solid #A8D1FF",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="horas" fill="#4A90E2" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Records */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Registros Recentes</h3>
        <div className="space-y-3">
          {sleepRecords.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum registro ainda</p>
          ) : (
            sleepRecords.slice(0, 5).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 bg-[#F2F4F7] rounded-xl hover:bg-[#A8D1FF]/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#D9CFFF] p-2 rounded-lg">
                    <Moon className="w-5 h-5 text-[#4A90E2]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{record.date}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(record.startTime).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(record.endTime).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#4A90E2]">{formatDuration(record.duration)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
