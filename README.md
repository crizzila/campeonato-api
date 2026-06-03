#  Campeonato de Futebol Amador — API REST

API REST completa para gerenciamento de campeonato de futebol amador. Permite cadastrar times e jogadores, registrar partidas com placar e acompanhar a tabela de classificação calculada automaticamente com pontos, vitórias, empates, derrotas e saldo de gols.

O sistema conta com autenticação via JWT — rotas de leitura são públicas, enquanto criação, edição e exclusão de dados exigem token de acesso.

---

## Tecnologias

| Tecnologia | Descrição |
|------------|-----------|
| Node.js | Runtime JavaScript com ES Modules |
| Express | Framework HTTP |
| Prisma ORM 7 | ORM para acesso ao banco de dados |
| MySQL | Banco de dados relacional |
| bcrypt | Hash de senhas |
| jsonwebtoken | Geração e validação de tokens JWT |
| dotenv | Variáveis de ambiente |
| Nodemon | Reinício automático em desenvolvimento |

---

## Arquitetura

O projeto segue o padrão **MVC** com separação clara de responsabilidades:

campeonato-api/
├── prisma/
│   └── schema.prisma         # Models e definição do banco
├── src/
│   ├── server.js             # Inicialização do servidor Express
│   ├── lib/
│   │   └── prisma.js         # Instância do Prisma Client
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── times.routes.js
│   │   ├── jogadores.routes.js
│   │   └── partidas.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── times.controller.js
│   │   ├── jogadores.controller.js
│   │   └── partidas.controller.js
│   └── middlewares/
│       └── auth.middleware.js
├── .env                      # Variáveis de ambiente (não versionado)
├── .gitignore
├── prisma.config.ts
├── package.json
└── README.md


---

## Como instalar e rodar localmente

### Pré-requisitos

- Node.js instalado
- MySQL rodando na porta 3306 (XAMPP, Workbench, etc)

### Passo a passo

**1. Clone o repositório:**
```bash
git clone https://github.com/crizzila/campeonato-api.git
cd campeonato-api
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Crie o arquivo `.env` na raiz com o seguinte conteúdo:**
```env
DATABASE_URL="mysql://SEU_USUARIO:SUA_SENHA@localhost:3306/campeonato_db"
JWT_SECRET="sua_chave_secreta_aqui"
PORT=3000
```

**4. Crie o banco de dados `campeonato_db` no MySQL utilizando o cliente de sua preferência (phpMyAdmin, MySQL Workbench, DBeaver, etc).**

**5. Gere o Prisma Client e rode as migrations:**
```bash
npx prisma generate
npx prisma migrate dev --name init
```

**6. Inicie o servidor:**
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`.

---

## Endpoints

###  Auth

| Método | Rota | Descrição | Protegida |
|--------|------|-----------|-----------|
| POST | /auth/register | Cadastrar novo usuário | ❌ |
| POST | /auth/login | Login e geração de token JWT | ❌ |

###  Times

| Método | Rota | Descrição | Protegida |
|--------|------|-----------|-----------|
| GET | /times | Listar todos os times | ❌ |
| GET | /times/:id | Buscar time por ID | ❌ |
| POST | /times | Criar novo time | ✅ |
| PUT | /times/:id | Atualizar time | ✅ |
| DELETE | /times/:id | Deletar time | ✅ |

###  Jogadores

| Método | Rota | Descrição | Protegida |
|--------|------|-----------|-----------|
| GET | /jogadores | Listar todos os jogadores | ❌ |
| GET | /jogadores/:id | Buscar jogador por ID | ❌ |
| POST | /jogadores | Criar novo jogador | ✅ |
| PUT | /jogadores/:id | Atualizar jogador | ✅ |
| DELETE | /jogadores/:id | Deletar jogador | ✅ |

###  Partidas

| Método | Rota | Descrição | Protegida |
|--------|------|-----------|-----------|
| GET | /partidas | Listar todas as partidas | ❌ |
| POST | /partidas | Registrar nova partida | ✅ |
| PUT | /partidas/:id | Atualizar placar e status | ✅ |
| GET | /partidas/classificacao | Tabela de classificação calculada | ❌ |

---

## Autenticação

As rotas protegidas exigem token JWT no header de cada requisição:
Authorization: Bearer <token>

O token é obtido no endpoint `/auth/login` e tem validade de **8 horas**.

---

## Regras de negócio

- Um time não pode jogar contra si mesmo
- Não é possível cadastrar dois times com o mesmo nome
- Não é possível cadastrar dois usuários com o mesmo email
- A classificação considera apenas partidas com status `finalizada`
- A tabela é ordenada por pontos, depois vitórias e depois saldo de gols
- Gols não podem ser negativos
- Status válidos para partida: `agendada`, `em_andamento`, `finalizada`

---

## Exemplos de requisição

### POST /auth/register
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

### POST /auth/login
```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

### POST /times
```json
{
  "nome": "Flamengo FC",
  "cidade": "Rio de Janeiro",
  "escudo": "https://link-opcional.com/escudo.png"
}
```

### PUT /times/:id
```json
{
  "nome": "Flamengo FC",
  "cidade": "Rio de Janeiro",
  "escudo": "https://link-atualizado.com/escudo.png"
}
```

### POST /jogadores
```json
{
  "nome": "Gabriel Barbosa",
  "posicao": "Atacante",
  "numero": 9,
  "timeId": 1
}
```

### PUT /jogadores/:id
```json
{
  "nome": "Gabriel Barbosa",
  "posicao": "Meia",
  "numero": 10,
  "timeId": 1
}
```

### POST /partidas
```json
{
  "mandanteId": 1,
  "visitanteId": 2,
  "dataPartida": "2026-06-10T15:00:00.000Z"
}
```

### PUT /partidas/:id
```json
{
  "golsMandante": 3,
  "golsVisitante": 1,
  "status": "finalizada"
}
```

---

## Exemplo de resposta — Classificação

```json
[
  {
    "time": "Flamengo FC",
    "cidade": "Rio de Janeiro",
    "jogos": 1,
    "pontos": 3,
    "vitorias": 1,
    "empates": 0,
    "derrotas": 0,
    "golsPro": 3,
    "golsContra": 1,
    "saldoGols": 2
  },
  {
    "time": "Vasco da Gama",
    "cidade": "Rio de Janeiro",
    "jogos": 1,
    "pontos": 0,
    "vitorias": 0,
    "empates": 0,
    "derrotas": 1,
    "golsPro": 1,
    "golsContra": 3,
    "saldoGols": -2
  }
]
```