# Configuração do Supabase

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta ou faça login
3. Clique em "New Project"
4. Escolha uma organização
5. Preencha os dados do projeto:
   - Nome: "Controle Financeiro"
   - Database Password: (escolha uma senha segura)
   - Region: (escolha a região mais próxima)
6. Clique em "Create new project"

## 2. Configurar Banco de Dados

1. No painel do Supabase, vá para "SQL Editor"
2. Copie e cole o conteúdo do arquivo `supabase-schema.sql`
3. Execute o script clicando em "Run"

## 3. Configurar Autenticação

1. Vá para "Authentication" > "Settings"
2. Em "Site URL", adicione: `http://localhost:5173` (para desenvolvimento)
3. Em "Redirect URLs", adicione: `http://localhost:5173`

### Configurar Provedores OAuth

#### Google:
1. Vá para "Authentication" > "Providers"
2. Habilite "Google"
3. Configure as credenciais do Google OAuth (Google Cloud Console)

#### GitLab:
1. Vá para "Authentication" > "Providers"
2. Habilite "GitLab"
3. Configure as credenciais do GitLab OAuth

## 4. Obter Credenciais

1. Vá para "Settings" > "API"
2. Copie:
   - Project URL
   - anon public key

## 5. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env` na raiz do projeto
2. Adicione as variáveis:

```env
VITE_SUPABASE_URL=sua_project_url_aqui
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

## 6. Testar Conexão

Execute o projeto e verifique se não há erros de conexão com o Supabase.

## Estrutura do Banco de Dados

### Tabelas:

- **categories**: Categorias de receitas e despesas
- **transactions**: Transações financeiras dos usuários

### Políticas de Segurança (RLS):

- Usuários só podem ver/editar seus próprios dados
- Categorias padrão são visíveis para todos
- Transações são privadas por usuário

