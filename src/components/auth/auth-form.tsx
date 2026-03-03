"use client";

import { EyeOff, FileText, Lock, Mail, User, Zap } from "lucide-react";
import { SocialLogin } from "@/components/auth/social-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const inputCls =
  "pl-4 pr-10 py-3 h-auto bg-gray-50 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 rounded-xl text-gray-700 dark:text-gray-200 text-sm placeholder:text-gray-400 focus-visible:ring-[#FFBB00]/50 focus-visible:border-[#FFBB00]";

const submitBtnCls =
  "w-full bg-[#FFBB00] text-black font-bold py-3.5 h-auto rounded-xl shadow-lg shadow-[#FFBB00]/20 hover:bg-[#FFBB00] hover:shadow-[#FFBB00]/40 hover:-translate-y-0.5 transition-all duration-300";

const tabTriggerCls =
  "flex-1 py-2 h-auto rounded-full text-sm font-medium " +
  "data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 " +
  "data-[state=active]:shadow-sm data-[state=active]:font-semibold " +
  "data-[state=active]:text-gray-900 dark:data-[state=active]:text-white " +
  "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300";

export function AuthForm() {
  return (
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

      <Tabs defaultValue="register" className="gap-0">
        <TabsList className="bg-gray-100 dark:bg-zinc-800 rounded-full p-1 h-auto w-full mb-6 shrink-0">
          <TabsTrigger value="login" className={tabTriggerCls}>
            Login
          </TabsTrigger>
          <TabsTrigger value="register" className={tabTriggerCls}>
            Cadastrar
          </TabsTrigger>
        </TabsList>

        {/* Login tab */}
        <TabsContent value="login" className="mt-0">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Bem-vindo de volta
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Faça login para acessar seu painel.
            </p>
          </div>

          <form className="space-y-4">
            <div className="relative">
              <Input
                className={inputCls}
                placeholder="Insira seu e-mail"
                type="email"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="h-5 w-5" />
              </span>
            </div>

            <div className="relative">
              <Input className={inputCls} placeholder="Senha" type="password" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <EyeOff className="h-5 w-5" />
              </span>
            </div>

            <Button className={submitBtnCls} type="submit">
              Entrar
            </Button>
          </form>
        </TabsContent>

        {/* Register tab */}
        <TabsContent value="register" className="mt-0">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Crie sua conta
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Comece a gerenciar sua carreira freelance hoje.
            </p>
          </div>

          <form className="space-y-4">
            <div className="relative">
              <Input
                className={inputCls}
                placeholder="Nome completo"
                type="text"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="h-5 w-5" />
              </span>
            </div>

            <div className="relative">
              <Input
                className={inputCls}
                placeholder="Insira seu e-mail"
                type="email"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="h-5 w-5" />
              </span>
            </div>

            <div className="relative">
              <Input
                className={inputCls}
                placeholder="CPF (apenas números)"
                type="text"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FileText className="h-5 w-5" />
              </span>
            </div>

            <div className="flex gap-4">
              <div className="relative w-1/2">
                <Input
                  className={inputCls}
                  placeholder="Senha"
                  type="password"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <EyeOff className="h-5 w-5" />
                </span>
              </div>

              <div className="relative w-1/2">
                <Input
                  className={inputCls}
                  placeholder="Repita senha"
                  type="password"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="h-5 w-5" />
                </span>
              </div>
            </div>

            <Button className={submitBtnCls} type="submit">
              Cadastrar
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      {/* Divider */}
      <div className="relative flex py-6 items-center shrink-0">
        <div className="grow border-t border-gray-200 dark:border-zinc-700" />
        <span className="shrink-0 mx-4 text-gray-400 text-xs font-medium uppercase">
          Ou
        </span>
        <div className="grow border-t border-gray-200 dark:border-zinc-700" />
      </div>

      <SocialLogin />
    </div>
  );
}
