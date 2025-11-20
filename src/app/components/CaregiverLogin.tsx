"use client";

import { useState } from "react";
import { UserPlus, ArrowRight, AlertCircle } from "lucide-react";

interface Caregiver {
  id: string;
  name: string;
  role: "owner" | "caregiver";
  addedAt: string;
}

interface ShareCode {
  code: string;
  expiresAt: string;
}

export function CaregiverLogin({ onLogin }: { onLogin: () => void }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<"code" | "name">("code");
  const [error, setError] = useState("");

  const validateCode = () => {
    const storedCode = localStorage.getItem("shareCode");
    
    if (!storedCode) {
      setError("Código inválido ou expirado");
      return false;
    }

    const shareCode: ShareCode = JSON.parse(storedCode);
    
    if (shareCode.code !== code.toUpperCase()) {
      setError("Código incorreto");
      return false;
    }

    if (new Date(shareCode.expiresAt) < new Date()) {
      setError("Código expirado");
      localStorage.removeItem("shareCode");
      return false;
    }

    return true;
  };

  const handleCodeSubmit = () => {
    setError("");
    
    if (code.length !== 6) {
      setError("O código deve ter 6 caracteres");
      return;
    }

    if (validateCode()) {
      setStep("name");
    }
  };

  const handleNameSubmit = () => {
    setError("");
    
    if (name.trim().length < 2) {
      setError("Digite um nome válido");
      return;
    }

    // Criar novo cuidador
    const newCaregiver: Caregiver = {
      id: `caregiver_${Date.now()}`,
      name: name.trim(),
      role: "caregiver",
      addedAt: new Date().toISOString(),
    };

    // Adicionar à lista de cuidadores
    const storedCaregivers = localStorage.getItem("caregivers");
    const caregivers: Caregiver[] = storedCaregivers ? JSON.parse(storedCaregivers) : [];
    caregivers.push(newCaregiver);
    localStorage.setItem("caregivers", JSON.stringify(caregivers));

    // Definir como usuário atual
    localStorage.setItem("currentUser", JSON.stringify(newCaregiver));

    // Remover código usado
    localStorage.removeItem("shareCode");

    // Fazer login
    onLogin();
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-[#4A90E2] to-[#3ED1C8] p-4 rounded-full">
            <UserPlus className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
          Entrar como Cuidador
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {step === "code"
            ? "Digite o código de acesso compartilhado"
            : "Crie seu nome de usuário"}
        </p>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {step === "code" ? (
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 font-medium mb-2 block">
                Código de Acesso (6 caracteres)
              </span>
              <input
                type="text"
                placeholder="ABC123"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#A8D1FF] focus:border-[#4A90E2] focus:outline-none transition-colors text-center text-2xl font-bold tracking-wider"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleCodeSubmit();
                  }
                }}
              />
            </label>
            <button
              onClick={handleCodeSubmit}
              className="w-full bg-gradient-to-r from-[#4A90E2] to-[#3ED1C8] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              Continuar
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 font-medium mb-2 block">
                Seu Nome
              </span>
              <input
                type="text"
                placeholder="Ex: Vovó Maria, Papai João..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#A8D1FF] focus:border-[#4A90E2] focus:outline-none transition-colors"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleNameSubmit();
                  }
                }}
              />
            </label>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Como cuidador, você poderá:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>✅ Registrar atividades do bebê</li>
                <li>✅ Visualizar todo o histórico</li>
                <li>✅ Ver análises e estatísticas</li>
              </ul>
            </div>

            <button
              onClick={handleNameSubmit}
              className="w-full bg-gradient-to-r from-[#4A90E2] to-[#3ED1C8] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              Entrar
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setStep("code");
                setCode("");
                setError("");
              }}
              className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
            >
              Voltar
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Não tem um código?{" "}
            <button className="text-[#4A90E2] font-semibold hover:underline">
              Peça ao proprietário
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
