"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Share2, Calendar, CheckSquare } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportOptions {
  sleep: boolean;
  feeding: boolean;
  diaper: boolean;
  growth: boolean;
}

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
  side?: string;
  amount?: number;
  duration?: number;
}

interface DiaperRecord {
  id: string;
  type: "wet" | "dirty" | "both";
  time: string;
  date: string;
}

interface GrowthRecord {
  id: string;
  weight: number;
  height: number;
  date: string;
  age: string;
}

export function ReportGenerator() {
  const [showModal, setShowModal] = useState(false);
  const [period, setPeriod] = useState<"week" | "month" | "custom">("week");
  const [options, setOptions] = useState<ReportOptions>({
    sleep: true,
    feeding: true,
    diaper: true,
    growth: true,
  });
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [generating, setGenerating] = useState(false);

  const toggleOption = (key: keyof ReportOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getDateRange = () => {
    const end = new Date();
    let start = new Date();

    if (period === "week") {
      start.setDate(start.getDate() - 7);
    } else if (period === "month") {
      start.setDate(start.getDate() - 30);
    } else if (period === "custom" && customStartDate && customEndDate) {
      start = new Date(customStartDate);
      end.setTime(new Date(customEndDate).getTime());
    }

    return { start, end };
  };

  const filterByDateRange = (records: any[], dateField: string) => {
    const { start, end } = getDateRange();
    return records.filter((record) => {
      const recordDate = new Date(record[dateField]);
      return recordDate >= start && recordDate <= end;
    });
  };

  const generatePDF = () => {
    setGenerating(true);

    try {
      const doc = new jsPDF();
      const babyName = localStorage.getItem("babyName") || "Bebê";
      const birthDate = localStorage.getItem("babyBirthDate") || "";
      const { start, end } = getDateRange();

      // Cabeçalho
      doc.setFontSize(20);
      doc.setTextColor(74, 144, 226);
      doc.text("BabySync - Relatório Médico", 105, 20, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Nome: ${babyName}`, 20, 35);
      
      if (birthDate) {
        const age = calculateAge(birthDate);
        doc.text(`Data de Nascimento: ${new Date(birthDate).toLocaleDateString("pt-BR")}`, 20, 42);
        doc.text(`Idade: ${age}`, 20, 49);
      }

      doc.text(
        `Período: ${start.toLocaleDateString("pt-BR")} a ${end.toLocaleDateString("pt-BR")}`,
        20,
        56
      );

      let yPosition = 70;

      // Sono
      if (options.sleep) {
        const sleepRecords: SleepRecord[] = JSON.parse(
          localStorage.getItem("sleepRecords") || "[]"
        );
        const filteredSleep = filterByDateRange(sleepRecords, "startTime");

        if (filteredSleep.length > 0) {
          doc.setFontSize(14);
          doc.setTextColor(74, 144, 226);
          doc.text("Sono", 20, yPosition);
          yPosition += 7;

          const sleepData = filteredSleep.slice(0, 20).map((record) => [
            record.date,
            new Date(record.startTime).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            new Date(record.endTime).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            `${Math.floor(record.duration / 60)}h ${record.duration % 60}m`,
          ]);

          autoTable(doc, {
            startY: yPosition,
            head: [["Data", "Início", "Fim", "Duração"]],
            body: sleepData,
            theme: "striped",
            headStyles: { fillColor: [74, 144, 226] },
          });

          yPosition = (doc as any).lastAutoTable.finalY + 10;

          // Estatísticas de sono
          const totalSleep = filteredSleep.reduce((acc, r) => acc + r.duration, 0);
          const avgSleep = totalSleep / filteredSleep.length;
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(
            `Total de registros: ${filteredSleep.length} | Média: ${Math.floor(avgSleep / 60)}h ${Math.round(avgSleep % 60)}m`,
            20,
            yPosition
          );
          yPosition += 10;
        }
      }

      // Alimentação
      if (options.feeding && yPosition < 250) {
        const feedingRecords: FeedingRecord[] = JSON.parse(
          localStorage.getItem("feedingRecords") || "[]"
        );
        const filteredFeeding = filterByDateRange(feedingRecords, "time");

        if (filteredFeeding.length > 0) {
          if (yPosition > 240) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(14);
          doc.setTextColor(74, 144, 226);
          doc.text("Alimentação", 20, yPosition);
          yPosition += 7;

          const feedingData = filteredFeeding.slice(0, 20).map((record) => [
            record.date,
            new Date(record.time).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            record.type === "breast" ? "Peito" : "Mamadeira",
            record.side
              ? record.side === "left"
                ? "Esquerdo"
                : record.side === "right"
                ? "Direito"
                : "Ambos"
              : record.amount
              ? `${record.amount}ml`
              : "-",
          ]);

          autoTable(doc, {
            startY: yPosition,
            head: [["Data", "Hora", "Tipo", "Detalhes"]],
            body: feedingData,
            theme: "striped",
            headStyles: { fillColor: [74, 144, 226] },
          });

          yPosition = (doc as any).lastAutoTable.finalY + 10;

          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(`Total de mamadas: ${filteredFeeding.length}`, 20, yPosition);
          yPosition += 10;
        }
      }

      // Fraldas
      if (options.diaper && yPosition < 250) {
        const diaperRecords: DiaperRecord[] = JSON.parse(
          localStorage.getItem("diaperRecords") || "[]"
        );
        const filteredDiaper = filterByDateRange(diaperRecords, "time");

        if (filteredDiaper.length > 0) {
          if (yPosition > 240) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(14);
          doc.setTextColor(74, 144, 226);
          doc.text("Fraldas", 20, yPosition);
          yPosition += 7;

          const diaperData = filteredDiaper.slice(0, 20).map((record) => [
            record.date,
            new Date(record.time).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            record.type === "wet"
              ? "Xixi"
              : record.type === "dirty"
              ? "Cocô"
              : "Ambos",
          ]);

          autoTable(doc, {
            startY: yPosition,
            head: [["Data", "Hora", "Tipo"]],
            body: diaperData,
            theme: "striped",
            headStyles: { fillColor: [74, 144, 226] },
          });

          yPosition = (doc as any).lastAutoTable.finalY + 10;

          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(`Total de trocas: ${filteredDiaper.length}`, 20, yPosition);
          yPosition += 10;
        }
      }

      // Crescimento
      if (options.growth && yPosition < 250) {
        const growthRecords: GrowthRecord[] = JSON.parse(
          localStorage.getItem("growthRecords") || "[]"
        );

        if (growthRecords.length > 0) {
          if (yPosition > 240) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(14);
          doc.setTextColor(74, 144, 226);
          doc.text("Crescimento", 20, yPosition);
          yPosition += 7;

          const growthData = growthRecords.slice(0, 10).map((record) => [
            record.date,
            `${record.weight} kg`,
            `${record.height} cm`,
            record.age,
          ]);

          autoTable(doc, {
            startY: yPosition,
            head: [["Data", "Peso", "Altura", "Idade"]],
            body: growthData,
            theme: "striped",
            headStyles: { fillColor: [74, 144, 226] },
          });

          yPosition = (doc as any).lastAutoTable.finalY + 10;
        }
      }

      // Rodapé
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Gerado pelo BabySync em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
          105,
          285,
          { align: "center" }
        );
        doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: "center" });
      }

      // Salvar PDF
      const fileName = `BabySync_Relatorio_${babyName}_${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);

      setGenerating(false);
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      setGenerating(false);
      alert("Erro ao gerar relatório. Tente novamente.");
    }
  };

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

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-gradient-to-r from-[#4A90E2] to-[#3ED1C8] text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
      >
        <FileText className="w-5 h-5" />
        Gerar Relatório para Pediatra
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Gerar Relatório PDF</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Período */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">
                <Calendar className="w-5 h-5 inline mr-2" />
                Período
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "week", label: "Última Semana" },
                  { value: "month", label: "Último Mês" },
                  { value: "custom", label: "Personalizado" },
                ].map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPeriod(p.value as any)}
                    className={`py-3 rounded-xl font-semibold transition-all ${
                      period === p.value
                        ? "bg-[#4A90E2] text-white"
                        : "bg-[#F2F4F7] text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {period === "custom" && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Data Início</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-[#A8D1FF] focus:border-[#4A90E2] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Data Fim</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-[#A8D1FF] focus:border-[#4A90E2] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Opções */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">
                <CheckSquare className="w-5 h-5 inline mr-2" />
                Incluir no Relatório
              </label>
              <div className="space-y-2">
                {[
                  { key: "sleep", label: "Sono" },
                  { key: "feeding", label: "Alimentação" },
                  { key: "diaper", label: "Fraldas" },
                  { key: "growth", label: "Crescimento" },
                ].map((option) => (
                  <label
                    key={option.key}
                    className="flex items-center gap-3 p-3 bg-[#F2F4F7] rounded-xl cursor-pointer hover:bg-[#A8D1FF]/20 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={options[option.key as keyof ReportOptions]}
                      onChange={() => toggleOption(option.key as keyof ReportOptions)}
                      className="w-5 h-5 text-[#4A90E2] rounded focus:ring-[#4A90E2]"
                    />
                    <span className="font-medium text-gray-800">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Informações */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800 font-semibold mb-2">
                📄 O relatório incluirá:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Dados do bebê (nome, idade, data de nascimento)</li>
                <li>• Tabelas detalhadas de cada categoria selecionada</li>
                <li>• Estatísticas e médias do período</li>
                <li>• Gráficos de evolução (quando aplicável)</li>
              </ul>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl font-semibold bg-[#F2F4F7] text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={generatePDF}
                disabled={generating}
                className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#4A90E2] to-[#3ED1C8] text-white hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generating ? (
                  "Gerando..."
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Gerar PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
