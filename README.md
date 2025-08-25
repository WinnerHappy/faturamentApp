# 💰 Controle Financeiro

Um aplicativo web moderno e completo para gerenciamento de finanças pessoais, desenvolvido com React/Next.js e Supabase.

## 🚀 Funcionalidades

### 🔐 Autenticação
- Login e cadastro com email/senha
- Autenticação social (Google, GitLab)
- Sessões seguras com Supabase Auth

### 💳 Gestão Financeira
- Registro de receitas e despesas
- Categorização automática de transações
- Dashboard com resumo financeiro em tempo real
- Histórico completo de lançamentos

### 📊 Visualizações e Relatórios
- Gráficos interativos (Recharts)
- Comparativo receitas vs despesas
- Distribuição por categorias
- Evolução do saldo ao longo do tempo
- Relatórios mensais e anuais

### 🎨 Interface e Experiência
- Design minimalista e intuitivo
- Modo escuro/claro
- Layout totalmente responsivo (desktop/mobile)
- Navegação mobile otimizada
- Micro-interações e animações suaves

### 🔧 Funcionalidades Extras
- Filtros avançados por período, categoria e valor
- Exportação de dados em CSV
- Períodos rápidos (hoje, semana, mês, ano)
- Busca e ordenação de transações

## 🛠️ Tecnologias

### Frontend
- **React 18** - Biblioteca para interfaces de usuário
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/UI** - Componentes de interface elegantes
- **Recharts** - Biblioteca de gráficos para React
- **Lucide React** - Ícones modernos

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security** - Segurança a nível de linha
- **Real-time subscriptions** - Atualizações em tempo real

### Deploy
- **Vercel** - Hospedagem do frontend
- **Supabase Cloud** - Hospedagem do backend

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- pnpm (recomendado) ou npm
- Conta no Supabase

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd controle-financeiro
```

### 2. Instale as dependências
```bash
pnpm install
# ou
npm install
```

### 3. Configure o Supabase

#### 3.1. Crie um projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Anote a URL e a chave anônima do projeto

#### 3.2. Configure o banco de dados
Execute o SQL do arquivo `supabase-schema.sql` no editor SQL do Supabase:

```sql
-- O conteúdo está no arquivo supabase-schema.sql
```

#### 3.3. Configure a autenticação
1. Vá para Authentication > Settings
2. Configure os provedores desejados (Google, GitLab)
3. Adicione as URLs de redirecionamento

### 4. Configure as variáveis de ambiente
Copie o arquivo `.env.example` para `.env` e preencha:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 5. Execute o projeto
```bash
pnpm dev
# ou
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🚀 Deploy

### Deploy no Vercel

1. **Conecte seu repositório**
   - Faça push do código para GitHub/GitLab
   - Conecte o repositório no Vercel

2. **Configure as variáveis de ambiente**
   - Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

3. **Deploy automático**
   - O Vercel fará o deploy automaticamente

### Configuração do Supabase para produção

1. **URLs de redirecionamento**
   - Adicione a URL de produção nas configurações de auth
   - Exemplo: `https://seu-app.vercel.app/auth/callback`

2. **Políticas RLS**
   - Verifique se as políticas de segurança estão ativas
   - Teste o acesso aos dados

## 📁 Estrutura do Projeto

```
controle-financeiro/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── ui/           # Componentes base (shadcn/ui)
│   │   ├── charts/       # Componentes de gráficos
│   │   └── ...
│   ├── contexts/         # Contextos React (Auth, Theme)
│   ├── lib/             # Configurações e utilitários
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # Serviços de API (Supabase)
│   ├── types/           # Definições de tipos
│   ├── utils/           # Funções utilitárias
│   └── App.jsx          # Componente principal
├── supabase-schema.sql   # Schema do banco de dados
├── SUPABASE_SETUP.md    # Guia de configuração do Supabase
└── README.md            # Este arquivo
```

## 🎯 Como Usar

### 1. Primeiro Acesso
1. Acesse a aplicação
2. Crie uma conta ou faça login
3. Complete seu perfil

### 2. Adicionando Transações
1. Use o botão "+" no dashboard ou navegação mobile
2. Selecione o tipo (receita/despesa)
3. Escolha uma categoria
4. Adicione valor e descrição
5. Salve a transação

### 3. Visualizando Relatórios
1. Acesse a aba "Relatórios"
2. Explore os diferentes gráficos
3. Use filtros para análises específicas
4. Exporte dados em CSV quando necessário

### 4. Filtrando Dados
1. Na página de transações, use os filtros
2. Selecione períodos rápidos ou datas customizadas
3. Filtre por categoria ou tipo
4. Defina faixas de valores

## 🔧 Desenvolvimento

### Scripts disponíveis
```bash
pnpm dev          # Servidor de desenvolvimento
pnpm build        # Build para produção
pnpm preview      # Preview do build
pnpm lint         # Verificação de código
```

### Adicionando novas funcionalidades

1. **Novos componentes**: Adicione em `src/components/`
2. **Novas páginas**: Adicione em `src/pages/`
3. **Novos serviços**: Adicione em `src/services/`
4. **Novos tipos**: Defina em `src/types/`

### Padrões de código
- Use TypeScript para tipagem
- Siga as convenções do ESLint
- Componentes em PascalCase
- Arquivos em kebab-case
- Use hooks customizados quando apropriado

## 🐛 Solução de Problemas

### Erro de autenticação
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo
- Verifique as URLs de redirecionamento

### Gráficos não carregam
- Verifique se há dados no banco
- Confirme se as políticas RLS permitem acesso
- Verifique o console para erros

### Layout quebrado
- Limpe o cache do navegador
- Verifique se o Tailwind CSS está carregando
- Confirme se não há conflitos de CSS

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação do Supabase
- Verifique os logs do console

---

Desenvolvido com ❤️ usando React e Supabase

