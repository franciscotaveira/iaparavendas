#!/bin/bash
# ============================================================
# 🌙 LUMAX DOJO - TREINAMENTO NOTURNO INFINITO
# ============================================================
# Autor: Antigravity AI
# Data: 2025-01-01
# Descrição: Ativa aprendizado contínuo até as 7h da manhã
# ============================================================

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configurações
STOP_HOUR=7  # Hora de parar (7h da manhã)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_DIR/night_training_$(date +%Y%m%d_%H%M%S).log"

# Lista de agentes para treinamento
AGENTS=(
    "sdr"
    "closer"
    "support"
    "scheduler"
    "qualifier"
    "dev_fullstack"
    "dev_architect"
    "dev_devops"
    "dev_dba"
    "dev_security"
    "mkt_copywriter"
    "mkt_growth"
    "mkt_social"
    "mkt_ads"
    "mkt_seo"
    "product_pm"
    "product_ux"
    "product_ui"
    "product_analyst"
    "ops_ceo"
    "ops_coo"
    "ops_cfo"
    "ops_hr"
    "ops_cs"
)

# Função para exibir banner
show_banner() {
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║                                                                  ║"
    echo "║   🌙 LUMAX DOJO - TREINAMENTO NOTURNO ATIVADO 🥋               ║"
    echo "║                                                                  ║"
    echo "║   Todos os agentes em modo de aprendizado contínuo              ║"
    echo "║   Treinamento ativo até às ${STOP_HOUR}h da manhã                         ║"
    echo "║                                                                  ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Função para checar se deve continuar
should_continue() {
    current_hour=$(date +%H)
    # Continua se não for a hora de parar (considerando que começamos à noite)
    # Paramos se for >= STOP_HOUR e < 12 (manhã)
    if [[ $current_hour -ge $STOP_HOUR && $current_hour -lt 12 ]]; then
        return 1  # False - parar
    fi
    return 0  # True - continuar
}

# Função para log
log() {
    local message="$1"
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo "[$timestamp] $message" | tee -a "$LOG_FILE"
}

# Função principal
main() {
    show_banner
    
    log "🚀 Iniciando treinamento noturno..."
    log "📍 Diretório do projeto: $PROJECT_DIR"
    log "📝 Log sendo salvo em: $LOG_FILE"
    log "⏰ Hora atual: $(date '+%H:%M:%S')"
    log "🛑 Treinamento programado para parar às ${STOP_HOUR}h"
    log "🤖 Total de agentes: ${#AGENTS[@]}"
    
    echo -e "${GREEN}"
    echo "Agentes que serão treinados:"
    for agent in "${AGENTS[@]}"; do
        echo "  ✓ $agent"
    done
    echo -e "${NC}"
    
    # Navega para o diretório do projeto
    cd "$PROJECT_DIR"
    
    # Contador de batalhas
    BATTLE_COUNT=0
    START_TIME=$(date +%s)
    
    echo ""
    log "⚔️  Iniciando modo DOJO INFINITO..."
    echo ""
    
    # Executa o dojo em modo infinito com npx tsx
    # O script dojo.ts já tem o modo --infinite que roda continuamente
    while should_continue; do
        BATTLE_COUNT=$((BATTLE_COUNT + 1))
        
        # Seleciona um agente aleatório
        RANDOM_INDEX=$((RANDOM % ${#AGENTS[@]}))
        AGENT="${AGENTS[$RANDOM_INDEX]}"
        
        log "🥊 Batalha #$BATTLE_COUNT - Treinando agente: $AGENT"
        
        # Executa uma batalha do dojo para o agente específico
        npx tsx scripts/dojo.ts --agent="$AGENT" 2>&1 | tee -a "$LOG_FILE"
        
        # Pequena pausa entre batalhas
        sleep 3
        
        # Status a cada 10 batalhas
        if [[ $((BATTLE_COUNT % 10)) -eq 0 ]]; then
            ELAPSED=$(($(date +%s) - START_TIME))
            HOURS=$((ELAPSED / 3600))
            MINUTES=$(((ELAPSED % 3600) / 60))
            log "📊 Status: $BATTLE_COUNT batalhas em ${HOURS}h ${MINUTES}m"
        fi
    done
    
    # Finalização
    END_TIME=$(date +%s)
    TOTAL_TIME=$((END_TIME - START_TIME))
    TOTAL_HOURS=$((TOTAL_TIME / 3600))
    TOTAL_MINUTES=$(((TOTAL_TIME % 3600) / 60))
    
    echo ""
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║                                                                  ║"
    echo "║   ✅ TREINAMENTO NOTURNO CONCLUÍDO!                             ║"
    echo "║                                                                  ║"
    echo "║   📊 Total de batalhas: $BATTLE_COUNT                                    "
    echo "║   ⏱️  Tempo total: ${TOTAL_HOURS}h ${TOTAL_MINUTES}m                              "
    echo "║   📝 Log completo: $LOG_FILE                                    "
    echo "║                                                                  ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    log "✅ Treinamento noturno finalizado!"
    log "📊 Total de batalhas: $BATTLE_COUNT"
    log "⏱️  Tempo total: ${TOTAL_HOURS}h ${TOTAL_MINUTES}m"
}

# Executa
main "$@"
