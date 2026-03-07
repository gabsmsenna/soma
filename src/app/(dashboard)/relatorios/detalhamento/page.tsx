"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  MoreVertical,
  Palette,
  PlaneTakeoff,
  Rocket,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function DetalhamentoPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f8f5] dark:bg-[#181610] text-slate-900 dark:text-slate-100 font-sans">
      {/* Mobile/Sidebar Header integration */}
      <div className="md:hidden flex items-center p-4 border-b border-white/5">
        <SidebarTrigger className="text-white" />
      </div>

      <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="md:hidden">
                  <SidebarTrigger className="-ml-2" />
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  Detalhamento de Lucro
                </h2>
              </div>
              <p className="text-slate-400 mt-1">
                Análise detalhada por operação e criativo
              </p>
            </div>
            <div className="flex items-center bg-[#231e0f] border border-white/5 rounded-full p-1 pl-4">
              <span className="text-sm text-slate-400 mr-3 font-medium">
                Período:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="h-[18px] w-[18px]" />
                </button>
                <span
                  className="text-[#ffbb00] font-bold text-sm px-2"
                  style={{ textShadow: "0 0 10px rgba(255, 187, 0, 0.3)" }}
                >
                  Últimos 30 dias
                </span>
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <ChevronRight className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1 */}
            <div className="bg-[#231e0f]/60 backdrop-blur-md border border-[#ffbb00]/10 p-5 rounded-2xl flex flex-col justify-between h-[160px] relative overflow-hidden group hover:border-[#ffbb00]/30 transition-all">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#ffbb00]/10 rounded-full blur-2xl group-hover:bg-[#ffbb00]/20 transition-all"></div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">
                  Lucro Total (Operações)
                </p>
                <h3 className="text-3xl font-bold text-white">
                  R$ 152.400
                  <span className="text-lg text-slate-500 font-normal">
                    ,00
                  </span>
                </h3>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg text-xs font-bold">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +8%
                </div>
                <svg
                  role="img"
                  aria-label="Gráfico de lucro total"
                  fill="none"
                  height="30"
                  viewBox="0 0 80 30"
                  width="80"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Gráfico de lucro total</title>
                  <path
                    d="M1 25L15 18L25 22L40 10L55 15L79 1"
                    stroke="#ffbb00"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                  <path
                    d="M1 25L15 18L25 22L40 10L55 15L79 1V30H1V25Z"
                    fill="url(#grad1)"
                    opacity="0.2"
                  ></path>
                  <defs>
                    <linearGradient
                      gradientUnits="userSpaceOnUse"
                      id="grad1"
                      x1="40"
                      x2="40"
                      y1="0"
                      y2="30"
                    >
                      <stop stopColor="#ffbb00"></stop>
                      <stop
                        offset="1"
                        stopColor="#ffbb00"
                        stopOpacity="0"
                      ></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-[#231e0f]/60 backdrop-blur-md border border-[#ffbb00]/10 p-5 rounded-2xl flex flex-col justify-between h-[160px] relative overflow-hidden group hover:border-[#ffbb00]/30 transition-all">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#ffbb00]/10 rounded-full blur-2xl group-hover:bg-[#ffbb00]/20 transition-all"></div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">
                  Meu Lucro (Comissão)
                </p>
                <h3 className="text-3xl font-bold text-white">
                  R$ 15.240
                  <span className="text-lg text-slate-500 font-normal">
                    ,00
                  </span>
                </h3>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg text-xs font-bold">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +12%
                </div>
                <svg
                  role="img"
                  aria-label="Gráfico do meu lucro"
                  fill="none"
                  height="30"
                  viewBox="0 0 80 30"
                  width="80"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Gráfico do meu lucro</title>
                  <path
                    d="M1 20L20 25L40 15L60 18L79 5"
                    stroke="#ffbb00"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                  <path
                    d="M1 20L20 25L40 15L60 18L79 5V30H1V20Z"
                    fill="url(#grad2)"
                    opacity="0.2"
                  ></path>
                  <defs>
                    <linearGradient
                      gradientUnits="userSpaceOnUse"
                      id="grad2"
                      x1="40"
                      x2="40"
                      y1="0"
                      y2="30"
                    >
                      <stop stopColor="#ffbb00"></stop>
                      <stop
                        offset="1"
                        stopColor="#ffbb00"
                        stopOpacity="0"
                      ></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-[#231e0f]/60 backdrop-blur-md border border-[#ffbb00]/10 p-5 rounded-2xl flex flex-col justify-between h-[160px] relative overflow-hidden group hover:border-[#ffbb00]/30 transition-all">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">
                  Criativo + Lucrativo
                </p>
                <h3 className="text-2xl font-bold text-white truncate">
                  CRI_042_V2
                </h3>
                <p className="text-emerald-400 text-sm font-medium mt-1">
                  ROI 8.4x
                </p>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  Op. Alpha
                </div>
                <svg
                  role="img"
                  aria-label="Gráfico de criativo mais lucrativo"
                  fill="none"
                  height="30"
                  viewBox="0 0 80 30"
                  width="80"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Gráfico de criativo mais lucrativo</title>
                  <path
                    d="M1 28L15 20L30 22L50 10L65 12L79 2"
                    stroke="#34d399"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="bg-[#231e0f]/60 backdrop-blur-md border border-[#ffbb00]/10 p-5 rounded-2xl flex flex-col justify-between h-[160px] relative overflow-hidden group hover:border-[#ffbb00]/30 transition-all">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all"></div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">
                  Criativo - Lucrativo
                </p>
                <h3 className="text-2xl font-bold text-white truncate">
                  CRI_011_V1
                </h3>
                <p className="text-red-400 text-sm font-medium mt-1">
                  ROI 0.8x
                </p>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  Op. Epsilon
                </div>
                <svg
                  role="img"
                  aria-label="Gráfico de criativo menos lucrativo"
                  fill="none"
                  height="30"
                  viewBox="0 0 80 30"
                  width="80"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Gráfico de criativo menos lucrativo</title>
                  <path
                    d="M1 10L20 8L40 15L60 20L79 25"
                    stroke="#ef4444"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Operations List */}
          <div className="flex flex-col gap-6">
            {/* Op 1 */}
            <div className="bg-[#231e0f]/60 backdrop-blur-md border border-[#ffbb00]/10 rounded-2xl p-6 overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/5 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ffbb00]/20 to-[#ffbb00]/5 flex items-center justify-center border border-[#ffbb00]/20">
                    <Rocket className="text-[#ffbb00] h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Operação Alpha Protocol
                    </h3>
                    <p className="text-sm text-slate-400">
                      ID: #OP-8821 • Status:{" "}
                      <span className="text-emerald-400">Ativa</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                      Lucro Total Op.
                    </p>
                    <p className="text-xl font-bold text-white">R$ 42.150,00</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                      Meu Lucro (10%)
                    </p>
                    <p
                      className="text-xl font-bold text-[#ffbb00]"
                      style={{ textShadow: "0 0 10px rgba(255, 187, 0, 0.3)" }}
                    >
                      R$ 4.215,00
                    </p>
                  </div>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Desempenho dos Criativos
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-xs text-slate-500 border-b border-white/5">
                        <th className="py-3 px-4 font-medium uppercase tracking-wider">
                          Criativo
                        </th>
                        <th className="py-3 px-4 font-medium uppercase tracking-wider text-right">
                          Lucro Total
                        </th>
                        <th className="py-3 px-4 font-medium uppercase tracking-wider text-right">
                          Meu Lucro
                        </th>
                        <th className="py-3 px-4 font-medium uppercase tracking-wider text-center">
                          Tendência
                        </th>
                        <th className="py-3 px-4 font-medium uppercase tracking-wider text-right">
                          Ação
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-300">
                      <tr className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 border border-white/5">
                              IMG
                            </div>
                            <div>
                              <p className="font-bold text-white">
                                CRI_042_V2_Video_Hook
                              </p>
                              <p className="text-xs text-slate-500">
                                Video Ads • 15s
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-medium">
                          R$ 18.200,00
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-white">
                          R$ 1.820,00
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                            <TrendingUp className="h-3.5 w-3.5" />
                            Ascensão
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            className="text-slate-500 hover:text-[#ffbb00] transition-colors"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                      <tr className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 border border-white/5">
                              IMG
                            </div>
                            <div>
                              <p className="font-bold text-white">
                                CRI_042_V1_Static
                              </p>
                              <p className="text-xs text-slate-500">
                                Image • 1080x1080
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-medium">
                          R$ 12.500,00
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-white">
                          R$ 1.250,00
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                            <TrendingUp className="h-3.5 w-3.5" />
                            Estável
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            className="text-slate-500 hover:text-[#ffbb00] transition-colors"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                      <tr className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 border border-white/5">
                              IMG
                            </div>
                            <div>
                              <p className="font-bold text-white">
                                CRI_038_Carousel
                              </p>
                              <p className="text-xs text-slate-500">
                                Carousel • 5 Slides
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-medium">
                          R$ 11.450,00
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-white">
                          R$ 1.145,00
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold">
                            <TrendingDown className="h-3.5 w-3.5" />
                            Queda
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            className="text-slate-500 hover:text-[#ffbb00] transition-colors"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Op 2 */}
            <div className="bg-[#231e0f]/60 backdrop-blur-md border border-[#ffbb00]/10 rounded-2xl p-6 overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/5 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#353535] to-[#2a2415] flex items-center justify-center border border-white/10">
                    <PlaneTakeoff className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Operação Beta Launch
                    </h3>
                    <p className="text-sm text-slate-400">
                      ID: #OP-9932 • Status:{" "}
                      <span className="text-emerald-400">Ativa</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                      Lucro Total Op.
                    </p>
                    <p className="text-xl font-bold text-white">R$ 31.800,00</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                      Meu Lucro (12%)
                    </p>
                    <p
                      className="text-xl font-bold text-[#ffbb00]"
                      style={{ textShadow: "0 0 10px rgba(255, 187, 0, 0.3)" }}
                    >
                      R$ 3.816,00
                    </p>
                  </div>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Desempenho dos Criativos
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-xs text-slate-500 border-b border-white/5">
                        <th className="py-3 px-4 font-medium uppercase tracking-wider">
                          Criativo
                        </th>
                        <th className="py-3 px-4 font-medium uppercase tracking-wider text-right">
                          Lucro Total
                        </th>
                        <th className="py-3 px-4 font-medium uppercase tracking-wider text-right">
                          Meu Lucro
                        </th>
                        <th className="py-3 px-4 font-medium uppercase tracking-wider text-center">
                          Tendência
                        </th>
                        <th className="py-3 px-4 font-medium uppercase tracking-wider text-right">
                          Ação
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-300">
                      <tr className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 border border-white/5">
                              IMG
                            </div>
                            <div>
                              <p className="font-bold text-white">
                                CRI_055_Story_Motion
                              </p>
                              <p className="text-xs text-slate-500">
                                Story • Motion
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-medium">
                          R$ 20.100,00
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-white">
                          R$ 2.412,00
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                            <TrendingUp className="h-3.5 w-3.5" />
                            Ascensão
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            className="text-slate-500 hover:text-[#ffbb00] transition-colors"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                      <tr className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 border border-white/5">
                              IMG
                            </div>
                            <div>
                              <p className="font-bold text-white">
                                CRI_051_Reels_UGC
                              </p>
                              <p className="text-xs text-slate-500">
                                Reels • UGC
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-medium">
                          R$ 11.700,00
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-white">
                          R$ 1.404,00
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold">
                            <TrendingDown className="h-3.5 w-3.5" />
                            Queda
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            className="text-slate-500 hover:text-[#ffbb00] transition-colors"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Op 3 (Collapsed) */}
            <div className="bg-[#231e0f]/60 backdrop-blur-md border border-[#ffbb00]/10 rounded-2xl p-6 overflow-hidden hover:border-[#ffbb00]/30 transition-all cursor-pointer group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#353535] to-[#2a2415] flex items-center justify-center border border-white/10 group-hover:border-[#ffbb00]/30 transition-colors">
                    <Zap className="text-white h-6 w-6 group-hover:text-[#ffbb00] transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#ffbb00] transition-colors">
                      Operação Gamma Scale
                    </h3>
                    <p className="text-sm text-slate-400">
                      ID: #OP-7712 • Status:{" "}
                      <span className="text-yellow-500">Pausada</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                      Lucro Total Op.
                    </p>
                    <p className="text-xl font-bold text-white">R$ 15.400,00</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                      Meu Lucro (15%)
                    </p>
                    <p className="text-xl font-bold text-slate-200">
                      R$ 2.310,00
                    </p>
                  </div>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    <ChevronUp className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <p className="text-sm text-slate-400">
              Mostrando <span className="text-white font-bold">3</span> de{" "}
              <span className="text-white font-bold">12</span> operações
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
              >
                Anterior
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm text-[#ffbb00] bg-[#ffbb00]/10 rounded-lg border border-[#ffbb00]/20 font-bold"
              >
                1
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
              >
                2
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
              >
                3
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
