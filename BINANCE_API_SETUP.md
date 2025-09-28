# 🤖 Configuração das APIs da Binance - Bot Binance Pro

## ✅ **CONFIGURAÇÃO COMPLETA**

Suas chaves da API Binance foram configuradas com sucesso no sistema! 🎉

### 🔐 **Localização das Chaves**

As chaves estão configuradas no arquivo:
```
📂 src/app/api/binance/route.ts
```

**Chaves configuradas:**
- **API Key**: `rM8UnbEJvGQV52nFD8c5wmQ8UV1655BZHIFXlJRTuAyRJWbZnxpPz1QHK3hEepIa`
- **Secret Key**: `2d3zEbC1Mgu6JGxugzB5A3DRB2YNSorIIhDWsg7iPGcqvmaOrKxXSv6syVgQFE5E`

---

## 🚀 **Como Usar no VS Code**

### **1️⃣ Setup do Projeto**
```bash
# Criar projeto Next.js
npx create-next-app@latest meu-bot-binance --typescript --tailwind --app
cd meu-bot-binance

# Remover arquivos padrão
rm -rf src/app/page.tsx src/app/layout.tsx src/app/globals.css

# Copiar todos os arquivos do Bot Binance Pro
# (Manter estrutura de pastas exata)
```

### **2️⃣ Instalar Dependências**
```bash
# Remover lockfiles antigos se necessário
rm -rf node_modules pnpm-lock.yaml package-lock.json

# Copiar o package.json limpo fornecido
# Depois instalar:
npm install --legacy-peer-deps

# OU se usar pnpm:
pnpm install --no-frozen-lockfile
```

### **3️⃣ Rodar o Projeto**
```bash
npm run dev
# OU
pnpm dev
```

---

## 📊 **Funcionalidades Disponíveis**

### **🔥 Endpoints da API Configurados**

#### **GET Requests:**
- **`/api/binance?action=account`** - Informações da conta
- **`/api/binance?action=balance`** - Saldo atual
- **`/api/binance?action=prices`** - Preços das 6 principais criptos
- **`/api/binance?action=orders`** - Ordens abertas
- **`/api/binance?action=trades&symbol=BTCUSDT&limit=10`** - Histórico

#### **POST Requests:**
```javascript
// Criar ordem
fetch('/api/binance', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'order',
    symbol: 'BTCUSDT',
    side: 'BUY',
    type: 'MARKET',
    quantity: 0.001
  })
})

// Cancelar ordem
fetch('/api/binance', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'cancel',
    orderId: 12345,
    cancelSymbol: 'BTCUSDT'
  })
})
```

---

## 🛠️ **Utilitários Disponíveis**

### **📁 src/lib/binance.ts** - Cliente TypeScript
```typescript
import { binanceAPI } from '@/lib/binance'

// Obter saldo
const balances = await binanceAPI.getBalance()

// Obter preços
const prices = await binanceAPI.getPrices(['BTCUSDT', 'ETHUSDT'])

// Criar ordem
const order = await binanceAPI.createOrder({
  symbol: 'BTCUSDT',
  side: 'BUY',
  quantity: 0.001,
  type: 'MARKET'
})
```

### **📁 src/examples/binance-usage.ts** - Exemplos Práticos
- ✅ **Grid Trading Strategy**
- ✅ **DCA Strategy**
- ✅ **Análise Técnica**
- ✅ **Stop Loss / Take Profit**
- ✅ **Formatação de dados**

---

## 🎯 **Dashboard Atual**

O app já está usando as APIs reais da Binance:

### **📈 Preços em Tempo Real**
- Conecta diretamente com `/api/binance?action=prices`
- Atualização automática a cada 30 segundos
- Fallback para dados simulados se API falhar

### **🤖 Simulação de Trading**
- Usa preços reais da Binance para simular trades
- Configurações de estratégias (Grid, DCA, Scalping, Swing)
- Histórico de operações
- Métricas de profit/loss

---

## 🔒 **Segurança**

### **✅ Boas Práticas Implementadas:**
- **Edge Runtime** para máxima performance
- **HMAC SHA256** para autenticação
- **Timestamp** obrigatório em todas requisições
- **Validação** de parâmetros obrigatórios
- **Error Handling** completo
- **CORS** configurado para APIs crypto

### **🛡️ APIs Permitidas:**
- `api.binance.com` (principal)
- `api.binance.us` (US version)
- `testnet.binance.vision` (testnet)
- `api.coingecko.com` (backup)

---

## 🚨 **Importante**

### **⚠️ Trading Real vs Simulação:**
- O dashboard atual está em **modo simulação** por segurança
- Para ativar trading real, descomente as seções de criação/cancelamento de ordens
- **SEMPRE teste em testnet primeiro**

### **💡 Para Trading Real:**
1. Configure testnet primeiro: `testnet.binance.vision`
2. Teste todas as estratégias
3. Use quantidades pequenas inicialmente
4. Monitore sempre as operações

### **📊 Testnet da Binance:**
- URL: `https://testnet.binance.vision`
- Crie conta de teste em: `https://testnet.binance.org`
- Use chaves de teste antes das reais

---

## 🎉 **Pronto para Usar!**

Seu Bot Binance Pro está **100% configurado** com:
- ✅ APIs reais da Binance
- ✅ Dashboard profissional
- ✅ Estratégias de trading
- ✅ Sistema de segurança
- ✅ Documentação completa

**Link do projeto:** https://app-bot-binance.vercel.app/

**Agora é só copiar para o VS Code e começar a usar!** 🚀

---

**⭐ Dica:** Para desenvolvimento, use sempre o testnet primeiro. Para produção, monitore sempre suas operações e use stop loss!