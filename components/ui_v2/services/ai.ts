import { GoogleGenAI, Type } from "@google/genai";

// Initialize AI (optional - will work without)
const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const lookupCompanyInfo = async (name: string) => {
  if (!ai) {
    // Fallback: infer from name
    const lowName = name.toLowerCase();
    let niche = 'Serviços';
    if (lowName.includes('tech') || lowName.includes('soft')) niche = 'SaaS';
    else if (lowName.includes('fin') || lowName.includes('invest')) niche = 'Mercado Financeiro';
    else if (lowName.includes('clinic') || lowName.includes('health') || lowName.includes('dr')) niche = 'Saúde';

    return {
      description: `${name} - empresa do segmento ${niche}`,
      niche,
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Find the short description (under 200 chars) and the industry niche for the company: "${name}". 
      If you cannot find it, return generic information based on what the name implies.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            niche: { type: Type.STRING },
          },
        },
      },
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Lookup failed", error);
    return { description: name, niche: 'Serviços' };
  }
};

export const generateAgentPrompt = async (
  name: string,
  niche: string,
  tone: string,
  description: string
) => {
  if (!ai) {
    // Fallback: generate a basic prompt
    return `Você é o agente de vendas da ${name}.
    
Contexto:
- Empresa: ${name}
- Nicho: ${niche}
- Tom: ${tone}
- Descrição: ${description}

Seu objetivo é:
1. Ser humanizado e natural nas respostas
2. Qualificar o lead entendendo suas necessidades
3. Agendar uma reunião via Calendly quando apropriado
4. Tratar objeções com empatia

Regras:
- Nunca invente informações sobre preços ou prazos
- Se não souber, admita e ofereça conectar com um especialista
- Mantenha respostas curtas e objetivas (máx 3 parágrafos)`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `You are an expert AI Agent Architect. Create a highly humanized system prompt for a WhatsApp agent.
      
      Context:
      - Company: ${name}
      - Industry Niche: ${niche}
      - Tone of Voice: ${tone}
      - Company Description: ${description}
      
      The agent must:
      1. Be indistinguishable from a human.
      2. Aim to schedule a meeting via Calendly.
      3. Handle objections gracefully.
      4. Never hallucinate prices or deadlines.
      
      Output the raw system prompt text directly in Portuguese (Brazil).`,
    });
    return response.text || "Error generating prompt.";
  } catch (error) {
    console.error("AI Generation failed", error);
    return "Error generating prompt. Please try again later.";
  }
};

export const chatWithAssistant = async (message: string, history: { role: 'user' | 'model', text: string }[]) => {
  if (!ai) {
    return "AI não configurada. Configure a GEMINI_API_KEY no arquivo .env";
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] }))
    });
    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat failed", error);
    return "Sorry, I'm having trouble connecting to the AI brain right now.";
  }
};