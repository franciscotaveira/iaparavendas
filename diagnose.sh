#!/bin/bash
SERVER_IP="158.220.117.15"

echo "🔍 INICIANDO DIAGNÓSTICO DO SERVIDOR ($SERVER_IP)..."
echo "==================================================="

ssh -t root@$SERVER_IP "
    echo '1. STATUS DOS CONTAINERS:'
    docker ps -a
    
    echo -e '\n2. ÚLTIMOS LOGS DO APP (ERROS):'
    docker logs lx-app --tail 20

    echo -e '\n3. USO DE MEMÓRIA:'
    free -h
"
echo "==================================================="
echo "Fim do Diagnóstico."
