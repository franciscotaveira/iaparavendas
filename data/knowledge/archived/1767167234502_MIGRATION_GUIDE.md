# 🔄 Guia de Migração e Modo Offline - LUMA OS

> **Versão:** 1.0
> **Data:** 17/12/2025
> **Objetivo:** Migrar de outro sistema SEM PERDER NADA e funcionar OFFLINE

---

## 🎯 Por Que Este Sistema É Diferente?

### Problema das Outras Migrações:
❌ **Perdem agenda inteira** → Tem que refazer manualmente
❌ **Datas erradas** → "31/12/25" vira 2125 em vez de 2025
❌ **Histórico perdido** → Faturamento antigo some
❌ **Sistema trava sem internet** → Secretária fica sem trabalhar

### Nossa Solução:
✅ **Importação inteligente** → Entende qualquer formato
✅ **Validação automática** → Detecta e avisa sobre erros
✅ **Histórico preservado** → Mantém tudo do sistema antigo
✅ **Funciona offline** → Internet cai? Sistema continua

---

## 📥 Parte 1: Importar Agenda do Sistema Antigo

### Passo 1: Exportar do Sistema Atual

Na maioria dos sistemas, você consegue exportar para **Excel (.xlsx)** ou **CSV (.csv)**.

**O que você precisa exportar:**
- Nome do cliente
- Telefone (importante!)
- Email (se tiver)
- Data do agendamento
- Horário
- Serviço realizado
- Profissional que atendeu
- Status (agendado, confirmado, cancelado, etc.)
- Valor cobrado

**Exemplo de Excel:**
```
| Nome          | Telefone      | Email           | Data       | Hora  | Serviço        | Profissional | Status     | Valor |
|---------------|---------------|-----------------|------------|-------|----------------|--------------|------------|-------|
| Maria Silva   | 11987654321   | maria@email.com | 15/01/2025 | 14:00 | Escova         | Ana Paula    | Confirmado | 85.00 |
| João Santos   | 11976543210   |                 | 16/01/2025 | 10:30 | Corte          | Carla        | Agendado   | 50.00 |
```

### Passo 2: Preparar Arquivo (Se Necessário)

**Formatos de Data Aceitos Automaticamente:**
- `dd/MM/yyyy` → 15/01/2025 ✅
- `dd-MM-yyyy` → 15-01-2025 ✅
- `dd.MM.yyyy` → 15.01.2025 ✅
- `yyyy-MM-dd` → 2025-01-15 ✅
- `d/M/yyyy` → 5/1/2025 ✅

**O sistema detecta automaticamente!** Não precisa converter.

**Formatos de Telefone Aceitos Automaticamente:**

O sistema **normaliza qualquer formato** de telefone brasileiro:

| Formato Original | Normalizado | Observação |
|-----------------|-------------|------------|
| `+55 11 98765-4321` | `11987654321` | Remove +55 e formatação |
| `5511987654321` | `11987654321` | Remove 55 do país |
| `(11) 98765-4321` | `11987654321` | Remove parênteses e hífen |
| `011 98765-4321` | `11987654321` | Remove zero extra |
| `11 8765-4321` | `11987654321` | **Adiciona 9° dígito** ⚠️ |
| `1198765432` | `11987654321` | **Adiciona 9° dígito** ⚠️ |
| `(11) 3456-7890` | `1134567890` | Telefone fixo (10 dígitos) |

**Avisos Automáticos:**
- ⚠️ Celular sem 9° dígito → Sistema adiciona automaticamente e avisa
- ⚠️ Telefone com +55 → Sistema remove e padroniza
- ⚠️ Telefone sem DDD → Sistema avisa para adicionar manualmente
- ⚠️ Formato inválido → Sistema avisa

**Importante:** Clientes **NÃO duplicam** mais!
- `+5511987654321` e `11987654321` são reconhecidos como o **mesmo cliente**
- Sistema normaliza ANTES de buscar duplicatas

### Passo 3: Importar no LUMA OS

#### 3.1 - Análise Automática

```typescript
// Na página de Importação
import { analyzeImportColumns } from "@/actions/import";

// Upload do arquivo
const result = await analyzeImportColumns(dadosDoArquivo);

// Sistema retorna:
{
  suggestedMapping: {
    clientName: "Nome",          // Detectou que coluna "Nome" é o nome do cliente
    clientPhone: "Telefone",     // Detectou que coluna "Telefone" é o telefone
    date: "Data",                // Detectou que coluna "Data" é a data
    time: "Hora",                // Detectou que coluna "Hora" é o horário
    serviceName: "Serviço",
    professionalName: "Profissional"
  },
  confidence: {
    "Nome": 100,      // 100% de certeza
    "Telefone": 100,
    "Data": 100
  }
}
```

**Sistema reconhece automaticamente:**
- "Nome", "Cliente", "Client", "Paciente" → Nome do cliente
- "Telefone", "Phone", "Celular", "WhatsApp", "Fone" → Telefone
- "Data", "Date", "Dia" → Data
- "Hora", "Time", "Horário" → Horário
- etc.

#### 3.2 - Validação e Correção

```typescript
import { importAgenda } from "@/actions/import";

// Preview (não salva, só valida)
const preview = await importAgenda({
  data: dadosDoArquivo,
  mapping: mapeamento,
  businessId: "uuid-da-empresa",
  dryRun: true  // 👈 Apenas simula
});

// Sistema retorna:
{
  totalRows: 150,
  imported: 145,      // ✅ Seriam importados
  skipped: 5,         // ⚠️ Com problemas
  errors: [
    {
      row: 23,
      error: "Data inválida: '32/13/2025'",  // Dia 32 não existe
      data: {...}
    }
  ],
  warnings: [
    {
      row: 45,
      warning: "Data muito distante no futuro (15/01/2027). Possível erro de formatação.",
      data: {...}
    }
  ]
}
```

**O sistema avisa sobre:**
- Datas inválidas (dia 32, mês 13, etc.)
- Datas muito antigas (> 5 anos) - pode ser erro
- Datas muito futuras (> 2 anos) - pode ser confusão de formato
- Clientes sem telefone/email
- Serviços não encontrados

#### 3.3 - Importação Final

```typescript
// Agora sim, salvar no banco
const resultado = await importAgenda({
  data: dadosDoArquivo,
  mapping: mapeamento,
  businessId: "uuid-da-empresa",
  skipExisting: true,  // 👈 Pular se já existir
  dryRun: false        // 👈 Salvar de verdade
});

// Pronto! ✅
console.log(`${resultado.imported} agendamentos importados!`);
```

### Exemplo Completo de Uso:

```typescript
// 1. Usuario faz upload do Excel
const file = event.target.files[0];
const dados = await parseExcel(file); // Biblioteca xlsx

// 2. Sistema analisa colunas
const analise = await analyzeImportColumns(dados);

// 3. Usuario confirma ou ajusta mapeamento
const mapeamento = analise.suggestedMapping;

// 4. Preview para ver erros
const preview = await importAgenda({
  data: dados,
  mapping: mapeamento,
  businessId: selectedBusiness,
  dryRun: true
});

// 5. Mostrar erros/avisos ao usuario
console.log("Erros:", preview.errors);
console.log("Avisos:", preview.warnings);

// 6. Usuario confirma e importa
if (userConfirmed) {
  const final = await importAgenda({
    data: dados,
    mapping: mapeamento,
    businessId: selectedBusiness,
    skipExisting: true,
    dryRun: false
  });

  alert(`✅ ${final.imported} agendamentos importados!`);
}
```

---

## 💰 Parte 2: Importar Histórico Financeiro

### Para Que Serve?

Manter todo o histórico de faturamento do sistema antigo para:
- Comparar performance mês a mês
- Não perder dados fiscais
- Análise de crescimento
- Relatórios completos

### Como Importar

```typescript
import { importFinancialHistory } from "@/actions/import";

const resultado = await importFinancialHistory({
  data: [
    {
      date: "01/12/2024",
      description: "Serviço de Escova",
      type: "revenue",  // revenue ou expense
      category: "service",
      amount: 85.00,
      paymentMethod: "card",
      clientName: "Maria Silva",
      professionalName: "Ana Paula",
      notes: "Pagamento via cartão"
    },
    // ... mais transações
  ],
  businessId: "uuid-da-empresa",
  dryRun: false
});

console.log(`${resultado.imported} transações importadas!`);
```

**Categorias Aceitas:**
- `service` - Serviços prestados
- `product` - Venda de produtos
- `salary` - Pagamento de salários
- `rent` - Aluguel
- `other` - Outros

---

## 🗑️ Parte 3: Resetar Dados (Recomeçar)

### Quando Usar?

- Terminou de testar e quer começar de verdade
- Importou errado e quer tentar novamente
- Quer limpar tudo e recomeçar do zero

### Como Usar

```typescript
import { resetAllData } from "@/actions/import";

// 1. Gerar código de confirmação
const businessId = "ab12cd34-ef56-gh78-ij90-kl12mn34op56";
const codigo = `RESET_TUDO_${businessId.slice(-8).toUpperCase()}`;
// Resultado: "RESET_TUDO_MN34OP56"

// 2. Resetar
const resultado = await resetAllData({
  businessId: businessId,
  confirmationCode: codigo,  // 👈 Obrigatório para segurança
  keepClients: false,        // Deletar clientes?
  keepProfessionals: true,   // Manter profissionais?
  keepServices: true         // Manter serviços?
});

console.log("Deletado:", resultado.deletedCounts);
// {
//   appointments: 150,
//   orders: 45,
//   transactions: 200,
//   stockMovements: 30,
//   scheduleBlocks: 5,
//   clients: 80  // (se keepClients = false)
// }
```

**⚠️ ATENÇÃO:**
- Sempre deleta: agendamentos, comandas, transações, estoque
- Opcional: clientes, profissionais, serviços
- **IRREVERSÍVEL!** Tenha backup antes

---

## 📱 Parte 4: Modo Offline (Funcionar Sem Internet)

### Como Funciona?

O LUMA OS é um **PWA (Progressive Web App)**. Isso significa que:

1. **Instala como app** no celular/computador
2. **Funciona offline** quando internet cai
3. **Sincroniza automaticamente** quando volta

### Instalação

#### No Celular (Android/iOS):
1. Abrir LUMA OS no Chrome/Safari
2. Clicar no menu (⋮)
3. Selecionar "Adicionar à tela inicial"
4. Pronto! Ícone na home screen

#### No Computador (Chrome/Edge):
1. Abrir LUMA OS
2. Ver ícone de instalação na barra de endereço ⊕
3. Clicar em "Instalar"
4. Pronto! App standalone

### O Que Funciona Offline?

✅ **Visualizar agenda do dia** (dados em cache)
✅ **Ver lista de clientes** (dados em cache)
✅ **Ver comandas abertas** (dados em cache)
✅ **Navegação entre páginas**

❌ **Criar novos agendamentos** (precisa sincronizar depois)
❌ **Abrir novas comandas** (precisa sincronizar depois)
❌ **Ver relatórios atualizados** (precisa conexão)

### Sincronização Automática

Quando a internet **cair**:
1. Sistema salva operações pendentes no IndexedDB local
2. Mostra badge "⚠️ X operações pendentes"
3. Continua funcionando normalmente

Quando a internet **voltar**:
1. Sistema detecta conexão automaticamente
2. Sincroniza todas as operações pendentes
3. Mostra notificação "✅ Sincronizado!"
4. Remove operações da fila

### Monitorar Sincronização

```typescript
import { usePendingOperations } from "@/lib/offline/sync-manager";

function MeuComponente() {
  const { count, sync } = usePendingOperations();

  return (
    <div>
      {count > 0 && (
        <div className="bg-yellow-100 p-2">
          ⚠️ {count} operação(ões) pendente(s) para sincronizar
          <button onClick={sync}>Sincronizar Agora</button>
        </div>
      )}
    </div>
  );
}
```

### Cache Automático

O Service Worker cacheia automaticamente:
- Páginas principais (agenda, clientes, caixa)
- Assets estáticos (CSS, JS, imagens)
- Respostas de API bem-sucedidas

**Estratégia:**
1. **Network First** (3s timeout) - Tenta rede primeiro
2. Se falhar ou demorar → usa cache
3. Se não tiver cache → mostra página offline

---

## 🎓 Casos de Uso Reais

### Caso 1: Migrando do Sistema X

**Problema:**
- 5 anos de agenda no sistema antigo
- 300 clientes cadastrados
- Medo de perder tudo

**Solução:**
```typescript
// 1. Exportar do sistema X como CSV
// 2. Upload no LUMA OS
const preview = await importAgenda({
  data: csvData,
  mapping: autoDetected,
  businessId: "escovaria",
  dryRun: true  // 👈 Testar primeiro
});

// 3. Ver avisos
console.log(preview.warnings);
// [
//   "Linha 45: Data muito antiga (01/01/2020)"
//   "Linha 120: Profissional 'João' não encontrado"
// ]

// 4. Corrigir e importar de verdade
const final = await importAgenda({
  ...params,
  dryRun: false
});

// ✅ 1,243 agendamentos importados!
// ✅ 287 clientes criados automaticamente
// ✅ 0 erros
```

### Caso 2: Internet Caiu no Meio do Expediente

**Problema:**
- Cliente chegou para ser atendido
- Internet do salão caiu
- Precisa registrar atendimento

**Solução:**
```typescript
// Sistema continua funcionando!
// 1. Agenda mostra clientes do dia (cache)
// 2. Secretária marca como "em atendimento"
// 3. Sistema salva na fila (IndexedDB)

// Quando internet voltar:
// 4. Sincronização automática
// 5. Dados enviados ao servidor
// 6. Notificação: "✅ 3 operações sincronizadas"
```

### Caso 3: Resetar Após Testes

**Problema:**
- Testou o sistema por 1 semana
- Criou dados de teste
- Quer começar limpo

**Solução:**
```typescript
// Gerar código
const codigo = "RESET_TUDO_" + businessId.slice(-8).toUpperCase();

// Resetar mantendo cadastros
await resetAllData({
  businessId: "escovaria",
  confirmationCode: codigo,
  keepClients: false,        // Deletar clientes de teste
  keepProfessionals: true,   // Manter profissionais reais
  keepServices: true         // Manter serviços reais
});

// ✅ Agendamentos: 45 deletados
// ✅ Comandas: 12 deletadas
// ✅ Transações: 57 deletadas
// ✅ Clientes: 23 deletados
```

---

## 🔧 Troubleshooting

### Problema: Datas Importando Erradas

**Sintoma:** Data "15/01/25" importa como "15/01/2025" mas deveria ser "15/01/1925"

**Solução:**
O sistema assume que anos com 2 dígitos são do século atual (2000+).
Se precisa de datas antigas, use formato completo: "15/01/1925"

### Problema: Cliente Duplicando por Causa do Telefone

**Sintoma:** Maria Silva aparece 2 vezes na lista de clientes

**Causa Raiz:**
Sistema antigo exportou telefones em formatos diferentes:
```
Linha 10: Maria Silva | +55 11 98765-4321
Linha 45: Maria Silva | 11987654321
Linha 78: Maria Silva | (11) 98765-4321
```

Sistema antigo achava que eram 3 clientes diferentes por causa do formato!

**Solução Automática:**

O LUMA OS **normaliza todos os telefones** antes de verificar duplicatas:

```typescript
// Todos esses formatos viram: 11987654321
+55 11 98765-4321  →  11987654321
5511987654321      →  11987654321
(11) 98765-4321    →  11987654321
011 98765-4321     →  11987654321
11 8765-4321       →  11987654321 (adiciona 9° dígito)
```

**Resultado:**
- ✅ Sistema reconhece como **1 único cliente**
- ✅ Importa apenas 1 vez
- ✅ Use `skipExisting: true` para segurança extra

**Aviso no Preview:**
```
⚠️ Linha 45: Telefone com +55 removido: +55 11 98765-4321 → 11987654321
⚠️ Linha 78: Celular sem 9° dígito adicionado: 11 8765-4321 → 11987654321
```

Você vê TODOS os ajustes antes de importar!

### Problema: Offline Não Funciona

**Sintoma:** Página recarrega e dá erro sem internet

**Solução:**
1. Verificar se Service Worker está registrado:
   - Abrir DevTools → Application → Service Workers
   - Deve aparecer "sw.js" como "activated"

2. Forçar instalação:
   ```typescript
   navigator.serviceWorker.register('/sw.js');
   ```

3. Limpar cache e reinstalar:
   - DevTools → Application → Storage → Clear Site Data

### Problema: Sincronização Travada

**Sintoma:** Badge mostra "5 pendentes" mas não sincroniza

**Solução:**
```typescript
import { syncPendingOperations } from "@/lib/offline/sync-manager";

// Forçar sincronização manual
const result = await syncPendingOperations();
console.log(result);
// { success: 3, failed: 2, errors: [...] }

// Ver erros
result.errors.forEach(e => {
  console.log(`Operação ${e.id}: ${e.error}`);
});
```

---

## 📞 Suporte

**Dúvidas?**
- Documentação: `/MIGRATION_GUIDE.md`
- Exemplos: `/examples/import-examples.ts`
- Issues: GitHub Issues

**Precisa de Ajuda?**
Entre em contato com suporte técnico.
