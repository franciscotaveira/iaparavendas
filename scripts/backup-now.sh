#!/bin/bash
# Script de Backup Automático
# Senha e Host já configurados

echo "🚀 Iniciando Backup do Supabase..."

# Tenta conexão direta (Padrão para Dump)
docker run --rm -it postgres:15-alpine pg_dump \
  "postgresql://postgres:Ntr*82469356@db.uhbcvasoavdqufrojcbe.supabase.co:5432/postgres" \
  --clean --if-exists --no-owner --no-privileges --schema=public \
  > supabase-backup.sql

if [ $? -eq 0 ]; then
    echo "✅ Backup concluído: supabase-backup.sql"
else
    echo "⚠️  Tentativa 1 falhou. Tentando via Pooler..."
    # Fallback para Pooler
    docker run --rm -it postgres:15-alpine pg_dump \
      "postgresql://postgres.uhbcvasoavdqufrojcbe:Ntr*82469356@aws-0-sa-east-1.pooler.supabase.com:6543/postgres" \
      --clean --if-exists --no-owner --no-privileges --schema=public \
      > supabase-backup.sql
fi
