# 🔧 Guia de Desenvolvimento - Controle Financeiro

## 🚀 Modo de Desenvolvimento (Mock)

Este aplicativo foi configurado para funcionar **perfeitamente em modo de desenvolvimento** sem necessidade de configurar o Supabase. Ele detecta automaticamente se o Supabase está configurado e usa um sistema mock quando necessário.

## 🔐 Autenticação Mock

### Usuários Pré-configurados:
Para testar a aplicação, use uma das contas abaixo:

1. **Conta de Teste:**
   - Email: `teste@exemplo.com`
   - Senha: `123456`

2. **Conta Admin:**
   - Email: `admin@exemplo.com`
   - Senha: `admin123`

3. **Conta Personalizada:**
   - Email: `winnerhappydzn@gmail.com`
   - Senha: `Assis123`

### Funcionalidades Disponíveis:

✅ **Login com Email/Senha** - Funciona com usuários mock  
❌ **Login com Google** - Requer configuração do Supabase  
❌ **Login com GitLab** - Requer configuração do Supabase  
✅ **Cadastro de Novos Usuários** - Funciona em modo mock  
✅ **Logout** - Funciona normalmente  
✅ **Persistência de Sessão** - Usa localStorage  

## 💰 Transações Mock

### Funcionalidades:
- ✅ Criar receitas e despesas
- ✅ Categorias pré-definidas com UUIDs válidos
- ✅ Armazenamento temporário em memória
- ✅ Simulação de delay de rede
- ✅ Tratamento de erros

### Categorias Disponíveis:

**Receitas:**
- 💰 Salário
- 💻 Freelance
- 📈 Investimentos
- 💵 Outros

**Despesas:**
- 🍽️ Alimentação
- 🚗 Transporte
- 🏠 Moradia
- 🎮 Lazer
- 🏥 Saúde
- 📚 Educação
- 🛍️ Compras
- 📄 Contas

## 🔄 Como Funciona o Sistema Mock

### Detecção Automática:
O sistema verifica se as variáveis de ambiente do Supabase estão configuradas:
```javascript
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  return url && key && url !== 'sua_url_do_supabase' && key !== 'sua_chave_anonima_do_supabase'
}
```

### Fallback Inteligente:
- Se Supabase não estiver configurado → Usa sistema mock
- Se Supabase estiver configurado mas falhar → Fallback para mock
- Se Supabase estiver funcionando → Usa Supabase real

## 🛠️ Configuração para Produção

### 1. Configurar Supabase:
1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o script SQL em `supabase-schema.sql`
3. Configure as variáveis de ambiente:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_real
```

### 2. Configurar Provedores OAuth:
1. **Google OAuth:**
   - Configure no Google Cloud Console
   - Adicione URLs de callback no Supabase

2. **GitLab OAuth:**
   - Configure no GitLab
   - Adicione URLs de callback no Supabase

### 3. Configurar Email:
- Configure SMTP no Supabase para envio de emails de confirmação

## 🧪 Testando a Aplicação

### Desenvolvimento Local:
```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm run dev

# Acessar aplicação
http://localhost:5173
```

### Fluxo de Teste:
1. **Login:** Use uma das contas mock listadas acima
2. **Dashboard:** Visualize o resumo financeiro
3. **Nova Transação:** Crie receitas e despesas
4. **Relatórios:** Visualize gráficos e estatísticas
5. **Logout:** Teste a funcionalidade de sair

## 📝 Logs de Desenvolvimento

O sistema exibe logs informativos no console do navegador:

```
✅ "Usando autenticação mock para desenvolvimento"
✅ "Usando categorias padrão como fallback"
✅ "Usando transações mock para desenvolvimento"
❌ "Login com Google não disponível em modo desenvolvimento"
❌ "Login com GitLab não disponível em modo desenvolvimento"
```

## 🔍 Troubleshooting

### Problema: "Invalid login credentials"
**Solução:** Use uma das contas mock listadas acima

### Problema: "Login com Google/GitLab não funciona"
**Solução:** Normal em modo desenvolvimento. Configure Supabase para produção.

### Problema: "Transações não aparecem"
**Solução:** As transações mock são armazenadas em memória e são perdidas ao recarregar a página.

### Problema: "Erro de UUID"
**Solução:** O sistema mock usa UUIDs válidos automaticamente.

## 🚀 Deploy

### Vercel (Recomendado):
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente do Supabase
3. Deploy automático

### Netlify:
1. Conecte o repositório ao Netlify
2. Configure as variáveis de ambiente
3. Deploy automático

## 📊 Recursos Adicionais

- **Modo Escuro/Claro:** Funciona automaticamente
- **Design Responsivo:** Testado em desktop e mobile
- **Gráficos Interativos:** Usando Recharts
- **Exportação CSV:** Funciona com dados mock
- **Filtros Avançados:** Funciona com dados mock

## 🎯 Próximos Passos

1. **Configurar Supabase** para produção
2. **Testar com dados reais** em ambiente de produção
3. **Configurar provedores OAuth** se necessário
4. **Personalizar categorias** conforme necessidade
5. **Adicionar mais funcionalidades** conforme demanda

---

**Nota:** Este sistema mock foi desenvolvido para facilitar o desenvolvimento e testes. Em produção, recomenda-se usar o Supabase configurado adequadamente para maior segurança e persistência de dados.

