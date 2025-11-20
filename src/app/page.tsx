"use client";

import { useState, useEffect } from "react";
import { Baby, Moon, Milk, Droplet, BookOpen, TrendingUp, Plus, Clock, DollarSign, Music, Lightbulb, Home, Brain, Settings, UserPlus } from "lucide-react";
import { SleepTracker } from "./components/SleepTracker";
import { FeedingTracker } from "./components/FeedingTracker";
import { DiaperTracker } from "./components/DiaperTracker";
import { StoriesMusic } from "./components/StoriesMusic";
import { GrowthTracker } from "./components/GrowthTracker";
import { Tips } from "./components/Tips";
import { Dashboard } from "./components/Dashboard";
import { SleepAnalysis } from "./components/SleepAnalysis";
import { SmartRoutine } from "./components/SmartRoutine";
import { ProfileSettings } from "./components/ProfileSettings";
import { CaregiverLogin } from "./components/CaregiverLogin";

export default function BabySyncApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [babyName, setBabyName] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCaregiverLogin, setShowCaregiverLogin] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("babyName");
    if (storedName) {
      setBabyName(storedName);
      setShowWelcome(false);
    }
  }, []);

  const handleSetBabyName = (name: string) => {
    localStorage.setItem("babyName", name);
    setBabyName(name);
    setShowWelcome(false);
  };

  const handleCaregiverLogin = () => {
    const storedName = localStorage.getItem("babyName");
    if (storedName) {
      setBabyName(storedName);
    }
    setShowCaregiverLogin(false);
    setShowWelcome(false);
  };

  const tabs = [
    { id: "home", label: "Início", icon: Home },
    { id: "routine", label: "Rotina", icon: Brain },
    { id: "sleep", label: "Sono", icon: Moon },
    { id: "feeding", label: "Alimentação", icon: Milk },
    { id: "diaper", label: "Fraldas", icon: Droplet },
    { id: "stories", label: "Histórias", icon: BookOpen },
    { id: "growth", label: "Crescimento", icon: TrendingUp },
    { id: "tips", label: "Dicas", icon: Lightbulb },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  if (showCaregiverLogin) {
    return <CaregiverLogin onLogin={handleCaregiverLogin} />;
  }

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-[#F2F4F7] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-[#4A90E2] to-[#3ED1C8] p-4 rounded-full">
              <Baby className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
            BabySync
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Seu assistente digital para organizar a rotina do bebê
          </p>
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 font-medium mb-2 block">
                Qual é o nome do bebê?
              </span>
              <input
                type="text"
                placeholder="Digite o nome..."
                className="w-full px-4 py-3 rounded-xl border-2 border-[#A8D1FF] focus:border-[#4A90E2] focus:outline-none transition-colors"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    handleSetBabyName(e.currentTarget.value.trim());
                  }
                }}
              />
            </label>
            <button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling?.querySelector("input") as HTMLInputElement;
                if (input?.value.trim()) {
                  handleSetBabyName(input.value.trim());
                }
              }}
              className="w-full bg-gradient-to-r from-[#4A90E2] to-[#3ED1C8] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Começar
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <button
              onClick={() => setShowCaregiverLogin(true)}
              className="w-full bg-white border-2 border-[#4A90E2] text-[#4A90E2] py-3 rounded-xl font-semibold hover:bg-[#4A90E2] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Entrar como Cuidador
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F4F7]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#4A90E2] to-[#3ED1C8] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Baby className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">BabySync</h1>
                <p className="text-sm text-white/90">{babyName}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-2 md:px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 font-medium transition-all duration-300 border-b-2 ${
                    activeTab === tab.id
                      ? "border-[#4A90E2] text-[#4A90E2] bg-[#A8D1FF]/10"
                      : "border-transparent text-gray-600 hover:text-[#4A90E2] hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {activeTab === "home" && <Dashboard onNavigate={setActiveTab} />}
        {activeTab === "routine" && <SmartRoutine onNavigate={setActiveTab} />}
        {activeTab === "sleep" && (
          <div className="space-y-6">
            <SleepAnalysis />
            <SleepTracker />
          </div>
        )}
        {activeTab === "feeding" && <FeedingTracker />}
        {activeTab === "diaper" && <DiaperTracker />}
        {activeTab === "stories" && <StoriesMusic />}
        {activeTab === "growth" && <GrowthTracker />}
        {activeTab === "tips" && <Tips />}
        {activeTab === "settings" && <ProfileSettings />}
      </main>
    </div>
  );
}
