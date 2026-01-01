#!/bin/bash

# CORES PARA LOG
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

SERVER_IP="158.220.117.15"
REMOTE_DIR="/root/lx-app"

echo -e "${YELLOW}🚀 LX FACTORY - SEQUÊNCIA DE LANÇAMENTO AUTOMÁTICA${NC}"
echo "======================================================="

# 1. SINCRONIZAÇÃO (RSYNC)
echo -e "${YELLOW}[1/3] Sincronizando arquivos com a Nave Mãe ($SERVER_IP)...${NC}"
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' --exclude '.env.local' . root@$SERVER_IP:$REMOTE_DIR

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Sincronização Concluída!${NC}"
else
    echo -e "${RED}❌ Falha na sincronização. Verifique sua conexão.${NC}"
    exit 1
fi

# 2. DISPARO REMOTO
echo -e "${YELLOW}[2/3] Iniciando Deploy Remoto...${NC}"
echo "Conectando ao servidor para construir a infraestrutura..."

ssh -t root@$SERVER_IP "cd $REMOTE_DIR && docker builder prune -a -f && bash deploy.sh"

echo -e "${GREEN}✅ PROCESSO FINALIZADO!${NC}"
echo "Se você viu 'Started' nos logs acima, seu sistema está NO AR."
echo "Acesse: http://$SERVER_IP:3000"
