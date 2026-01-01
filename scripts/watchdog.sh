#!/bin/bash
# 🛡️ LUMAX WORKER WATCHDOG
# Garante que o Worker esteja sempre rodando 24/7.

PROCESS_NAME="core/worker/processor.ts"
LOG_FILE="logs/worker_watchdog.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log "🐶 Watchdog iniciado para monitorar: $PROCESS_NAME"

while true; do
    if ! ps aux | grep "$PROCESS_NAME" | grep -v grep > /dev/null; then
        log "⚠️ Worker caiu! Reiniciando agora..."
        nohup npx tsx "$PROCESS_NAME" >> logs/worker_live.log 2>&1 &
        log "✅ Worker reiniciado com PID: $!"
    fi
    sleep 30
done
