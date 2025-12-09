# API Academia - Rotas e como cadastrar (Postman)

Base URL: `http://localhost:3000`

## Fluxo resumido
1) Criar instrutor (admin)  
2) Fazer login do instrutor e pegar o `accessToken` (JWT)  
3) Usar o token para criar e listar alunos (members)

## Variáveis de ambiente (defaults)
`DB_HOST=localhost` `DB_PORT=3306` `DB_USER=root` `DB_PASS=root` `DB_NAME=academia` `DB_SYNC=true` `JWT_SECRET=secret`

## Rotas

### Criar instrutor (admin)
- **POST** `/instructors`
- Body (JSON):
```json
{
  "name": "Fulano",
  "email": "fulano@ex.com",
  "cpf": "12345678900",
  "password": "senhaSegura"
}
```
- Resposta: dados do instrutor (id, name, email, cpf, createdAt)

### Login do instrutor
- **POST** `/auth/login`
- Body:
```json
{
  "id": "INSTRUTOR_ID",
  "password": "senhaSegura"
}
```
- Resposta:
```json
{
  "accessToken": "JWT_AQUI",
  "instructorId": "INSTRUTOR_ID"
}
```
- Salve o `accessToken` e use como Bearer token nas próximas rotas.

### Criar aluno (member) — requer Bearer token
- **POST** `/members`
- Headers: `Authorization: Bearer <accessToken>`
- Body:
```json
{
  "name": "Aluno 1",
  "birthDate": "2000-01-01",
  "phone": "11999999999",
  "email": "aluno1@ex.com",
  "emergencyPhone": "11888888888",
  "emergencyEmail": "socorro@ex.com"
}
```
- Resposta: dados do aluno + instrutor criador.

### Listar alunos — requer Bearer token
- **GET** `/members`
- Headers: `Authorization: Bearer <accessToken>`
- Resposta: lista de alunos (inclui `createdByInstructor`).

### Listar instrutores (aberto)
- **GET** `/instructors`
- Resposta: lista de instrutores (sem senha).

## Passo a passo no Postman
1. Request `POST /instructors` para criar o primeiro admin.
2. Request `POST /auth/login` com `id` retornado e `password`; copie `accessToken`.
3. Configure nas requests de alunos: Authorization > Bearer Token = `{{token}}` (ou cole o token direto).
4. Envie `POST /members` para cadastrar aluno; use `GET /members` para listar.

## Dicas
- `DB_SYNC=true` só em desenvolvimento; em produção use migrations.
- Ajuste credenciais MySQL conforme seu ambiente.

