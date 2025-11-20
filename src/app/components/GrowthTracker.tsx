"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Plus, Baby, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface GrowthRecord {
  id: string;
  weight: number;
  height: number;
  date: string;
  age: string;
}

export function GrowthTracker() {
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [birthDate, setBirthDate] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("growthRecords");
    if (stored) {
      setGrowthRecords(JSON.parse(stored));
    }

    const storedBirthDate = localStorage.getItem("babyBirthDate");
    if (storedBirthDate) {
      setBirthDate(storedBirthDate);
    }
  }, []);

  const calculateAge = (birthDateStr: string) => {
    if (!birthDateStr) return "0 meses";
    const birth = new Date(birthDateStr);
    const now = new Date();
    const months = Math.floor(
      (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0) {
      return `${years} ano${years > 1 ? "s" : ""} e ${remainingMonths} ${
        remainingMonths === 1 ? "mês" : "meses"
      }`;
    }
    return `${months} ${months === 1 ? "mês" : "meses"}`;
  };

  const addRecord = () => {
    if (!weight || !height) return;

    const newRecord: GrowthRecord = {
      id: Date.now().toString(),
      weight: parseFloat(weight),
      height: parseFloat(height),
      date: new Date().toLocaleDateString("pt-BR"),
      age: calculateAge(birthDate),
    };

    const updated = [newRecord, ...growthRecords];
    setGrowthRecords(updated);
    localStorage.setItem("growthRecords", JSON.stringify(updated));
    setShowForm(false);
    setWeight("");
    setHeight("");
  };

  const saveBirthDate = (date: string) => {
    setBirthDate(date);
    localStorage.setItem("babyBirthDate", date);
  };

  const getChartData = () => {
    return growthRecords
      .slice()
      .reverse()
      .map((record) => ({
        date: record.date,
        peso: record.weight,
        altura: record.height,
      }));
  };

  const latestRecord = growthRecords[0];
  const previousRecord = growthRecords[1];

  const weightGain = latestRecord && previousRecord
    ? (latestRecord.weight - previousRecord.weight).toFixed(2)
    : "0";

  const heightGain = latestRecord && previousRecord
    ? (latestRecord.height - previousRecord.height).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      {/* Birth Date Setup */}
      {!birthDate && (
        <div className="bg-gradient-to-br from-[#4A90E2] to-[#3ED1C8] rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Baby className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Data de Nascimento</h3>
          </div>
          <p className="text-white/90 mb-4">
            Configure a data de nascimento para acompanhar o crescimento
          </p>
          <div className="flex gap-3">
            <input
              type="date"
              className="flex-1 px-4 py-3 rounded-xl text-gray-800 focus:outline-none"
              onChange={(e) => saveBirthDate(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {latestRecord && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#A8D1FF]">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#D9CFFF] p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#4A90E2]" />
              </div>
              <span className="text-gray-600 font-medium">Peso Atual</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{latestRecord.weight} kg</p>
            {previousRecord && (
              <p className="text-sm text-green-600 mt-1">
                +{weightGain} kg desde última medição
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#A8D1FF]">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#D9CFFF] p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#3ED1C8]" />
              </div>
              <span className="text-gray-600 font-medium">Altura Atual</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{latestRecord.height} cm</p>
            {previousRecord && (
              <p className="text-sm text-green-600 mt-1">
                +{heightGain} cm desde última medição
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#A8D1FF]">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#D9CFFF] p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-[#4A90E2]" />
              </div>
              <span className="text-gray-600 font-medium">Idade</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{calculateAge(birthDate)}</p>
          </div>
        </div>
      )}

      {/* Add Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-gradient-to-r from-[#4A90E2] to-[#3ED1C8] text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Adicionar Medição
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Nova Medição</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Peso (kg)</label>
              <input
                type="number"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#A8D1FF] focus:border-[#4A90E2] focus:outline-none"
                placeholder="Ex: 5.5"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Altura (cm)</label>
              <input
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#A8D1FF] focus:border-[#4A90E2] focus:outline-none"
                placeholder="Ex: 62.5"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-xl font-semibold bg-[#F2F4F7] text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={addRecord}
                className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#4A90E2] to-[#3ED1C8] text-white hover:shadow-lg transition-all"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      {growthRecords.length > 1 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Evolução do Crescimento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis yAxisId="left" stroke="#4A90E2" />
              <YAxis yAxisId="right" orientation="right" stroke="#3ED1C8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "2px solid #A8D1FF",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="peso"
                stroke="#4A90E2"
                strokeWidth={3}
                dot={{ fill: "#4A90E2", r: 5 }}
                name="Peso (kg)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="altura"
                stroke="#3ED1C8"
                strokeWidth={3}
                dot={{ fill: "#3ED1C8", r: 5 }}
                name="Altura (cm)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Records History */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Histórico de Medições</h3>
        <div className="space-y-3">
          {growthRecords.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhuma medição registrada</p>
          ) : (
            growthRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 bg-[#F2F4F7] rounded-xl hover:bg-[#A8D1FF]/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#D9CFFF] p-2 rounded-lg">
                    <Baby className="w-5 h-5 text-[#4A90E2]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{record.date}</p>
                    <p className="text-sm text-gray-600">{record.age}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#4A90E2]">{record.weight} kg</p>
                  <p className="text-sm text-[#3ED1C8] font-semibold">
                    {record.height} cm
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
