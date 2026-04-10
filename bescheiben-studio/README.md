# Bescheiben Studio — Carousel Builder

Gerador de carrosséis para Instagram com agentes de IA integrados.
Stack: HTML estático + Vanilla JS + Vercel Serverless Functions.

---

## Estrutura do projeto

```
bescheiben-studio/
├── index.html              ← Entry point
├── assets/
│   ├── css/
│   │   └── styles.css      ← Todos os estilos
│   └── js/
│       ├── state.js        ← Estado global (slides[], currentSlide)
│       ├── builder.js      ← Funções puras de construção de HTML dos slides
│       ├── renderer.js     ← Renderização do DOM (lista, preview, editor)
│       ├── nav.js          ← Navegação e gerenciamento de slides
│       ├── download.js     ← Download PNG via html2canvas
│       ├── agents.js       ← Agentes de IA (Storytelling + Ideias)
│       └── main.js         ← Event listeners e inicialização
├── api/
│   └── chat.js             ← Proxy seguro para a API da Anthropic (Node.js)
├── vercel.json             ← Configuração de rotas do Vercel
├── .env.example            ← Template de variáveis de ambiente
└── README.md
```

---

## Deploy no Vercel

### 1. Instale a Vercel CLI (opcional)
```bash
npm i -g vercel
```

### 2. Faça o deploy
```bash
cd bescheiben-studio
vercel
```

Ou conecte o repositório diretamente em [vercel.com/new](https://vercel.com/new).

### 3. Configure a variável de ambiente

No painel do Vercel:
**Project → Settings → Environment Variables**

| Nome                | Valor                          |
|---------------------|--------------------------------|
| `ANTHROPIC_API_KEY` | `sk-ant-sua-chave-aqui`        |

> A chave **nunca** é exposta no navegador — toda comunicação com a Anthropic passa pelo `/api/chat`.

### 4. Redeploy após configurar a chave
```bash
vercel --prod
```

---

## Desenvolvimento local

```bash
# Instale a CLI do Vercel
npm i -g vercel

# Crie o arquivo de variáveis locais
cp .env.example .env.local
# Edite .env.local com sua chave real

# Inicie o servidor local (suporta serverless functions)
vercel dev
```

Acesse em `http://localhost:3000`.

---

## Funcionalidades

- **Tipos de slide**: Cover, Conteúdo, Quote, CTA
- **Editor visual** com campos de texto em tempo real
- **Download PNG** 1080×1350px (formato Instagram 4:5)
- **Baixar todos** os slides em sequência
- **Agente de Storytelling** — gera narrativa estruturada por slides
- **Gerador de Ideias** — retorna ideias acionáveis de posts B2B
- Navegação por teclado (← →)
