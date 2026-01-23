# 🔧 Troubleshooting - Erro de Conexão com Banco de Dados

## Erro: `ETIMEDOUT` ou `Connection terminated due to connection timeout`

### Possíveis Causas e Soluções

#### 1. **Banco Neon Pausado (Mais Comum)**
O Neon pausa bancos gratuitos após 5 minutos de inatividade.

**Solução:**
1. Acesse o [Console do Neon](https://console.neon.tech)
2. Vá até o seu projeto
3. Se o banco estiver pausado, clique em **"Resume"** ou **"Unpause"**
4. Aguarde alguns segundos para o banco inicializar
5. Copie a **nova URL de conexão** (ela pode ter mudado)
6. Atualize o `DATABASE_URL` no arquivo `.env`

#### 2. **URL de Conexão Expirada ou Incorreta**
As URLs do Neon podem expirar ou mudar.

**Solução:**
1. Acesse o [Console do Neon](https://console.neon.tech)
2. Vá em **"Connection Details"** ou **"Connection String"**
3. Copie a URL completa (formato: `postgresql://user:password@host:port/database?sslmode=require`)
4. Atualize o `DATABASE_URL` no arquivo `.env`
5. Reinicie o servidor

#### 3. **Usar URL Direta ao Invés do Pooler**
Se estiver usando o pooler (`-pooler`), tente a URL direta.

**Solução:**
- No console do Neon, procure por **"Direct connection"** ou **"Non-pooling"**
- Use essa URL ao invés da URL com `-pooler`
- A URL direta geralmente não tem `-pooler` no hostname

#### 4. **Problemas de Rede/Firewall**
Seu firewall ou rede pode estar bloqueando a conexão.

**Solução:**
- Verifique se não há firewall bloqueando conexões PostgreSQL (porta 5432)
- Tente de outra rede (ex: hotspot do celular)
- Verifique se seu ISP não está bloqueando conexões SSL

#### 5. **Testar a Conexão**

Execute o script de teste:

```bash
npm run test:db
```

Isso vai mostrar:
- Se a URL está correta
- Se consegue conectar ao host
- Qual é o erro específico

### Verificações Rápidas

1. ✅ **Arquivo `.env` existe?**
   ```bash
   # Verificar se existe
   ls .env
   ```

2. ✅ **DATABASE_URL está configurada?**
   ```bash
   # Verificar (sem mostrar a senha completa)
   cat .env | grep DATABASE_URL
   ```

3. ✅ **Formato da URL está correto?**
   ```
   postgresql://user:password@host:port/database?sslmode=require
   ```

4. ✅ **Banco está ativo no Neon?**
   - Acesse https://console.neon.tech
   - Verifique se o status está "Active" (não "Paused")

### Comandos Úteis

```bash
# Testar conexão
npm run test:db

# Verificar variáveis de ambiente (sem mostrar senhas)
cat .env | grep -E "DATABASE_URL|DB_" | sed 's/password=[^@]*/password=***/'

# Reiniciar servidor após mudar .env
npm run start:dev
```

### Se Nada Funcionar

1. **Criar novo banco no Neon:**
   - Crie um novo projeto no Neon
   - Copie a nova URL de conexão
   - Atualize o `.env`
   - Execute as migrations ou use `DB_SYNC=true` temporariamente

2. **Usar PostgreSQL local:**
   - Instale PostgreSQL localmente
   - Use as variáveis `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
   - Configure `DB_SSL=false` para local

### Contato

Se o problema persistir, verifique:
- Status do Neon: https://status.neon.tech
- Documentação do Neon: https://neon.tech/docs


