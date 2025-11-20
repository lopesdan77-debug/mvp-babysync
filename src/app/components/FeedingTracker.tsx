"use client";

import { useState, useEffect } from "react";
import { Milk, Plus, Clock, Bell, TrendingUp } from "lucide-react";

interface FeedingRecord {
  id: string;
  type: "breast" | "bottle";
  side?: "left" | "right" | "both";
  amount?: number;
  duration?: number;
  time: string;
  date: string;
}

export function FeedingTracker() {
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [feedingType, setFeedingType] = useState<"breast" | "bottle">("breast");
  const [side, setSide] = useState<"left" | "right" | "both">("left");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderInterval, setReminderInterval] = useState(180); // 3 horas em minutos

  useEffect(() => {
    const stored = localStorage.getItem("feedingRecords");
    if (stored) {
      setFeedingRecords(JSON.parse(stored));
    }

    const reminder = localStorage.getItem("feedingReminder");
    if (reminder) {
      const data = JSON.parse(reminder);
      setReminderEnabled(data.enabled);
      setReminderInterval(data.interval);
    }
  }, []);

  const addFeeding = () => {
    const newRecord: FeedingRecord = {
      id: Date.now().toString(),
      type: feedingType,
      time: new Date().toISOString(),
      date: new Date().toLocaleDateString("pt-BR"),
      ...(feedingType === "breast" && { side, duration: parseInt(duration) || 0 }),
      ...(feedingType === "bottle" && { amount: parseInt(amount) || 0 }),
    };

    const updated = [newRecord, ...feedingRecords];
    setFeedingRecords(updated);
    localStorage.setItem("feedingRecords", JSON.stringify(updated));
    setShowForm(false);
    setAmount("");
    setDuration("");
  };

  const toggleReminder = () => {
    const newState = !reminderEnabled;
    setReminderEnabled(newState);
    localStorage.setItem(
      "feedingReminder",
      JSON.stringify({ enabled: newState, interval: reminderInterval })
    );
  };

  const lastFeeding = feedingRecords[0];
  const nextFeedingTime = lastFeeding
    ? new Date(new Date(lastFeeding.time).getTime() + reminderInterval * 60000)
    : null;

  const todayFeedings = feedingRecords.filter(
    (r) => r.date === new Date().toLocaleDateString("pt-BR")
  );

  const averageInterval = feedingRecords.length > 1
    ? feedingRecords.slice(0, -1).reduce((acc, record, index) => {
        const current = new Date(record.time);
        const next = new Date(feedingRecords[index + 1].time);
        return acc + (current.getTime() - next.getTime()) / (1000 * 60);
      }, 0) / (feedingRecords.length - 1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#A8D1FF]">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#D9CFFF] p-2 rounded-lg">
              <Milk className="w-5 h-5 text-[#4A90E2]" />
            </div>
            <span className="text-gray-600 font-medium">Hoje</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{todayFeedings.length}</p>
          <p className="text-sm text-gray-500 mt-1">mamadas</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#A8D1FF]">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#D9CFFF] p-2 rounded-lg">
              <Clock className="w-5 h-5 text-[#3ED1C8]" />
            </div>
            <span className="text-gray-600 font-medium">Intervalo Médio</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {Math.round(averageInterval / 60)}h {Math.round(averageInterval % 60)}m
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#A8D1FF]">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#D9CFFF] p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-[#4A90E2]" />
            </div>
            <span className="text-gray-600 font-medium">Total</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{feedingRecords.length}</p>
          <p className="text-sm text-gray-500 mt-1">registros</p>
        </div>
      </div>

      {/* Reminder Card */}
      <div className="bg-gradient-to-br from-[#D9CFFF] to-[#A8D1FF] rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/50 p-2 rounded-lg">
              <Bell className="w-6 h-6 text-[#4A90E2]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Lembrete Inteligente</h3>
              <p className="text-sm text-gray-700">
                {reminderEnabled ? "Ativado" : "Desativado"}
              </p>
            </div>
          </div>
          <button
            onClick={toggleReminder}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              reminderEnabled
                ? "bg-[#4A90E2] text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {reminderEnabled ? "Desativar" : "Ativar"}
          </button>
        </div>
        {reminderEnabled && nextFeedingTime && (
          <div className="bg-white/50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              Próxima mamada sugerida:{" "}
              <span className="font-bold text-[#4A90E2]">
                {nextFeedingTime.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Add Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-gradient-to-r from-[#4A90E2] to-[#3ED1C8] text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Registrar Mamada
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Nova Mamada</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Tipo</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setFeedingType("breast")}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    feedingType === "breast"
                      ? "bg-[#4A90E2] text-white"
                      : "bg-[#F2F4F7] text-gray-700"
                  }`}
                >
                  Peito
                </button>
                <button
                  onClick={() => setFeedingType("bottle")}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    feedingType === "bottle"
                      ? "bg-[#4A90E2] text-white"
                      : "bg-[#F2F4F7] text-gray-700"
                  }`}
                >
                  Mamadeira
                </button>
              </div>
            </div>

            {feedingType === "breast" && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Lado</label>
                  <div className="flex gap-3">
                    {["left", "right", "both"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSide(s as any)}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                          side === s
                            ? "bg-[#4A90E2] text-white"
                            : "bg-[#F2F4F7] text-gray-700"
                        }`}
                      >
                        {s === "left" ? "Esquerdo" : s === "right" ? "Direito" : "Ambos"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Duração (minutos)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#A8D1FF] focus:border-[#4A90E2] focus:outline-none"
                    placeholder="Ex: 15"
                  />
                </div>
              </>
            )}

            {feedingType === "bottle" && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Quantidade (ml)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#A8D1FF] focus:border-[#4A90E2] focus:outline-none"
                  placeholder="Ex: 120"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-xl font-semibold bg-[#F2F4F7] text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={addFeeding}
                className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#4A90E2] to-[#3ED1C8] text-white hover:shadow-lg transition-all"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Records */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Histórico</h3>
        <div className="space-y-3">
          {feedingRecords.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum registro ainda</p>
          ) : (
            feedingRecords.slice(0, 10).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 bg-[#F2F4F7] rounded-xl hover:bg-[#A8D1FF]/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#D9CFFF] p-2 rounded-lg">
                    <Milk className="w-5 h-5 text-[#4A90E2]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {record.type === "breast" ? "Peito" : "Mamadeira"}
                      {record.side && ` - ${record.side === "left" ? "Esquerdo" : record.side === "right" ? "Direito" : "Ambos"}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(record.time).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#4A90E2]">
                    {record.duration ? `${record.duration}min` : `${record.amount}ml`}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
