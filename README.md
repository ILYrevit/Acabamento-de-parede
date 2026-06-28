# ComparePreço

Comparador de preços de supermercado — veja os melhores preços da sua cidade em um só lugar, registrados por pessoas reais.

## Tecnologias

Este projeto foi desenvolvido com:

- **Vite** - Build tool e dev server
- **TypeScript** - Tipagem estática
- **React** - Biblioteca UI
- **shadcn/ui** - Componentes UI
- **Tailwind CSS** - Estilização
- **React Router** - Roteamento

## Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

## Backend (Supabase)

A autenticação e os dados usam o **Supabase** (Postgres + Auth). O login
suporta **e-mail/senha** e **Google**, ambos gerenciados pelo Supabase.

### 1. Criar o projeto

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **Project Settings → API**, copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`
3. Copie `.env.example` para `.env` e preencha os dois valores.

### 2. Criar as tabelas

No painel do Supabase, abra **SQL Editor** e execute o conteúdo de
`supabase/migrations/0001_profiles.sql` (cria a tabela `profiles`, as
políticas de RLS e o gatilho que cria o perfil automaticamente a cada
novo cadastro).

### 3. Habilitar o login com Google

1. No Supabase: **Authentication → Providers → Google** → habilite e
   informe o **Client ID** e o **Client Secret** do seu OAuth do Google.
2. No [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
   no seu ID do cliente OAuth, adicione em **URIs de redirecionamento
   autorizados** a URL de callback que o Supabase mostra
   (`https://<seu-projeto>.supabase.co/auth/v1/callback`).
3. Em **Authentication → URL Configuration**, defina a **Site URL** e as
   **Redirect URLs** com as URLs onde o app roda (ex.: `http://localhost:8080`
   e o domínio de produção).

A sessão é gerenciada pelo Supabase e as rotas internas (`/dashboard`,
`/conta`, etc.) ficam protegidas — quem não está autenticado é
redirecionado para `/auth`.

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis (cp/ = núcleo ComparePreço)
├── contexts/      # Contextos React (ex.: autenticação)
├── lib/           # Utilitários e integração com o Google
├── pages/         # Páginas da aplicação
├── styles/        # Estilos (cp/)
└── main.tsx       # Ponto de entrada
```

## Desenvolvimento

O servidor de desenvolvimento roda na porta 8080. Acesse `http://localhost:8080` após executar `npm run dev`.

## Licença

Este projeto é privado.
