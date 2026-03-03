import { Zap } from "lucide-react";

export function AuthSidebar() {
  return (
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
          Unauthorized use or reproduction of any content or materials from this
          site is strictly prohibited.
        </p>
      </div>
    </div>
  );
}
