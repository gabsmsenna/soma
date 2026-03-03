"use client";

import { Zap } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("register");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1a1a1a] relative">
      {/* Background glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-300 h-200 bg-[#FFBB00]/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <main className="w-full max-w-275 h-212.5 md:h-187.5 bg-gray-50 dark:bg-[#121212] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        {/* Left Panel — Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-12 flex flex-col relative bg-white dark:bg-zinc-900 overflow-y-auto scrollbar-hide">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FFBB00] rounded-lg flex items-center justify-center text-black font-bold">
              <Zap className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Soma
            </h1>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {mode === "register" ? "Crie sua conta" : "Bem-vindo de volta"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {mode === "register"
                ? "Comece a gerenciar sua carreira freelance hoje."
                : "Faça login para acessar seu painel."}
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-gray-100 dark:bg-zinc-800 rounded-full p-1 flex mb-6 shrink-0">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2 text-sm font-medium transition-all rounded-full ${
                mode === "login"
                  ? "bg-white dark:bg-zinc-700 shadow-sm font-semibold text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 py-2 text-sm font-medium transition-all rounded-full ${
                mode === "register"
                  ? "bg-white dark:bg-zinc-700 shadow-sm font-semibold text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Cadastrar
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4">
            {mode === "register" && (
              <div className="relative group">
                <input
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFBB00]/50 focus:border-[#FFBB00] transition-all text-sm placeholder-gray-400"
                  placeholder="Nome completo"
                  type="text"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </span>
              </div>
            )}

            <div className="relative group">
              <input
                className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFBB00]/50 focus:border-[#FFBB00] transition-all text-sm placeholder-gray-400"
                placeholder="Insira seu e-mail"
                type="email"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              </span>
            </div>

            {mode === "register" && (
              <div className="relative group">
                <input
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFBB00]/50 focus:border-[#FFBB00] transition-all text-sm placeholder-gray-400"
                  placeholder="CPF (apenas números)"
                  type="text"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                    />
                  </svg>
                </span>
              </div>
            )}

            <div className={mode === "register" ? "flex gap-4" : ""}>
              <div
                className={`relative group ${mode === "register" ? "w-1/2" : "w-full"}`}
              >
                <input
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFBB00]/50 focus:border-[#FFBB00] transition-all text-sm placeholder-gray-400"
                  placeholder="Senha"
                  type="password"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                </span>
              </div>
              {mode === "register" && (
                <div className="relative group w-1/2">
                  <input
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFBB00]/50 focus:border-[#FFBB00] transition-all text-sm placeholder-gray-400"
                    placeholder="Repita senha"
                    type="password"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                  </span>
                </div>
              )}
            </div>

            <button
              className="w-full bg-[#FFBB00] text-black font-bold py-3.5 rounded-xl shadow-lg shadow-[#FFBB00]/20 hover:shadow-[#FFBB00]/40 hover:-translate-y-0.5 transition-all duration-300"
              type="submit"
            >
              {mode === "register" ? "Cadastrar" : "Entrar"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-6 items-center shrink-0">
            <div className="grow border-t border-gray-200 dark:border-zinc-700" />
            <span className="shrink-0 mx-4 text-gray-400 text-xs font-medium uppercase">
              Ou
            </span>
            <div className="grow border-t border-gray-200 dark:border-zinc-700" />
          </div>

          {/* Social buttons */}
          <div className="space-y-3 shrink-0">
            <button
              type="button"
              className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-full flex items-center justify-center gap-3 font-medium hover:opacity-90 transition-opacity"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Logar com conta Apple"
              >
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.93 3.16-.93 1.25.04 2.37.56 3.08 1.48-2.68 1.57-2.3 5.48.24 6.77-.54 1.83-1.39 3.65-2.56 4.91zM12.03 5.31c-.34-2.18 1.83-4.04 3.79-4.31.39 2.5-2.53 4.54-3.79 4.31z" />
              </svg>
              <span>Sign up with Apple</span>
            </button>
            <button
              type="button"
              className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-200 py-3 rounded-full flex items-center justify-center gap-3 font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Logar com Google"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>
        </div>

        {/* Right Panel — Visual */}
        <div className="hidden md:block w-1/2 relative bg-[#353535] overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-[#1a1a1a]/90 via-[#353535]/50 to-blue-900/40" />
          <div className="absolute inset-0 bg-linear-to-br from-black via-transparent to-transparent opacity-90" />

          {/* Decorative elements */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#FFBB00]/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 right-1/3 w-16 h-16 bg-[#FFBB00]/15 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />

          {/* Central brand element */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-[#FFBB00]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-[#FFBB00]/30">
                <Zap className="h-10 w-10 text-[#FFBB00]" />
              </div>
              <p className="text-white/60 text-sm font-medium tracking-wider uppercase">
                Soma
              </p>
            </div>
          </div>

          {/* Footer glass panel */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
            <p className="text-[10px] text-gray-300 leading-relaxed font-light">
              © 2025 Soma. All rights reserved.
              <br />
              Unauthorized use or reproduction of any content or materials from
              this site is strictly prohibited.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
