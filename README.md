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

## Login com Google

O login com Google funciona 100% no cliente, via **Google Identity Services**
(sem backend). Para habilitá-lo:

1. Crie um **ID do cliente OAuth 2.0** no
   [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   (tipo "Aplicativo da Web").
2. Em **Origens JavaScript autorizadas**, inclua as URLs onde o app roda
   (ex.: `http://localhost:8080` em desenvolvimento e o domínio de produção).
3. Copie `.env.example` para `.env` e preencha `VITE_GOOGLE_CLIENT_ID` com o
   Client ID gerado.
4. Reinicie o `npm run dev`.

A sessão do usuário é mantida no `localStorage` e as rotas internas
(`/dashboard`, `/conta`, etc.) ficam protegidas — quem não está autenticado
é redirecionado para `/auth`.

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
