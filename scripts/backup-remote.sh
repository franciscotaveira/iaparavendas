#!/bin/bash
# ============================================
# Script de Backup do Supabase (Via Docker)
# ============================================

echo "📦 LX FACTORY - Supabase Backup Tool"
echo "========================================"
echo "Este script vai baixar TODOS os dados do seu Supabase para um arquivo local."
echo ""
echo "1. Vá em: Settings > Database > Connection string > URI"
echo "2. Copie a URL."
echo "3. Substitua '[password]' pela sua senha real."
echo ""
read -p "Cole a Connection String (URI) aqui: " DB_URL

if [ -z "$DB_URL" ]; then
    echo "❌ URL vazia. Abortando."
    exit 1
fi

echo ""
echo "⬇️  Baixando dados... (Isso pode levar alguns segundos)"

# Usa um container temporário do Postgres para rodar o pg_dump sem precisar instalar nada no Mac
docker run --rm -it postgres:15-alpine pg_dump "$DB_URL" \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --schema=public > supabase-backup.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCESSO! Arquivo salvo como: supabase-backup.sql"
    echo "🔜 Próximo passo: Copie este arquivo para o servidor novo e use na inicialização."
else
    echo ""
    echo "❌ Erro ao fazer backup. Verifique a senha e a URL."
fi
