import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/auth'
import { AUTH_STATUS } from '../types'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState(AUTH_STATUS.LOADING)

  useEffect(() => {
    // Verificar usuário atual ao carregar
    const checkUser = async () => {
      try {
        const { user, error } = await authService.getCurrentUser()
        if (error) {
          console.error('Erro ao verificar usuário:', error)
          setStatus(AUTH_STATUS.UNAUTHENTICATED)
        } else {
          setUser(user)
          setStatus(user ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.UNAUTHENTICATED)
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error)
        setStatus(AUTH_STATUS.UNAUTHENTICATED)
      }
    }

    checkUser()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        setStatus(AUTH_STATUS.AUTHENTICATED)
      } else {
        setUser(null)
        setStatus(AUTH_STATUS.UNAUTHENTICATED)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    try {
      const { data, error } = await authService.signInWithEmail(email, password)
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signUp = async (email, password) => {
    try {
      const { data, error } = await authService.signUpWithEmail(email, password)
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await authService.signInWithGoogle()
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signInWithGitlab = async () => {
    try {
      const { data, error } = await authService.signInWithGitlab()
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await authService.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const resetPassword = async (email) => {
    try {
      const { data, error } = await authService.resetPassword(email)
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    status,
    isLoading: status === AUTH_STATUS.LOADING,
    isAuthenticated: status === AUTH_STATUS.AUTHENTICATED,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGitlab,
    signOut,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

