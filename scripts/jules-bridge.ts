/**
 * 🛰️ JULES MULTI-AGENT SQUAD BRIDGE
 * Transforma o Jules em um líder de equipe para máxima velocidade.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

export class JulesSquadBridge {
    /**
     * Lança um SQUAD de agentes para uma missão específica
     * @param mission Descrição da missão
     * @param agents Número de agentes no squad (padrão 3 para modo multi-equipe)
     */
    static async launchSquad(mission: string, agents: number = 3) {
        console.log(`🚀 [SQUAD MCT OS] Lançando equipe de ${agents} agentes Jules...`);
        console.log(`🎯 Missão: ${mission}`);

        try {
            // Usando a flag --parallel para instanciar múltiplos agentes na mesma tarefa
            const command = `npx jules new --parallel ${agents} "${mission}"`;
            const { stdout, stderr } = await execAsync(command);

            console.log("✅ [SQUAD] Equipe em campo. Acompanhe no terminal/TUI.");
            console.log(stdout);
            if (stderr) console.error(stderr);
        } catch (error) {
            console.error("❌ [SQUAD] Falha ao convocar equipe. Verifique o 'npx jules login'.");
        }
    }
}

// CLI Interface
if (require.main === module) {
    const mission = process.argv[2];
    const agents = parseInt(process.argv[3]) || 3;
    if (mission) {
        JulesSquadBridge.launchSquad(mission, agents);
    }
}
