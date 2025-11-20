"use client";

import { Lightbulb, Heart, Moon, Milk, Baby, AlertCircle, Smile } from "lucide-react";

const tips = [
  {
    id: 1,
    category: "Sono",
    icon: Moon,
    title: "Rotina de Sono Consistente",
    content:
      "Estabeleça horários regulares para dormir e acordar. Bebês prosperam com rotinas previsíveis. Crie um ritual relaxante antes de dormir: banho morno, massagem suave, história ou canção de ninar.",
    color: "from-[#4A90E2] to-[#A8D1FF]",
  },
  {
    id: 2,
    category: "Alimentação",
    icon: Milk,
    title: "Amamentação sob Demanda",
    content:
      "Nos primeiros meses, amamente sempre que o bebê demonstrar fome. Sinais incluem: levar as mãos à boca, sugar os dedos, virar a cabeça procurando o seio. Não espere o choro, que é um sinal tardio de fome.",
    color: "from-[#3ED1C8] to-[#A8D1FF]",
  },
  {
    id: 3,
    category: "Desenvolvimento",
    icon: Baby,
    title: "Estimulação Adequada",
    content:
      "Converse, cante e leia para seu bebê desde cedo. O contato visual e a interação são fundamentais. Ofereça brinquedos adequados à idade e permita tempo de barriga (tummy time) para fortalecer músculos.",
    color: "from-[#D9CFFF] to-[#A8D1FF]",
  },
  {
    id: 4,
    category: "Saúde",
    icon: Heart,
    title: "Higiene e Cuidados",
    content:
      "Troque fraldas frequentemente para evitar assaduras. Limpe sempre da frente para trás. Use produtos específicos para bebês. Mantenha as unhas curtas e limpas. Lave as mãos antes de cuidar do bebê.",
    color: "from-[#4A90E2] to-[#3ED1C8]",
  },
  {
    id: 5,
    category: "Segurança",
    icon: AlertCircle,
    title: "Ambiente Seguro",
    content:
      "Nunca deixe o bebê sozinho em superfícies altas. Use berço com grades adequadas. Mantenha objetos pequenos fora do alcance. Teste a temperatura da água do banho. Nunca agite o bebê, isso pode causar lesões graves.",
    color: "from-[#D9CFFF] to-[#4A90E2]",
  },
  {
    id: 6,
    category: "Bem-estar",
    icon: Smile,
    title: "Cuidado com os Pais",
    content:
      "Cuide de você também! Aceite ajuda quando oferecida. Descanse quando o bebê dormir. Mantenha uma alimentação saudável. Não hesite em pedir apoio profissional se sentir sobrecarga emocional. Pais saudáveis = bebê saudável.",
    color: "from-[#3ED1C8] to-[#D9CFFF]",
  },
  {
    id: 7,
    category: "Sono",
    icon: Moon,
    title: "Ambiente Ideal para Dormir",
    content:
      "Mantenha o quarto escuro, silencioso e com temperatura confortável (20-22°C). Use ruído branco se necessário. Evite estímulos antes de dormir. O berço deve ter apenas o colchão firme e lençol bem ajustado.",
    color: "from-[#4A90E2] to-[#A8D1FF]",
  },
  {
    id: 8,
    category: "Alimentação",
    icon: Milk,
    title: "Introdução Alimentar",
    content:
      "Após os 6 meses, introduza alimentos sólidos gradualmente. Comece com papinhas de frutas e legumes. Ofereça um alimento novo por vez. Respeite os sinais de saciedade do bebê. Evite sal, açúcar e mel no primeiro ano.",
    color: "from-[#3ED1C8] to-[#A8D1FF]",
  },
];

const milestones = [
  {
    age: "0-3 meses",
    achievements: [
      "Levanta a cabeça quando de bruços",
      "Segue objetos com os olhos",
      "Sorri socialmente",
      "Reconhece vozes familiares",
    ],
  },
  {
    age: "4-6 meses",
    achievements: [
      "Rola de barriga para costas",
      "Senta com apoio",
      "Pega objetos",
      "Balbucia sons",
    ],
  },
  {
    age: "7-9 meses",
    achievements: [
      "Senta sem apoio",
      "Engatinha",
      "Transfere objetos entre as mãos",
      "Responde ao próprio nome",
    ],
  },
  {
    age: "10-12 meses",
    achievements: [
      "Fica em pé com apoio",
      "Dá os primeiros passos",
      "Fala primeiras palavras",
      "Imita gestos",
    ],
  },
  {
    age: "1-2 anos",
    achievements: [
      "Anda sozinho",
      "Sobe escadas",
      "Fala frases simples",
      "Brinca de faz de conta",
    ],
  },
  {
    age: "2-3 anos",
    achievements: [
      "Corre e pula",
      "Usa frases completas",
      "Controle de esfíncteres",
      "Brinca com outras crianças",
    ],
  },
  {
    age: "3-5 anos",
    achievements: [
      "Pedala triciclo",
      "Desenha formas simples",
      "Conta histórias",
      "Veste-se sozinho",
    ],
  },
];

export function Tips() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#4A90E2] to-[#3ED1C8] rounded-2xl p-6 md:p-8 shadow-lg text-white text-center">
        <Lightbulb className="w-12 h-12 mx-auto mb-3" />
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Dicas Práticas</h2>
        <p className="text-white/90">
          Orientações essenciais para cuidar do seu bebê com confiança
        </p>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip) => {
          const Icon = tip.icon;
          return (
            <div
              key={tip.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#4A90E2]"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`bg-gradient-to-br ${tip.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-[#4A90E2] uppercase tracking-wide">
                    {tip.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 mt-1">{tip.title}</h3>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">{tip.content}</p>
            </div>
          );
        })}
      </div>

      {/* Milestones Section */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-[#D9CFFF] to-[#A8D1FF] p-3 rounded-xl">
            <Baby className="w-6 h-6 text-[#4A90E2]" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            Marcos do Desenvolvimento
          </h3>
        </div>
        <p className="text-gray-600 mb-6">
          Acompanhe as conquistas típicas de cada fase. Lembre-se: cada bebê se
          desenvolve no seu próprio ritmo!
        </p>

        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className="bg-[#F2F4F7] rounded-xl p-5 hover:bg-[#A8D1FF]/20 transition-colors"
            >
              <h4 className="text-lg font-bold text-[#4A90E2] mb-3">
                {milestone.age}
              </h4>
              <ul className="space-y-2">
                {milestone.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="bg-[#3ED1C8] rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <span className="text-gray-700">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-gradient-to-r from-[#D9CFFF] to-[#A8D1FF] rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-[#4A90E2] flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-gray-800 mb-1">Importante:</p>
              <p className="text-gray-700 text-sm">
                Se você notar atrasos significativos no desenvolvimento ou tiver
                preocupações, consulte o pediatra. O acompanhamento profissional é
                essencial para garantir o desenvolvimento saudável do seu bebê.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Info */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-8 h-8 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-2">Quando Buscar Ajuda Médica</h3>
            <ul className="space-y-1 text-white/90 text-sm">
              <li>• Febre alta (acima de 38°C em bebês menores de 3 meses)</li>
              <li>• Dificuldade para respirar ou respiração muito rápida</li>
              <li>• Recusa alimentar persistente ou vômitos frequentes</li>
              <li>• Choro inconsolável ou irritabilidade extrema</li>
              <li>• Convulsões ou movimentos anormais</li>
              <li>• Manchas roxas na pele ou palidez extrema</li>
            </ul>
            <p className="mt-3 font-semibold">
              Em caso de emergência, ligue 192 (SAMU) ou procure o pronto-socorro mais
              próximo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
