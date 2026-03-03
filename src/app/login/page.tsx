import { AuthForm } from "@/components/auth/auth-form";
import { AuthSidebar } from "@/components/auth/auth-sidebar";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1a1a1a] relative">
      {/* Background glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-300 h-200 bg-[#FFBB00]/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <main className="w-full max-w-275 h-auto min-h-[600px] bg-gray-50 dark:bg-[#121212] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        <AuthForm />
        <AuthSidebar />
      </main>
    </div>
  );
}
