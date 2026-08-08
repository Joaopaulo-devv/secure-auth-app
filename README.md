# Secure Auth App

Aplicação full stack (Node.js/Express + MySQL + React) construída com foco em
autenticação segura — cada decisão técnica abaixo mitiga uma vulnerabilidade
real encontrada em auditorias de segurança web.

## Stack

- **Back-end:** Node.js, Express, MySQL (mysql2), JWT, bcrypt
- **Front-end:** React, React Router

## Checklist de segurança implementado

| Ameaça | Mitigação |
|---|---|
| Senhas em texto puro no banco | Hash com bcrypt (12 rounds) |
| Roubo de token via XSS | JWT em cookie `httpOnly`, nunca em localStorage |
| CSRF | Cookie `sameSite: strict` |
| Brute force / credential stuffing | Rate limiting (5 tentativas / 15min) nas rotas de auth |
| Enumeração de usuários | Mensagens de erro genéricas e idênticas para "usuário não existe" e "senha errada" |
| IDOR (acesso a recurso de outro usuário) | Checagem de `user_id` antes de qualquer update/delete |
| SQL Injection | Queries 100% parametrizadas (prepared statements) |
| CORS aberto | Origin explícito via variável de ambiente, nunca `*` |
| Headers de segurança ausentes | `helmet` (CSP, HSTS, X-Frame-Options, etc.) |
| Sessão longa demais | Access token expira em 15min + refresh token separado |

## Como rodar

### Back-end
```bash
cd backend
cp .env.example .env   # preencha as variáveis
npm install
mysql -u root -p < schema.sql
npm run dev
```

### Front-end
```bash
cd frontend
npm install
npm run dev
```

## Contexto

Este projeto nasceu depois de encontrar, em testes de intrusão reais, falhas
como IDOR, ausência de rate limiting e enumeração de usuários via
comportamento de erro. A ideia aqui foi implementar do zero as defesas
correspondentes a cada uma dessas falhas.
