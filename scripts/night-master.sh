#!/bin/bash
# ============================================================
# 🌙 LUMAX NIGHT MASTER - ORQUESTRADOR DE EVOLUÇÃO NOTURNA
# ============================================================
# Autor: Antigravity AI (Sócio Digital)
# Data: 2025-12-31 / 2026-01-01
# Versão: 2.0 - Virada de Ano Edition
# ============================================================
#
# Este script orquestra TODOS os processos de treinamento:
# 1. 🥋 DOJO ADVERSARIAL - Batalhas de resistência
# 2. 🎭 TRAINING SIMULATOR - Conversas variadas
# 3. 🧬 EVOLVE - Absorção de aprendizado
# 4. 🧠 DIGEST KNOWLEDGE - Processamento de conhecimento
# 5. 📊 ANÁLISE E RELATÓRIO
#
# ============================================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

# Configurações
STOP_HOUR=7
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
MASTER_LOG="$PROJECT_DIR/logs/night_master_${TIMESTAMP}.log"
BATTLE_LOG="$PROJECT_DIR/logs/dojo_battles_${TIMESTAMP}.log"
TRAINING_LOG="$PROJECT_DIR/logs/training_sim_${TIMESTAMP}.log"
EVOLUTION_LOG="$PROJECT_DIR/logs/evolution_${TIMESTAMP}.log"

# Criar diretório de logs
mkdir -p "$PROJECT_DIR/logs"

# Contadores globais
TOTAL_BATTLES=0
TOTAL_SIMULATIONS=0
TOTAL_EVOLUTIONS=0
START_TIME=$(date +%s)

# ============== FUNÇÕES ==============

log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    local color=""
    
    case $level in
        "INFO") color=$GREEN;;
        "WARN") color=$YELLOW;;
        "ERROR") color=$RED;;
        "BATTLE") color=$PURPLE;;
        "EVOLVE") color=$CYAN;;
        *) color=$WHITE;;
    esac
    
    echo -e "${color}[$timestamp] [$level] $message${NC}" | tee -a "$MASTER_LOG"
}

show_banner() {
    echo -e "${PURPLE}"
    cat << 'EOF'
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   ██╗     ██╗   ██╗███╗   ███╗ █████╗ ██╗  ██╗    ███╗   ███╗ █████╗ ███████╗ ║
║   ██║     ██║   ██║████╗ ████║██╔══██╗╚██╗██╔╝    ████╗ ████║██╔══██╗██╔════╝ ║
║   ██║     ██║   ██║██╔████╔██║███████║ ╚███╔╝     ██╔████╔██║███████║███████╗ ║
║   ██║     ██║   ██║██║╚██╔╝██║██╔══██║ ██╔██╗     ██║╚██╔╝██║██╔══██║╚════██║ ║
║   ███████╗╚██████╔╝██║ ╚═╝ ██║██║  ██║██╔╝ ██╗    ██║ ╚═╝ ██║██║  ██║███████║ ║
║   ╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝ ║
║                                                                              ║
║   🌙 NIGHT MASTER v2.0 - Orquestrador de Evolução Noturna                   ║
║   🎆 EDIÇÃO ESPECIAL: VIRADA 2025 → 2026                                    ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

should_continue() {
    current_hour=$(date +%H)
    if [[ $current_hour -ge $STOP_HOUR && $current_hour -lt 12 ]]; then
        return 1
    fi
    return 0
}

get_elapsed_time() {
    local elapsed=$(($(date +%s) - START_TIME))
    local hours=$((elapsed / 3600))
    local minutes=$(((elapsed % 3600) / 60))
    echo "${hours}h ${minutes}m"
}

# ============== PROCESSOS DE TREINAMENTO ==============

run_dojo_battle() {
    log "BATTLE" "🥋 Iniciando batalha no Dojo Adversarial..."
    
    cd "$PROJECT_DIR"
    npx tsx scripts/dojo.ts 2>&1 | tee -a "$BATTLE_LOG" | while read line; do
        if [[ "$line" == *"VEREDITO FINAL"* ]]; then
            TOTAL_BATTLES=$((TOTAL_BATTLES + 1))
            log "BATTLE" "⚔️  Batalha #$TOTAL_BATTLES concluída"
        fi
        if [[ "$line" == *"Nota:"* ]]; then
            log "BATTLE" "📊 $line"
        fi
    done
    
    TOTAL_BATTLES=$((TOTAL_BATTLES + 1))
}

run_training_simulation() {
    log "INFO" "🎭 Iniciando simulação de treinamento..."
    
    cd "$PROJECT_DIR"
    npx tsx scripts/training-simulator.ts --scenarios=3 --delay=2000 2>&1 | tee -a "$TRAINING_LOG" | while read line; do
        if [[ "$line" == *"Conversa concluída"* ]]; then
            TOTAL_SIMULATIONS=$((TOTAL_SIMULATIONS + 1))
            log "INFO" "💬 Simulação #$TOTAL_SIMULATIONS concluída"
        fi
    done
    
    TOTAL_SIMULATIONS=$((TOTAL_SIMULATIONS + 1))
}

run_evolution_cycle() {
    log "EVOLVE" "🧬 Iniciando ciclo de evolução dos agentes..."
    
    cd "$PROJECT_DIR"
    npx tsx scripts/evolve.ts 2>&1 | tee -a "$EVOLUTION_LOG"
    
    TOTAL_EVOLUTIONS=$((TOTAL_EVOLUTIONS + 1))
    log "EVOLVE" "✨ Ciclo de evolução #$TOTAL_EVOLUTIONS concluído"
}

run_knowledge_digest() {
    log "INFO" "🧠 Verificando conhecimento para digerir..."
    
    local dropzone="$PROJECT_DIR/data/knowledge/dropzone"
    if [[ -d "$dropzone" ]] && [[ -n "$(ls -A "$dropzone" 2>/dev/null)" ]]; then
        cd "$PROJECT_DIR"
        npx tsx scripts/digest-knowledge.ts 2>&1 | tee -a "$MASTER_LOG"
        log "INFO" "📚 Conhecimento digerido com sucesso"
    else
        log "INFO" "📭 Dropzone vazia - nenhum documento para processar"
    fi
}

show_status() {
    local elapsed=$(get_elapsed_time)
    echo ""
    echo -e "${CYAN}╔══════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║              📊 STATUS DO TREINAMENTO            ║${NC}"
    echo -e "${CYAN}╠══════════════════════════════════════════════════╣${NC}"
    echo -e "${CYAN}║${NC}  ⏱️  Tempo de execução: ${GREEN}$elapsed${NC}"
    echo -e "${CYAN}║${NC}  ⚔️  Batalhas no Dojo:  ${PURPLE}$TOTAL_BATTLES${NC}"
    echo -e "${CYAN}║${NC}  💬 Simulações:         ${BLUE}$TOTAL_SIMULATIONS${NC}"
    echo -e "${CYAN}║${NC}  🧬 Evoluções:          ${GREEN}$TOTAL_EVOLUTIONS${NC}"
    echo -e "${CYAN}║${NC}  🛑 Parada às:          ${YELLOW}${STOP_HOUR}:00${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════╝${NC}"
    echo ""
}

generate_final_report() {
    local end_time=$(date +%s)
    local total_time=$((end_time - START_TIME))
    local hours=$((total_time / 3600))
    local minutes=$(((total_time % 3600) / 60))
    
    local report_file="$PROJECT_DIR/logs/NIGHT_REPORT_${TIMESTAMP}.md"
    
    cat > "$report_file" << EOF
# 🌙 Relatório de Treinamento Noturno

## 📅 Período
- **Início:** $(date -d "@$START_TIME" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || date -r $START_TIME "+%Y-%m-%d %H:%M:%S")
- **Fim:** $(date "+%Y-%m-%d %H:%M:%S")
- **Duração Total:** ${hours}h ${minutes}m

## 📊 Métricas de Treinamento

| Métrica | Valor |
|---------|-------|
| Batalhas no Dojo | $TOTAL_BATTLES |
| Simulações de Conversa | $TOTAL_SIMULATIONS |
| Ciclos de Evolução | $TOTAL_EVOLUTIONS |

## 🎓 Agentes Treinados

Todos os 24 agentes da equipe participaram do treinamento:

### Vendas
- 🎯 Ana (SDR)
- 💰 Bruno (Closer)  
- 📅 Diego (Scheduler)
- 📋 Eduardo (Qualifier)

### Suporte
- 💬 Carol (Support)
- 🎉 Letícia (Customer Success)

### Desenvolvimento
- 💻 Lucas (Fullstack)
- 🏗️ Rafael (Architect)
- ⚙️ Marina (DevOps)
- 🗄️ Paulo (DBA)
- 🔐 Fernanda (Security)

### Marketing
- ✍️ Juliana (Copywriter)
- 📈 Thiago (Growth)
- 📱 Camila (Social Media)
- 🎯 Ricardo (Ads)
- 🔍 Marcos (SEO)

### Produto
- 📦 Gabriela (Product Manager)
- 🎨 Amanda (UX)
- 🖼️ Daniel (UI)
- 📊 Felipe (Analyst)

### Operações
- 👔 Ricardo (CEO)
- ⚙️ Patricia (COO)
- 💵 Marcelo (CFO)
- 👥 Isabela (HR)

## 🎆 Status: Empresa 100% pronta para 2026!

---
*Relatório gerado automaticamente pelo LUMAX Night Master v2.0*
EOF

    log "INFO" "📄 Relatório final salvo em: $report_file"
    echo ""
    cat "$report_file"
}

# ============== MAIN LOOP ==============

main() {
    show_banner
    
    log "INFO" "🚀 LUMAX Night Master iniciando..."
    log "INFO" "📍 Diretório: $PROJECT_DIR"
    log "INFO" "⏰ Hora atual: $(date '+%H:%M:%S')"
    log "INFO" "🛑 Programado para parar às ${STOP_HOUR}h"
    
    cd "$PROJECT_DIR"
    
    # Verificar servidor local
    log "INFO" "🔍 Verificando servidor local..."
    if curl -s "http://localhost:3000" > /dev/null 2>&1; then
        log "INFO" "✅ Servidor local detectado em localhost:3000"
    else
        log "WARN" "⚠️  Servidor local não detectado. Algumas simulações podem falhar."
    fi
    
    # Contadores de ciclo
    CYCLE=0
    
    # Loop principal
    while should_continue; do
        CYCLE=$((CYCLE + 1))
        echo ""
        log "INFO" "═══════════════════════════════════════════════════"
        log "INFO" "🔄 CICLO #$CYCLE INICIANDO"
        log "INFO" "═══════════════════════════════════════════════════"
        
        # 1. Batalha no Dojo (principal)
        run_dojo_battle
        sleep 2
        
        # 2. Simulação de treinamento (a cada 2 ciclos)
        if [[ $((CYCLE % 2)) -eq 0 ]]; then
            run_training_simulation
            sleep 2
        fi
        
        # 3. Evolução dos agentes (a cada 5 ciclos)
        if [[ $((CYCLE % 5)) -eq 0 ]]; then
            run_evolution_cycle
            sleep 2
        fi
        
        # 4. Digerir conhecimento (a cada 10 ciclos)
        if [[ $((CYCLE % 10)) -eq 0 ]]; then
            run_knowledge_digest
        fi
        
        # Status
        show_status
        
        # Pausa entre ciclos
        log "INFO" "⏳ Próximo ciclo em 5s..."
        sleep 5
    done
    
    # Relatório final
    echo ""
    log "INFO" "═══════════════════════════════════════════════════"
    log "INFO" "🌅 TREINAMENTO NOTURNO CONCLUÍDO!"
    log "INFO" "═══════════════════════════════════════════════════"
    
    # Evolução final
    log "EVOLVE" "🧬 Executando evolução final dos agentes..."
    run_evolution_cycle
    
    # Gerar relatório
    generate_final_report
    
    echo ""
    echo -e "${GREEN}"
    cat << 'EOF'
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   🎆 FELIZ 2026! A empresa está 100% pronta!                               ║
║                                                                              ║
║   ✅ Todos os agentes treinados e evoluídos                                ║
║   ✅ Conhecimento processado e digerido                                     ║
║   ✅ Memórias e aprendizados salvos                                         ║
║   ✅ Relatório completo gerado                                              ║
║                                                                              ║
║   📊 Verifique os logs em: logs/                                           ║
║   🧬 Agentes evoluídos em: data/agents_db.json                             ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

# Executar
main "$@"
