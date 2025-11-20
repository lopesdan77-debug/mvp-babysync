"use client";

import { useState } from "react";
import { BookOpen, Music, Play, Pause, Heart } from "lucide-react";

const stories = [
  {
    id: 1,
    title: "O Coelhinho Sonolento",
    content: "Era uma vez um coelhinho muito sonolento que vivia em uma floresta mágica. Todas as noites, ele pulava de nuvem em nuvem até encontrar a lua, que lhe contava histórias sobre as estrelas...",
    duration: "5 min",
  },
  {
    id: 2,
    title: "A Estrela Brilhante",
    content: "No céu escuro da noite, havia uma estrela muito especial que brilhava mais que todas as outras. Ela adorava ver os bebês dormindo e enviava sonhos doces para cada um deles...",
    duration: "4 min",
  },
  {
    id: 3,
    title: "O Ursinho e a Lua",
    content: "Um ursinho de pelúcia vivia no quarto de um bebê. Todas as noites, quando a lua aparecia na janela, ele ganhava vida e contava histórias mágicas sobre o mundo dos sonhos...",
    duration: "6 min",
  },
  {
    id: 4,
    title: "O Jardim dos Sonhos",
    content: "Existe um jardim especial onde crescem flores que só abrem à noite. Cada flor guarda um sonho diferente, e quando o vento sopra suavemente, os sonhos voam até os bebês que dormem...",
    duration: "5 min",
  },
];

const lullabies = [
  {
    id: 1,
    title: "Brilha Brilha Estrelinha",
    artist: "Canção de Ninar Clássica",
    duration: "3:20",
  },
  {
    id: 2,
    title: "Nana Neném",
    artist: "Tradicional Brasileira",
    duration: "2:45",
  },
  {
    id: 3,
    title: "Dorme Bebê",
    artist: "Melodia Suave",
    duration: "4:10",
  },
  {
    id: 4,
    title: "Acalanto",
    artist: "Canção Relaxante",
    duration: "3:55",
  },
  {
    id: 5,
    title: "Sonho de Criança",
    artist: "Ninar Doce",
    duration: "3:30",
  },
];

export function StoriesMusic() {
  const [activeTab, setActiveTab] = useState<"stories" | "music">("stories");
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [playingMusic, setPlayingMusic] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <div className="bg-white rounded-2xl p-2 shadow-lg flex gap-2">
        <button
          onClick={() => setActiveTab("stories")}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === "stories"
              ? "bg-gradient-to-r from-[#4A90E2] to-[#3ED1C8] text-white"
              : "text-gray-600 hover:bg-[#F2F4F7]"
          }`}
        >
          <BookOpen className="w-5 h-5" />
          Historinhas
        </button>
        <button
          onClick={() => setActiveTab("music")}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === "music"
              ? "bg-gradient-to-r from-[#4A90E2] to-[#3ED1C8] text-white"
              : "text-gray-600 hover:bg-[#F2F4F7]"
          }`}
        >
          <Music className="w-5 h-5" />
          Canções de Ninar
        </button>
      </div>

      {/* Stories Tab */}
      {activeTab === "stories" && (
        <div className="space-y-4">
          {selectedStory === null ? (
            <>
              <div className="bg-gradient-to-br from-[#D9CFFF] to-[#A8D1FF] rounded-2xl p-6 shadow-lg text-center">
                <BookOpen className="w-12 h-12 text-[#4A90E2] mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Historinhas para Dormir
                </h3>
                <p className="text-gray-700">
                  Escolha uma história mágica para embalar o sono do seu bebê
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stories.map((story) => (
                  <div
                    key={story.id}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#4A90E2]"
                    onClick={() => setSelectedStory(story.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="bg-[#D9CFFF] p-3 rounded-xl">
                        <BookOpen className="w-6 h-6 text-[#4A90E2]" />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(story.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Heart
                          className={`w-6 h-6 ${
                            favorites.includes(story.id)
                              ? "fill-red-500 text-red-500"
                              : ""
                          }`}
                        />
                      </button>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">
                      {story.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {story.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{story.duration}</span>
                      <span className="text-[#4A90E2] font-semibold text-sm">
                        Ler história →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
              <button
                onClick={() => setSelectedStory(null)}
                className="text-[#4A90E2] font-semibold mb-6 hover:underline"
              >
                ← Voltar
              </button>
              {stories
                .filter((s) => s.id === selectedStory)
                .map((story) => (
                  <div key={story.id}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-br from-[#4A90E2] to-[#3ED1C8] p-4 rounded-2xl">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                          {story.title}
                        </h2>
                        <p className="text-gray-600">{story.duration} de leitura</p>
                      </div>
                    </div>
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {story.content}
                      </p>
                      <p className="text-gray-700 leading-relaxed text-lg mt-4">
                        E assim, com muito carinho e amor, o bebê fechou os olhinhos
                        e dormiu tranquilamente, sonhando com todas as maravilhas que
                        ouviu nesta história...
                      </p>
                      <p className="text-center text-gray-500 mt-8 italic">
                        Boa noite, pequenino! Durma bem e tenha sonhos doces! 💤✨
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Music Tab */}
      {activeTab === "music" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#D9CFFF] to-[#A8D1FF] rounded-2xl p-6 shadow-lg text-center">
            <Music className="w-12 h-12 text-[#4A90E2] mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Canções de Ninar
            </h3>
            <p className="text-gray-700">
              Melodias suaves para acalmar e embalar o sono do bebê
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Playlist</h3>
            <div className="space-y-3">
              {lullabies.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between p-4 bg-[#F2F4F7] rounded-xl hover:bg-[#A8D1FF]/20 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() =>
                        setPlayingMusic(playingMusic === song.id ? null : song.id)
                      }
                      className="bg-gradient-to-r from-[#4A90E2] to-[#3ED1C8] p-3 rounded-full hover:shadow-lg transition-all"
                    >
                      {playingMusic === song.id ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{song.title}</p>
                      <p className="text-sm text-gray-600">{song.artist}</p>
                    </div>
                    <span className="text-sm text-gray-500">{song.duration}</span>
                    <button
                      onClick={() => toggleFavorite(song.id + 100)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.includes(song.id + 100)
                            ? "fill-red-500 text-red-500"
                            : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {playingMusic && (
            <div className="bg-gradient-to-r from-[#4A90E2] to-[#3ED1C8] rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                    <Music className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">Tocando agora</p>
                    <p className="text-sm text-white/90">
                      {lullabies.find((s) => s.id === playingMusic)?.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPlayingMusic(null)}
                  className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                  <Pause className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
