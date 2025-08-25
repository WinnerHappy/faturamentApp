import { supabase } from '../lib/supabase'

// Simulação de usuários para desenvolvimento
const MOCK_USERS = [
  { id: 'user-1', email: 'teste@exemplo.com', password: '123456' },
  { id: 'user-2', email: 'admin@exemplo.com', password: 'admin123' },
  { id: 'user-3', email: 'winnerhappydzn@gmail.com', password: 'Assis123' }
]

// Verificar se Supabase está configurado e funcionando
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  // Se as variáveis não existem ou são valores padrão, usar mock
  if (!url || !key || 
      url === 'sua_url_do_supabase' || 
      key === 'sua_chave_anonima_do_supabase' ||
      url.includes('localhost') ||
      url.includes('127.0.0.1')) {
    return false
  }
  
  return true
}

// Forçar modo mock para desenvolvimento
const FORCE_MOCK_MODE = true

export const authService = {
  // Login com email e senha
  async signInWithEmail(email, password) {
    // Forçar modo mock para desenvolvimento
    if (FORCE_MOCK_MODE || !isSupabaseConfigured()) {
      console.log('Usando autenticação mock para desenvolvimento')
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password)
      
      if (mockUser) {
        const userData = {
          user: {
            id: mockUser.id,
            email: mockUser.email,
            email_confirmed_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          }
        }
        
        // Salvar no localStorage para persistir sessão
        localStorage.setItem('mock_user', JSON.stringify(userData.user))
        
        return { data: userData, error: null }
      } else {
        return { data: null, error: { message: 'Credenciais inválidas' } }
      }
    }

    // Se Supabase estiver configurado, tentar usar
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    } catch (err) {
      console.log('Erro ao conectar com Supabase, usando mock:', err)
      
      // Fallback para mock em caso de erro
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password)
      
      if (mockUser) {
        const userData = {
          user: {
            id: mockUser.id,
            email: mockUser.email,
            email_confirmed_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          }
        }
        
        localStorage.setItem('mock_user', JSON.stringify(userData.user))
        return { data: userData, error: null }
      } else {
        return { data: null, error: { message: 'Credenciais inválidas' } }
      }
    }
  },

  // Cadastro com email e senha
  async signUpWithEmail(email, password) {
    if (FORCE_MOCK_MODE || !isSupabaseConfigured()) {
      console.log('Usando cadastro mock para desenvolvimento')
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Verificar se usuário já existe
      const existingUser = MOCK_USERS.find(u => u.email === email)
      if (existingUser) {
        return { data: null, error: { message: 'Usuário já existe' } }
      }
      
      // Simular criação de conta
      const newUser = {
        id: 'user-' + Date.now(),
        email,
        password
      }
      
      MOCK_USERS.push(newUser)
      
      const userData = {
        user: {
          id: newUser.id,
          email: newUser.email,
          email_confirmed_at: null, // Simular que precisa confirmar email
          created_at: new Date().toISOString()
        }
      }
      
      return { data: userData, error: null }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      return { data, error }
    } catch (err) {
      console.log('Erro ao conectar com Supabase, usando mock:', err)
      return this.signUpWithEmail(email, password) // Fallback para mock
    }
  },

  // Login com Google
  async signInWithGoogle() {
    if (FORCE_MOCK_MODE || !isSupabaseConfigured()) {
      console.log('Login com Google não disponível em modo desenvolvimento')
      return { 
        data: null, 
        error: { message: 'Login com Google requer configuração do Supabase' } 
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
      return { data, error }
    } catch (err) {
      console.log('Erro ao fazer login com Google:', err)
      return { 
        data: null, 
        error: { message: 'Erro ao conectar com Google. Verifique a configuração do Supabase.' } 
      }
    }
  },

  // Login com GitLab
  async signInWithGitlab() {
    if (FORCE_MOCK_MODE || !isSupabaseConfigured()) {
      console.log('Login com GitLab não disponível em modo desenvolvimento')
      return { 
        data: null, 
        error: { message: 'Login com GitLab requer configuração do Supabase' } 
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'gitlab',
        options: {
          redirectTo: window.location.origin
        }
      })
      return { data, error }
    } catch (err) {
      console.log('Erro ao fazer login com GitLab:', err)
      return { 
        data: null, 
        error: { message: 'Erro ao conectar com GitLab. Verifique a configuração do Supabase.' } 
      }
    }
  },

  // Logout
  async signOut() {
    if (FORCE_MOCK_MODE || !isSupabaseConfigured()) {
      localStorage.removeItem('mock_user')
      return { error: null }
    }

    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (err) {
      console.log('Erro ao fazer logout:', err)
      localStorage.removeItem('mock_user')
      return { error: null }
    }
  },

  // Obter usuário atual
  async getCurrentUser() {
    if (FORCE_MOCK_MODE || !isSupabaseConfigured()) {
      const mockUser = localStorage.getItem('mock_user')
      if (mockUser) {
        return { user: JSON.parse(mockUser), error: null }
      }
      return { user: null, error: null }
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user, error }
    } catch (err) {
      console.log('Erro ao obter usuário:', err)
      // Fallback para mock
      const mockUser = localStorage.getItem('mock_user')
      if (mockUser) {
        return { user: JSON.parse(mockUser), error: null }
      }
      return { user: null, error: null }
    }
  },

  // Escutar mudanças de autenticação
  onAuthStateChange(callback) {
    if (FORCE_MOCK_MODE || !isSupabaseConfigured()) {
      // Para modo mock, verificar localStorage periodicamente
      const checkMockAuth = () => {
        const mockUser = localStorage.getItem('mock_user')
        callback('SIGNED_IN', mockUser ? JSON.parse(mockUser) : null)
      }
      
      // Verificar imediatamente
      checkMockAuth()
      
      // Retornar função de cleanup vazia
      return { data: { subscription: { unsubscribe: () => {} } } }
    }

    try {
      return supabase.auth.onAuthStateChange(callback)
    } catch (err) {
      console.log('Erro ao escutar mudanças de auth:', err)
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
  },

  // Reset de senha
  async resetPassword(email) {
    if (FORCE_MOCK_MODE || !isSupabaseConfigured()) {
      console.log('Reset de senha não disponível em modo desenvolvimento')
      return { 
        data: null, 
        error: { message: 'Reset de senha requer configuração do Supabase' } 
      }
    }

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      return { data, error }
    } catch (err) {
      console.log('Erro ao resetar senha:', err)
      return { 
        data: null, 
        error: { message: 'Erro ao resetar senha. Verifique a configuração do Supabase.' } 
      }
    }
  }
}

