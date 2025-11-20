"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Copy, Check, X, UserPlus, Settings } from "lucide-react";

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

export function ProfileSettings() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [showAddCaregiver, setShowAddCaregiver] = useState(false);
  const [shareCode, setShareCode] = useState<ShareCode | null>(null);
  const [copied, setCopied] = useState(false);
  const [babyName, setBabyName] = useState("");
  const [currentUser, setCurrentUser] = useState<Caregiver | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("caregivers");
    const storedBabyName = localStorage.getItem("babyName");
    const storedUser = localStorage.getItem("currentUser");

    if (stored) setCaregivers(JSON.parse(stored));
    if (storedBabyName) setBabyName(storedBabyName);

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      // Criar usuário principal se não existir
      const owner: Caregiver = {
        id: "owner",
        name: "Você (Principal)",
        role: "owner",
        addedAt: new Date().toISOString(),
      };
      setCurrentUser(owner);
      localStorage.setItem("currentUser", JSON.stringify(owner));
      
      // Adicionar à lista se não existir
      if (!stored || JSON.parse(stored).length === 0) {
        setCaregivers([owner]);
        localStorage.setItem("caregivers", JSON.stringify([owner]));
      }
    }
  }, []);

  const generateShareCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const newShareCode: ShareCode = {
      code,
      expiresAt: expiresAt.toISOString(),
    };

    setShareCode(newShareCode);
    localStorage.setItem("shareCode", JSON.stringify(newShareCode));
    setShowAddCaregiver(true);
  };

  const copyCode = () => {
    if (shareCode) {
      navigator.clipboard.writeText(shareCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const removeCaregiver = (id: string) => {
    const updated = caregivers.filter((c) => c.id !== id);
    setCaregivers(updated);
    localStorage.setItem("caregivers", JSON.stringify(updated));
  };

  const isCodeExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Informações do Bebê */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#D9CFFF] p-3 rounded-lg">
            <Settings className="w-6 h-6 text-[#4A90E2]" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Configurações</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nome do Bebê</label>
            <input
              type="text"
              value={babyName}
              onChange={(e) => {
                setBabyName(e.target.value);
                localStorage.setItem("babyName", e.target.value);
              }}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#A8D1FF] focus:border-[#4A90E2] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Cuidadores */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#D9CFFF] p-3 rounded-lg">
              <Users className="w-6 h-6 text-[#4A90E2]" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Cuidadores</h3>
          </div>
          {currentUser?.role === "owner" && (
            <button
              onClick={generateShareCode}
              className="bg-gradient-to-r from-[#4A90E2] to-[#3ED1C8] text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          )}
        </div>

        {/* Lista de Cuidadores */}
        <div className="space-y-3">
          {caregivers.map((caregiver) => (
            <div
              key={caregiver.id}
              className="flex items-center justify-between p-4 bg-[#F2F4F7] rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#D9CFFF] p-2 rounded-full">
                  <UserPlus className="w-5 h-5 text-[#4A90E2]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{caregiver.name}</p>
                  <p className="text-sm text-gray-600">
                    {caregiver.role === "owner" ? "Proprietário" : "Cuidador"}
                  </p>
                </div>
              </div>
              {caregiver.role !== "owner" && currentUser?.role === "owner" && (
                <button
                  onClick={() => removeCaregiver(caregiver.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Código de Compartilhamento */}
      {showAddCaregiver && shareCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Código de Acesso</h3>
              <button
                onClick={() => setShowAddCaregiver(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#4A90E2] to-[#3ED1C8] rounded-xl p-6 text-center mb-6">
              <p className="text-white/90 text-sm mb-2">Compartilhe este código:</p>
              <p className="text-4xl font-bold text-white tracking-wider mb-4">
                {shareCode.code}
              </p>
              <button
                onClick={copyCode}
                className="bg-white text-[#4A90E2] px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar código
                  </>
                )}
              </button>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                ⏰ Este código expira em 24 horas
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Válido até:{" "}
                {new Date(shareCode.expiresAt).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Como funciona:</strong>
              </p>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Compartilhe o código com o cuidador</li>
                <li>Ele deve acessar a tela de login do BabySync</li>
                <li>Inserir o código e criar um nome de usuário</li>
                <li>Pronto! Ele terá acesso para registrar atividades</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Informações sobre Sincronização */}
      <div className="bg-gradient-to-br from-[#D9CFFF] to-[#A8D1FF] rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          🔄 Sincronização em Tempo Real
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>✅ Todos os cuidadores veem as mesmas informações</p>
          <p>✅ Registros são sincronizados automaticamente</p>
          <p>✅ Notificações quando alguém registra uma atividade</p>
          <p>✅ Cada registro mostra quem fez o registro</p>
        </div>
      </div>

      {/* Permissões */}
      {currentUser?.role === "caregiver" && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-blue-800 mb-3">
            👤 Você é um Cuidador
          </h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>✅ Pode registrar atividades (sono, mamadas, fraldas)</p>
            <p>✅ Pode visualizar todo o histórico</p>
            <p>❌ Não pode adicionar outros cuidadores</p>
            <p>❌ Não pode alterar configurações principais</p>
          </div>
        </div>
      )}
    </div>
  );
}
