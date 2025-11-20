"use client";

import { useState, useEffect } from "react";
import { Droplet, Plus, DollarSign, TrendingUp, Calendar } from "lucide-react";

interface DiaperRecord {
  id: string;
  type: "wet" | "dirty" | "both";
  time: string;
  date: string;
}

export function DiaperTracker() {
  const [diaperRecords, setDiaperRecords] = useState<DiaperRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [diaperType, setDiaperType] = useState<"wet" | "dirty" | "both">("wet");
  const [costPerDiaper, setCostPerDiaper] = useState(1.5);
  const [showCostSettings, setShowCostSettings] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("diaperRecords");
    if (stored) {
      setDiaperRecords(JSON.parse(stored));
    }

    const storedCost = localStorage.getItem("diaperCost");
    if (storedCost) {
      setCostPerDiaper(parseFloat(storedCost));
    }
  }, []);

  const addDiaper = () => {
    const newRecord: DiaperRecord = {
      id: Date.now().toString(),
      type: diaperType,
      time: new Date().toISOString(),
      date: new Date().toLocaleDateString("pt-BR"),
    };

    const updated = [newRecord, ...diaperRecords];
    setDiaperRecords(updated);
    localStorage.setItem("diaperRecords", JSON.stringify(updated));
    setShowForm(false);
  };

  const saveCost = (newCost: number) => {
    setCostPerDiaper(newCost);
    localStorage.setItem("diaperCost", newCost.toString());
    setShowCostSettings(false);
  };

  const todayDiapers = diaperRecords.filter(
    (r) => r.date === new Date().toLocaleDateString("pt-BR")
  );

  const thisWeekDiapers = diaperRecords.filter((r) => {
    const recordDate = new Date(r.time);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return recordDate >= weekAgo;
  });

  const thisMonthDiapers = diaperRecords.filter((r) => {
    const recordDate = new Date(r.time);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    return recordDate >= monthAgo;
  });

  const monthlyCost = thisMonthDiapers.length * costPerDiaper;
  const dailyAverage = diaperRecords.length > 0 
    ? diaperRecords.length / Math.max(1, Math.ceil((new Date().getTime() - new Date(diaperRecords[diaperRecords.length - 1].time).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "wet":
        return "Xixi";
      case "dirty":
        return "Cocô";
      case "both":
        return "Ambos";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "wet":
        return "bg-[#A8D1FF]";
      case "dirty":
        return "bg-[#D9CFFF]";
      case "both":
        return "bg-[#3ED1C8]";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#A8D1FF]">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#D9CFFF] p-2 rounded-lg">
              <Droplet className="w-5 h-5 text-[#4A90E2]" />
            </div>
            <span className="text-gray-600 font-medium">Hoje</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{todayDiapers.length}</p>
          <p className="text-sm text-gray-500 mt-1">trocas</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#A8D1FF]">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#D9CFFF] p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-[#3ED1C8]" />
            </div>
            <span className="text-gray-600 font-medium">Esta Semana</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{thisWeekDiapers.length}</p>
          <p className="text-sm text-gray-500 mt-1">trocas</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#A8D1FF]">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#D9CFFF] p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-[#4A90E2]" />
            </div>
            <span className="text-gray-600 font-medium">Média Diária</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{dailyAverage.toFixed(1)}</p>
          <p className="text-sm text-gray-500 mt-1">trocas/dia</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#A8D1FF]">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#D9CFFF] p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-[#3ED1C8]" />
            </div>
            <span className="text-gray-600 font-medium">Custo Mensal</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">R$ {monthlyCost.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">{thisMonthDiapers.length} fraldas</p>
        </div>
      </div>

      {/* Cost Settings */}
      <div className="bg-gradient-to-br from-[#D9CFFF] to-[#A8D1FF] rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/50 p-2 rounded-lg">
              <DollarSign className="w-6 h-6 text-[#4A90E2]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Custo por Fralda</h3>
              <p className="text-sm text-gray-700">R$ {costPerDiaper.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={() => setShowCostSettings(!showCostSettings)}
            className="px-6 py-2 rounded-lg font-semibold bg-white text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {showCostSettings ? "Fechar" : "Ajustar"}
          </button>
        </div>
        {showCostSettings && (
          <div className="mt-4 bg-white/50 rounded-lg p-4">
            <label className="block text-gray-700 font-medium mb-2">
              Novo valor (R$)
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                step="0.01"
                defaultValue={costPerDiaper}
                className="flex-1 px-4 py-2 rounded-lg border-2 border-[#A8D1FF] focus:border-[#4A90E2] focus:outline-none"
                id="costInput"
              />
              <button
                onClick={() => {
                  const input = document.getElementById("costInput") as HTMLInputElement;
                  saveCost(parseFloat(input.value) || 1.5);
                }}
                className="px-6 py-2 rounded-lg font-semibold bg-[#4A90E2] text-white hover:bg-[#3ED1C8] transition-colors"
              >
                Salvar
              </button>
            </div>
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
          Registrar Troca
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Nova Troca</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Tipo</label>
              <div className="flex gap-3">
                {["wet", "dirty", "both"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setDiaperType(type as any)}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                      diaperType === type
                        ? "bg-[#4A90E2] text-white"
                        : "bg-[#F2F4F7] text-gray-700"
                    }`}
                  >
                    {getTypeLabel(type)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-xl font-semibold bg-[#F2F4F7] text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={addDiaper}
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
        <h3 className="text-xl font-bold text-gray-800 mb-4">Histórico de Trocas</h3>
        <div className="space-y-3">
          {diaperRecords.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum registro ainda</p>
          ) : (
            diaperRecords.slice(0, 15).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 bg-[#F2F4F7] rounded-xl hover:bg-[#A8D1FF]/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`${getTypeColor(record.type)} p-2 rounded-lg`}>
                    <Droplet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{getTypeLabel(record.type)}</p>
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
                  <p className="text-sm font-semibold text-[#4A90E2]">
                    R$ {costPerDiaper.toFixed(2)}
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
