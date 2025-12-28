import DemoChat from "@/components/DemoChat";
import { CheckCircle2, ArrowRight, Zap, ShieldCheck, BrainCircuit } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">

      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[128px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[96px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20 min-h-screen flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* Left Content */}
        <div className="flex-1 space-y-8 text-center lg:text-left">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
            <span className="text-xs font-medium text-zinc-400 tracking-wide uppercase">IA Cognitiva de Vendas v1.0</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Transforme conversas em <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">vendas reais</span> 24/7.
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Não é um chatbot genérico. É um Agente Cognitivo treinado para qualificar leads, remover dúvidas e entregar clientes prontos no seu WhatsApp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <a
              href="https://wa.me/5548999999999" // TODO: Colocar link real de vendas
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all flex items-center gap-2"
            >
              Implantar Agora <ArrowRight size={18} />
            </a>
            <p className="text-sm text-zinc-500">Ou teste ao lado 👉</p>
          </div>

          <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {[
              { icon: Zap, label: "Respostas em <2s" },
              { icon: BrainCircuit, label: "Entende Contexto" },
              { icon: ShieldCheck, label: "Zero Alucinação" },
              { icon: CheckCircle2, label: "Handoff Humano" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-zinc-400">
                <item.icon className="w-5 h-5 text-blue-500/50" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content - Chat Demo */}
        <div className="flex-1 w-full max-w-md lg:max-w-xl relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 animate-pulse" />
          <DemoChat />
          <div className="mt-6 text-center">
            <p className="text-xs text-zinc-600 uppercase tracking-widest">Ambiente de Demonstração Seguro</p>
          </div>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="relative z-10 border-t border-zinc-900 bg-black py-12 text-center">
        <p className="text-zinc-600 text-sm">
          © 2024 IAParaVendas.tech — Powered by <span className="text-zinc-400 font-semibold">Lux AI Engine</span>.
        </p>
      </footer>
    </main>
  );
}
