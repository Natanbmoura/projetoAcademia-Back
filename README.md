<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Sistema de gestão da academia Forma+ desenvolvido com [NestJS](https://github.com/nestjs/nest) - um framework TypeScript progressivo para construção de aplicações server-side eficientes e escaláveis.

Este projeto oferece uma API REST completa para gerenciamento de academias, incluindo funcionalidades de autenticação, cadastro de instrutores e membros, criação de treinos, exercícios, histórico de treinos e sistema de conquistas.

## Equipe do Bolsa Futuro Digital - Aponti PE - Backend com JS

- Ítalo Braz
- Leticia Gabriella
- Débora Késsia
- Bruna Almeida
- Natan Moura
- Maria Cecilia 

## Tecnologias

- **Framework**: NestJS 11
- **Linguagem**: TypeScript 5.7
- **ORM**: TypeORM 0.3
- **Banco de Dados**: PostgreSQL (com suporte ao Neon Database)
- **Autenticação**: JWT (Passport)
- **Validação**: class-validator, class-transformer
- **Segurança**: bcrypt para hash de senhas
- **Deploy**: Render (configurado)

## Módulos do Sistema

- **Auth**: Autenticação e autorização com JWT
- **Instructors**: Gerenciamento de instrutores
- **Members**: Gerenciamento de membros/alunos
- **Anamneses**: Anamnese dos membros
- **Exercises**: Cadastro e gerenciamento de exercícios
- **Workouts**: Criação e gerenciamento de treinos
- **WorkoutItems**: Itens que compõem os treinos
- **WorkoutHistory**: Histórico de treinos realizados
- **Achievements**: Sistema de conquistas

## Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL (ou use Neon Database em nuvem)
- npm ou yarn

## Configuração do Projeto

### 1. Instalar dependências

```bash
$ npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

#### Opção A: Usando DATABASE_URL (Recomendado - formato Neon)

```env
# Database - Use DATABASE_URL (formato do Neon) ou variáveis individuais
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Ou use variáveis individuais:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASS=password
# DB_NAME=academia
# DB_SSL=true

# Sincronização do banco (use false em produção)
DB_SYNC=true

# JWT Secret - Use uma chave segura
JWT_SECRET=your-secret-key-here

# Porta do servidor
PORT=3000

# CORS - URLs permitidas separadas por vírgula
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

> **⚠️ Importante**: 
> - Em produção, defina `DB_SYNC=false` para evitar perda de dados
> - Altere `JWT_SECRET` para uma chave segura
> - Para desenvolvimento local, use `DB_SYNC=true` para criar tabelas automaticamente

### 3. Criar banco de dados

#### Opção A: Usando Neon Database (Recomendado)

1. Acesse [Neon Console](https://console.neon.tech)
2. Crie um novo projeto
3. Copie a string de conexão (Connection String)
4. Use no `DATABASE_URL` do arquivo `.env`

#### Opção B: PostgreSQL Local

Crie o banco de dados PostgreSQL:

```sql
CREATE DATABASE academia;
```

## Executando o Projeto

```bash
# desenvolvimento
$ npm run start

# modo watch (recompila automaticamente)
$ npm run start:dev

# modo debug
$ npm run start:debug

# produção
$ npm run start:prod
```

A aplicação estará disponível em `http://localhost:3000` (ou na porta definida em `PORT`).

## Scripts Disponíveis

```bash
# Build
$ npm run build

# Formatação de código
$ npm run format

# Linting
$ npm run lint

# Testes unitários
$ npm run test

# Testes em modo watch
$ npm run test:watch

# Cobertura de testes
$ npm run test:cov

# Testes e2e
$ npm run test:e2e

# Seed de instrutor inicial
$ npm run seed:instructor
```

## Estrutura da API

A API utiliza o prefixo global `/api` para todas as rotas.

### Autenticação

- **POST** `/api/auth/login` - Login de instrutor

### Instrutores

- **GET** `/api/instructors` - Listar instrutores
- **POST** `/api/instructors` - Criar instrutor

### Membros

- **GET** `/api/members` - Listar membros (requer autenticação)
- **POST** `/api/members` - Criar membro (requer autenticação)

### Outros Endpoints

Consulte o arquivo `ROUTES.md` para documentação completa de todas as rotas disponíveis.

## Fluxo de Uso

1. Criar um instrutor (admin) via `POST /api/instructors`
2. Fazer login via `POST /api/auth/login` usando `email` e `password`, obter o `accessToken`
3. Usar o token (Bearer) nas requisições protegidas para gerenciar membros, treinos, etc.

> **Dica**: Use o script `npm run seed:instructor` para criar um instrutor padrão rapidamente.

## Estrutura do Projeto

```
projetoAcademia-Back/
├── src/
│   ├── achievements/          # Sistema de conquistas
│   ├── anamneses/             # Anamnese dos membros
│   ├── auth/                  # Autenticação e autorização
│   │   ├── guards/            # Guards JWT
│   │   └── dto/               # DTOs de autenticação
│   ├── exercises/             # Exercícios
│   ├── instructors/           # Instrutores
│   ├── members/               # Membros/Alunos
│   ├── workout-history/       # Histórico de treinos
│   ├── workout-items/         # Itens dos treinos
│   ├── workouts/              # Treinos
│   ├── scripts/               # Scripts utilitários
│   ├── app.module.ts          # Módulo principal
│   └── main.ts                # Arquivo de inicialização
├── test/                      # Testes e2e
├── dist/                      # Build compilado
├── .env                       # Variáveis de ambiente (não versionado)
├── package.json
├── tsconfig.json
└── README.md
```

## Modelo de Dados

### Entidades Principais

- **Instructor**: Instrutores da academia (admin)
  - Campos: id, name, email, cpf, passwordHash, emergencyPhone, theme
  - Relacionamentos: possui muitos Members e Workouts

- **Member**: Membros/Alunos da academia
  - Campos: id, name, birthDate, phone, email, emergencyPhone, emergencyEmail, weight, height, gender, xp, level, currentStreak, theme, notificações
  - Relacionamentos: pertence a um Instructor, possui uma Anamnesis

- **Anamnesis**: Anamnese do membro
  - Campos: mainGoal, experienceLevel, preferredTime, weeklyFrequency, healthProblems, medicalRestrictions, medication, injuries, activityLevel, smokingStatus, sleepHours
  - Relacionamento: 1:1 com Member

- **Exercise**: Exercícios disponíveis
  - Campos: id, name, muscleGroup, description

- **Workout**: Treinos criados
  - Campos: id, name, description, instructorId, memberId
  - Relacionamentos: pertence a um Instructor e um Member, possui muitos WorkoutItems

- **WorkoutItem**: Itens que compõem um treino
  - Campos: id, workoutId, exerciseId, sets, reps, weight, restTime, observations
  - Relacionamentos: pertence a um Workout e um Exercise

- **WorkoutHistory**: Histórico de treinos realizados
  - Campos: id, workoutId, memberId, completedAt, notes
  - Relacionamentos: pertence a um Workout e um Member

- **Achievement**: Conquistas do sistema
  - Campos: id, name, description, icon, xpReward, requirement
  - Relacionamentos: muitos-para-muitos com Members

## Autenticação e Segurança

### JWT (JSON Web Token)

A aplicação utiliza JWT para autenticação. O fluxo é:

1. **Login**: `POST /api/auth/login`
   - Recebe `email` (ou `id`) e `password`
   - Retorna `accessToken`, `instructorId` e dados do `instructor`

2. **Uso do Token**: 
   - Adicione o header: `Authorization: Bearer <accessToken>`
   - O token é válido por um período determinado (configurado no JWT_SECRET)

### Proteção de Rotas

Rotas protegidas utilizam o `JwtAuthGuard` que valida o token JWT. Exemplos:
- Criar/Listar membros
- Criar/Listar treinos
- Gerenciar exercícios
- Histórico de treinos

### Hash de Senhas

As senhas são criptografadas usando `bcrypt` antes de serem armazenadas no banco de dados.

## Exemplos de Uso da API

### 1. Criar Instrutor

```bash
POST http://localhost:3000/api/instructors
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@academia.com",
  "cpf": "12345678900",
  "password": "senhaSegura123"
}
```

**Resposta:**
```json
{
  "id": "uuid-do-instrutor",
  "name": "João Silva",
  "email": "joao@academia.com",
  "cpf": "12345678900",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Login

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "joao@academia.com",
  "password": "senhaSegura123"
}
```

**Resposta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "instructorId": "uuid-do-instrutor",
  "instructor": {
    "id": "uuid-do-instrutor",
    "name": "João Silva",
    "email": "joao@academia.com"
  }
}
```

> **Nota**: O login aceita `email` ou `id` do instrutor.

### 3. Criar Membro (requer autenticação)

```bash
POST http://localhost:3000/api/members
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Maria Santos",
  "birthDate": "1995-05-15",
  "phone": "11999999999",
  "email": "maria@email.com",
  "emergencyPhone": "11888888888",
  "emergencyEmail": "emergencia@email.com"
}
```

### 4. Listar Membros (requer autenticação)

```bash
GET http://localhost:3000/api/members
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Configurações Adicionais

### CORS

A aplicação está configurada para aceitar requisições de origens definidas na variável de ambiente `ALLOWED_ORIGINS`.

**Desenvolvimento local:**
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:5174
```

**Produção:**
```env
ALLOWED_ORIGINS=https://seu-frontend.firebaseapp.com,https://seu-frontend.web.app,http://localhost:5173
```

As origens devem ser separadas por vírgula, sem espaços. O CORS é configurado automaticamente via variável de ambiente.

### Validação

A aplicação utiliza `class-validator` para validação automática de DTOs. O `ValidationPipe` global está configurado com:
- `whitelist: true` - Remove propriedades não definidas no DTO
- `forbidNonWhitelisted: true` - Retorna erro se propriedades extras forem enviadas
- `transform: true` - Transforma automaticamente os tipos

## Seed de Dados

Para criar um instrutor inicial, utilize o script:

```bash
$ npm run seed:instructor
```

Este script cria um instrutor padrão no banco de dados.

## Testes

```bash
# testes unitários
$ npm run test

# testes em modo watch
$ npm run test:watch

# testes e2e
$ npm run test:e2e

# cobertura de testes
$ npm run test:cov
```

## Build para Produção

```bash
# Compilar o projeto
$ npm run build

# Executar em produção
$ npm run start:prod
```

O build será gerado na pasta `dist/`.

## Deploy em Produção

### Render (Configurado)

O projeto está configurado para deploy no Render. Consulte os guias:

- **Deploy no Render**: Veja instruções em `CRIAR_TABELAS.md` e `CRIAR_PROFESSOR.md`
- **Configuração**: O arquivo `render.yaml` está pronto para uso

### Variáveis de Ambiente no Render

Configure as seguintes variáveis:

```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
JWT_SECRET=sua-chave-secreta-segura
DB_SYNC=false
ALLOWED_ORIGINS=https://seu-frontend.firebaseapp.com,https://seu-frontend.web.app,http://localhost:5173
PORT=10000
```

> **⚠️ IMPORTANTE**: 
> - Use `DB_SYNC=false` em produção
> - Para criar as tabelas pela primeira vez, altere temporariamente para `DB_SYNC=true`, aguarde a criação, e depois volte para `false`

## Troubleshooting

### Erro de conexão com o banco de dados

- Verifique se o PostgreSQL está rodando (ou se o Neon Database está acessível)
- Confirme as credenciais no arquivo `.env` ou `DATABASE_URL`
- Verifique se o banco de dados foi criado
- Para Neon, certifique-se de que o SSL está habilitado (`sslmode=require`)
- Verifique se a string de conexão está completa e correta

### Erro de autenticação

- Verifique se o token JWT está sendo enviado corretamente no header
- Confirme se o `JWT_SECRET` está configurado no `.env`
- Verifique se o token não expirou

### Erro de CORS

- Adicione a URL do frontend na variável `ALLOWED_ORIGINS` (separadas por vírgula)
- Certifique-se de que não há espaços entre as URLs
- Verifique se está usando `https://` para URLs de produção
- Reinicie o servidor após alterar a variável

### Erro de validação

- Verifique se todos os campos obrigatórios estão sendo enviados
- Confirme os tipos de dados (ex: `birthDate` deve ser uma string no formato `YYYY-MM-DD`)

## Documentação Adicional

- **Rotas da API**: Consulte o arquivo [`ROUTES.md`](./ROUTES.md) para documentação completa de todas as rotas
- **Criar Tabelas**: Veja [`CRIAR_TABELAS.md`](./CRIAR_TABELAS.md) para instruções sobre criação de tabelas no Neon
- **Criar Professor**: Veja [`CRIAR_PROFESSOR.md`](./CRIAR_PROFESSOR.md) para criar o instrutor padrão

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto é privado e não possui licença pública.
