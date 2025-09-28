# 🤖 Bot Binance

Um bot de trading integrado com a **Binance**, desenvolvido em **Next.js/React + TypeScript** e hospedado na [Vercel](https://vercel.com).
O projeto tem como objetivo auxiliar operações automatizadas de trade com uma interface simples e responsiva.

🔗 **Deploy:** [app-bot-binance.vercel.app](https://app-bot-binance.vercel.app/)

---

## 🚀 Tecnologias

* [Next.js](https://nextjs.org/) — Framework React para SSR e SSG
* [TypeScript](https://www.typescriptlang.org/) — Tipagem estática
* [TailwindCSS](https://tailwindcss.com/) — Estilização rápida e moderna
* [Binance API](https://binance-docs.github.io/apidocs/) — Integração para operações de trade
* [Vercel](https://vercel.com/) — Deploy e hospedagem

---

## 📂 Estrutura de Pastas

```bash
src/
 ├─ app/                # Rotas App Router (Next.js 13+)
 ├─ components/         # Componentes reutilizáveis
 │   ├─ response-logger.tsx  # Logger de respostas
 ├─ pages/api/          # Rotas de API (proxy, logger, etc.)
 ├─ styles/             # Estilos globais
 └─ public/             # Arquivos estáticos (JSON, assets, etc.)
```

---

## ⚙️ Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/bot-binance.git
cd bot-binance

# 2. Instale dependências
npm install

# 3. Execute em modo desenvolvimento
npm run dev

# 4. Build para produção
npm run build
npm start
```

---

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```env
BINANCE_API_KEY=suachaveaqui
BINANCE_API_SECRET=suasecretaqui
NEXT_PUBLIC_API_URL=https://api.binance.com
```

> ⚠️ **Nunca exponha suas chaves privadas em repositórios públicos.**

---

## 🛠️ Funcionalidades

* Conexão com API da Binance
* Registro de respostas com `ResponseLogger`
* Painel básico para operações de trade
* Deploy contínuo via Vercel

---

## 📜 Licença

Este projeto está sob a licença MIT.
Sinta-se livre para usar, modificar e distribuir.

---

### 👩‍💻 Desenvolvedora

**Gislaine Cristina** — Full Stack & DevOps Engineer
📧 [gislainelophes@gmail.com](mailto:gislainelophes@gmail.com)



