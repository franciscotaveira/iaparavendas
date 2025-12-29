'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert, Cpu, Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KernelTerminal({ onClose }: { onClose: () => void }) {
    const [history, setHistory] = useState<string[]>([
        "MOUNTING KERNEL...",
        "ACCESS LEVEL: GOD_MODE",
        "BYPASSING SAFETY PROTOCOLS...",
        "CX-90 NEURAL INTERFACE ONLINE.",
        "Listening for override commands..."
    ]);
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = async (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = input.trim().toUpperCase();
        if (!cmd) return;

        setHistory(prev => [...prev, `> ${cmd}`]);
        setInput('');

        // Simulation of "God Mode" capabilities
        setTimeout(() => {
            let response = "COMMAND NOT RECOGNIZED. TRY 'HELP'.";

            if (cmd === 'HELP') {
                response = "AVAILABLE COMMANDS: [PURGE_ALL] [OVERCLOCK] [GENESIS] [TRUE_SIGHT]";
            } else if (cmd === 'OVERCLOCK') {
                response = "WARNING: INCREASING AGENT CLOCK SPEED TO 150%... HEAT SIG RISING... PERFORMANCE BOOSTED.";
            } else if (cmd === 'PURGE_ALL') {
                response = "DELETING IRRELEVANT MEMORIES... CACHE CLEARED. 402MB FREED.";
            } else if (cmd === 'GENESIS') {
                response = "SPAWNING NEW AGENT ARCHETYPE BASED ON MARKET GAPS... [CREATING 'THE CLOSER V2']...";
            } else if (cmd === 'TRUE_SIGHT') {
                response = "REVEALING HIDDEN PATTERNS... 3 HIDDEN OBJECTIONS DETECTED IN LAST BATCH. UPDATING MATRIX.";
            } else if (cmd === 'SHUTDOWN') {
                onClose();
                return;
            }

            setHistory(prev => [...prev, `[SYSTEM]: ${response}`]);
        }, 500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center font-mono p-4"
        >
            <div className="w-full max-w-3xl border border-red-500/50 bg-black shadow-[0_0_50px_rgba(220,38,38,0.2)] rounded-lg overflow-hidden flex flex-col h-[600px]">
                {/* Header */}
                <div className="bg-red-950/20 border-b border-red-900/30 p-2 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-red-500 text-xs tracking-widest px-2">
                        <ShieldAlert className="w-4 h-4 animate-pulse" />
                        GOD_MODE // ROOT ACCESS
                    </div>
                    <button onClick={onClose} className="text-red-500 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Matrix Content */}
                <div className="flex-1 p-6 overflow-y-auto space-y-2 text-sm text-red-400">
                    {history.map((line, i) => (
                        <div key={i} className={`${line.startsWith('>') ? 'text-white font-bold' : 'opacity-80'}`}>
                            {line}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleCommand} className="p-4 border-t border-red-900/30 bg-red-950/10 flex gap-2">
                    <span className="text-red-500 animate-pulse">{'>'}</span>
                    <input
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-red-100 placeholder-red-900/50"
                        placeholder="ENTER ROOT COMMAND..."
                    />
                </form>
            </div>
        </motion.div>
    );
}
