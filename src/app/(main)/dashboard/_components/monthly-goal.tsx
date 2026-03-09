"use client";

import { Loader2, Pencil, Rocket, Target, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { GoalResponse } from "@/dtos/dashboard.dto";

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function MonthlyGoal() {
  const [data, setData] = useState<GoalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [goalInput, setGoalInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchGoal = useCallback(() => {
    setLoading(true);
    fetch("/api/dashboard/goals")
      .then((res) => res.json())
      .then((json: GoalResponse) => setData(json))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  const handleSetGoal = async () => {
    const amount = Number(
      goalInput
        .replace(/[^\d.,]/g, "")
        .replace(/\./g, "")
        .replace(",", "."),
    );
    if (!amount || amount <= 0) return;

    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        setGoalInput("");
        setIsEditing(false);
        fetchGoal();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="col-span-12 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center h-60">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // No goal set — show goal creation form
  if (data && (data.goal === null || isEditing)) {
    return (
      <Card className="col-span-12 backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-orange-500/20 transition-all duration-500" />
        <CardContent className="p-8 flex flex-col h-full justify-between relative z-10">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-orange-500 rounded-full" />
                <h4 className="font-bold text-lg">
                  {isEditing ? "Editar Meta" : "Meta de Lucro Mensal"}
                </h4>
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Defina sua meta mensal de lucro para acompanhar seu progresso.
            </p>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-bold">
                  R$
                </span>
                <input
                  type="text"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  placeholder="50.000,00"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm font-semibold transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleSetGoal}
                disabled={saving || !goalInput}
                className="px-6 py-3 rounded-xl bg-linear-to-r from-orange-500 to-[#FFBB00] text-black font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Target className="h-4 w-4" />
                )}
                {isEditing ? "Atualizar Meta" : "Definir Meta"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const progressWidth = Math.min(data.percentAchieved, 100);

  return (
    <Card className="col-span-12 backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-orange-500/20 transition-all duration-500" />
      <CardContent className="p-8 flex flex-col h-full justify-between relative z-10">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-6 bg-orange-500 rounded-full" />
              <h4 className="font-bold text-lg">Meta de Lucro Mensal</h4>
            </div>
            <button
              type="button"
              onClick={() => {
                setGoalInput(formatBRL(data.goal ?? 0));
                setIsEditing(true);
              }}
              className="text-muted-foreground hover:text-orange-500 transition-colors p-2 rounded-full hover:bg-orange-500/10"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-8">
            {data.remaining > 0
              ? `Faltam apenas ${formatBRL(data.remaining)} para atingir sua meta pessoal.`
              : "🎉 Parabéns! Você atingiu sua meta mensal!"}
          </p>
          <div className="mb-6">
            <div className="flex justify-between items-end mb-4">
              <span className="text-4xl font-black text-orange-500">
                {data.percentAchieved}%
              </span>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  Objetivo
                </p>
                <p className="text-lg font-bold">
                  {data.goal !== null ? formatBRL(data.goal) : "—"}
                </p>
              </div>
            </div>
            <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-orange-500 to-[#FFBB00] rounded-full shadow-[0_0_20px_rgba(255,108,0,0.3)] transition-all duration-1000"
                style={{ width: `${progressWidth}%` }}
              />
            </div>
          </div>
        </div>
        <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Rocket className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-[11px] font-bold text-orange-500 uppercase tracking-wider">
                Status Atual
              </p>
              <p className="text-sm font-semibold">
                {formatBRL(data.achieved)} acumulados
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
