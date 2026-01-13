# Instruções de Deploy no Render

Este guia explica como fazer o deploy do backend no Render usando o Neon Database.

## Pré-requisitos

1. Conta no [Render](https://render.com)
2. Conta no [Neon Database](https://neon.tech)
3. Repositório Git (GitHub, GitLab, etc.)

## Configuração do Neon Database

1. Acesse o [Neon Console](https://console.neon.tech)
2. Crie um novo projeto ou use um existente
3. Copie a string de conexão (Connection String)
   - Formato: `postgresql://user:password@host:port/database?sslmode=require`

## Deploy no Render

### Opção 1: Usando render.yaml (Recomendado)

1. Faça push do código para seu repositório Git
2. Acesse o [Render Dashboard](https://dashboard.render.com)
3. Clique em "New +" > "Blueprint"
4. Conecte seu repositório
5. Render detectará automaticamente o arquivo `render.yaml`

### Opção 2: Deploy Manual

1. Acesse o [Render Dashboard](https://dashboard.render.com)
2. Clique em "New +" > "Web Service"
3. Conecte seu repositório
4. Configure:
   - **Name**: `academia-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: Free (ou escolha outro plano)

## Variáveis de Ambiente no Render

Configure as seguintes variáveis de ambiente no Render:

1. Acesse seu serviço no Render
2. Vá em "Environment"
3. Adicione as seguintes variáveis:

```
DATABASE_URL=postgresql://neondb_owner:npg_tLcdSm3vrqI6@ep-summer-wildflower-ahv484e3-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

```
JWT_SECRET=sua-chave-secreta-aqui
```

```
DB_SYNC=false
```

```
ALLOWED_ORIGINS=https://seu-frontend.onrender.com,http://localhost:5173
```

**Importante**: 
- Substitua `sua-chave-secreta-aqui` por uma chave JWT segura
- Substitua `https://seu-frontend.onrender.com` pela URL do seu frontend
- `DB_SYNC=false` em produção para evitar perda de dados

## Após o Deploy

1. O Render fornecerá uma URL para seu backend (ex: `https://academia-backend.onrender.com`)
2. Teste a API acessando: `https://seu-backend.onrender.com/api`
3. Atualize o frontend para usar a nova URL da API

## Troubleshooting

### Erro de conexão com o banco
- Verifique se a `DATABASE_URL` está correta
- Certifique-se de que o Neon Database está acessível
- Verifique se o SSL está habilitado

### Erro de build
- Verifique se todas as dependências estão no `package.json`
- Certifique-se de que o Node.js está na versão 18 ou superior

### Erro de CORS
- Adicione a URL do frontend em `ALLOWED_ORIGINS`
- Verifique se o frontend está enviando as requisições corretamente

## Comandos Úteis

```bash
# Build local
npm run build

# Teste local em produção
npm run start:prod

# Ver logs no Render
# Acesse o dashboard > seu serviço > Logs
```

