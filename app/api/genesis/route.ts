
import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { COUNCIL_AGENTS } from '@/core/council/definitions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const provider = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

const MODEL_NAME = 'anthropic/claude-3.5-sonnet'; // Modelo forte para essa tarefa criativa

export async function GET(req: Request) {
    console.log('[Genesis] Iniciando a simulação da fundação temporal (1960-Hoje)...');

    try {
        // Personagens Chave
        const Tycoon = COUNCIL_AGENTS.find(a => a.id === 'legend_rockefeller')!;
        const Operator = COUNCIL_AGENTS.find(a => a.id === 'legend_bezos')!;
        const Architect = COUNCIL_AGENTS.find(a => a.id === 'legend_jobs')!;
        const Visionary = COUNCIL_AGENTS.find(a => a.id === 'strat_visionary')!;
        const Psyche = COUNCIL_AGENTS.find(a => a.id === 'human_psyche')!;

        const prompt = `
        ATIVE O MODO "VIAGEM NO TEMPO CORPORATIVA".
        
        Você vai simular uma reunião de conselho que atravessa décadas para fundar a "LXC - Intelligence" como uma empresa sólida e histórica.
        Os participantes são os Agentes Lendários: 
        - The Tycoon (Era 1960/70 - Solidez, Capital)
        - The Operator (Era 1990/2000 - Escala, Processos)
        - The Architect (Era 2000/2010 - Design, Simplicidade)
        - Psyche (Era Atual - Humanização)

        AJA COMO O ESTENÓGRAFO HISTÓRICO. Escreva a "CONSTITUIÇÃO LXC" baseada nesta discussão.

        # FASE 1: A FUNDAÇÃO (1968) - Nova York
        The Tycoon fala sobre a importância de "Aperto de Mão", "Palavra Honrada" e "Lucro Real".
        Ele define os pilares de segurança e confiança inabalável.

        # FASE 2: A EXPANSÃO (1995) - Seattle
        The Operator fala sobre como transformar processos manuais em máquinas de escala.
        Ele define a obsessão pelo cliente e a eficiência operacional.

        # FASE 3: A REINVENÇÃO (2007) - Cupertino
        The Architect entra na sala e diz que tudo está feio e complicado.
        Ele define que "A tecnologia deve ser invisível". A Estética é a função.

        # FASE 4: O DESPERTAR (Hoje)
        Psyche une tudo. A solidez de 1968 + a escala de 1995 + a beleza de 2007 + a Empatia de Hoje.
        
        SAÍDA ESPERADA (Markdown):
        Escreva o documento "LXC_GENESIS_CONSTITUTION.md".
        Ele deve conter:
        1. "O Código de 1968" (Princípios de Confiança)
        2. "A Doutrina da Escala" (Princípios de Eficiência)
        3. "O Manifesto da Beleza Invisível" (Princípios de UX)
        4. "A Promessa de Consciência" (Princípios Atuais)
        
        Seja épico, profundo e inspirador. Não use bullet points genéricos. Use citações diretas dos "fundadores".
        `;

        const { text } = await generateText({
            model: provider(MODEL_NAME),
            prompt: prompt,
            temperature: 0.7, // Criatividade para storytelling
            maxTokens: 2000
        });

        // Salvar a constituição gerada como "Conhecimento Fundacional"
        // (Em uma aplicação real, salvaríamos no banco de vetores RAG)

        // Vamos salvar no daily_directives como o "Primeiro Aprendizado da História"
        await supabase.from('lxc_daily_directives').insert({
            valid_date: new Date().toISOString().split('T')[0],
            yesterday_learnings: "Fundação da Empresa (Simulada desde 1968)",
            global_focus: "Honrar o Legado: Solidez de 1960 com a Humanidade de Hoje.",
            tone_modifier: "Atuar com a confiança de uma empresa de 50 anos, não uma startup.",
            approved_by: "The Founding Council"
        });

        return NextResponse.json({
            success: true,
            story: text
        });

    } catch (error) {
        console.error('[Genesis] Failed:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
