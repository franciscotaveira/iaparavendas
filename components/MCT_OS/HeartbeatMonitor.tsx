import React, { useEffect, useRef, useState } from 'react';

/**
 * HEARTBEAT MONITOR (ANTIGRAVITY STYLE)
 * Visualiza a "vida" do sistema. Cada pulso representa uma ação executada com sucesso.
 */

interface HeartbeatProps {
  bpm?: number; // Batimentos por minuto (frequência base)
  active?: boolean; // Se o sistema está ativo
  lastActionTimestamp?: number; // Timestamp da última ação para gerar um pico
}

export const HeartbeatMonitor: React.FC<HeartbeatProps> = ({ 
  bpm = 60, 
  active = true,
  lastActionTimestamp 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pulse, setPulse] = useState(0);

  // Cores do tema Antigravity
  const COLOR_BG = '#050505'; // Quase preto
  const COLOR_GRID = '#1a1a1a'; // Cinza muito escuro
  const COLOR_LINE = '#00ff41'; // Verde Terminal Neon
  const COLOR_LINE_DIM = '#003b0f'; // Rastro

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let x = 0;
    let time = 0;
    
    // Configuração do Canvas
    const resizeObserver = new ResizeObserver(() => {
        canvas.width = canvas.parentElement?.clientWidth || 300;
        canvas.height = canvas.parentElement?.clientHeight || 100;
    });
    resizeObserver.observe(canvas.parentElement!);

    const draw = () => {
      // Efeito de "Fade" para apagar o rastro antigo
      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Desenhar Grid (Retro Sci-Fi)
      ctx.strokeStyle = COLOR_GRID;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
      }
      for (let j = 0; j < canvas.height; j += 20) {
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
      }
      ctx.stroke();

      // Lógica do Eletrocardiograma
      ctx.strokeStyle = COLOR_LINE;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = COLOR_LINE;
      
      ctx.beginPath();
      const centerY = canvas.height / 2;
      
      // Simulando o desenho da linha varrendo a tela
      const speed = 2;
      x = (x + speed) % canvas.width;
      
      // Se voltarmos ao início (x=0), limpamos a tela pra não ficar sujo
      if (x < speed) {
          ctx.fillStyle = COLOR_BG;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // Reinicia caminho
          ctx.moveTo(0, centerY);
      }

      // Desenha o segmento atual
      // Se houver um "pulso" recente, desenha o complexo QRS (o pico do batimento)
      const isPulseFrame = (Date.now() % (60000 / bpm)) < 100; 
      
      let y = centerY;
      
      if (active && isPulseFrame) {
          // Desenha o pico (simulação simples)
          // Isso poderia ser mais complexo com dados reais
          y = centerY - (Math.random() * 50 + 20);
      } else {
          // Ruído basal (o sistema está "vivo" mesmo sem pulso forte)
          y = centerY + (Math.random() * 4 - 2);
      }

      // Conecta o ponto anterior ao atual (aproximado para demo visual)
      ctx.moveTo(x - speed, centerY); // Simplificação
      ctx.lineTo(x, y);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [bpm, active]);

  return (
    <div className="relative w-full h-32 border border-gray-800 rounded bg-black overflow-hidden group">
      <div className="absolute top-2 left-2 text-xs font-mono text-green-500 opacity-70">
        SYSTEM_HEARTBEAT // {bpm} BPM
      </div>
      <canvas ref={canvasRef} className="w-full h-full" />
      {/* Efeito de scanline (monitor velho) */}
      <div className="absolute inset-0 bg-scanline pointer-events-none opacity-20"></div>
    </div>
  );
};

// CSS Suggestion for 'bg-scanline'
// background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
// background-size: 100% 4px;
