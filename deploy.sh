#!/bin/bash
# ============================================
# LX FACTORY OS - Script de Deploy Automático
# ============================================
# Execute este script no servidor para configurar tudo
# Comando: bash deploy.sh
# ============================================

set -e

echo "🚀 LX FACTORY OS - Deploy Iniciando..."
echo "==========================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funções helper
info() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ============================================
# 1. Verificar pré-requisitos
# ============================================
info "Verificando pré-requisitos..."

if ! command -v docker &> /dev/null; then
    warn "Docker não encontrado. Instalando..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    info "Docker instalado! Faça logout e login novamente, depois rode o script de novo."
    exit 0
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    warn "Docker Compose não encontrado. Instalando..."
    sudo apt-get update
    sudo apt-get install -y docker-compose-plugin
fi

info "✅ Docker OK"

# ============================================
# 2. Verificar arquivo .env
# ============================================
if [ ! -f .env ]; then
    warn ".env não encontrado. Copiando template..."
    cp .env.production .env
    warn "⚠️  IMPORTANTE: Edite o arquivo .env com suas credenciais!"
    warn "   Comando: nano .env"
    warn "   Depois rode: bash deploy.sh"
    exit 0
fi

info "✅ .env encontrado"

# ============================================
# 3. Parar containers existentes
# ============================================
info "Parando containers existentes..."
docker compose down 2>/dev/null || true

# ============================================
# 4. Build das imagens
# ============================================
info "Construindo imagens Docker..."
docker compose build --no-cache

# ============================================
# 5. Subir os serviços
# ============================================
info "Subindo serviços..."
docker compose up -d

# ============================================
# 6. Aguardar inicialização
# ============================================
info "Aguardando serviços iniciarem..."
sleep 10

# ============================================
# 7. Verificar status
# ============================================
info "Status dos serviços:"
docker compose ps

# ============================================
# 8. Mostrar URLs de acesso
# ============================================
echo ""
echo "==========================================="
echo -e "${GREEN}🎉 LX FACTORY OS - Deploy Completo!${NC}"
echo "==========================================="
echo ""
echo "📱 App Principal:     http://localhost:3000"
echo "🔧 n8n Automações:    http://localhost:5678"
echo "📞 Evolution API:     http://localhost:8080"
echo ""
echo "🔐 Credenciais n8n:"
echo "   Usuário: admin (ou o que você definiu no .env)"
echo "   Senha:   LxFactory2025! (ou o que você definiu no .env)"
echo ""
echo "📌 Próximos passos:"
echo "   1. Acesse o n8n e configure seus workflows"
echo "   2. Acesse a Evolution API e conecte seu WhatsApp"
echo "   3. Configure o domínio no Caddyfile para SSL"
echo ""
echo "📖 Logs: docker compose logs -f"
echo "🛑 Parar: docker compose down"
echo ""
