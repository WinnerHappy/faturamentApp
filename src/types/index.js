// Tipos de transação
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
}

// Categorias padrão
export const DEFAULT_CATEGORIES = {
  INCOME: [
    { id: 'salary', name: 'Salário', icon: '💰' },
    { id: 'freelance', name: 'Freelance', icon: '💻' },
    { id: 'investment', name: 'Investimentos', icon: '📈' },
    { id: 'other_income', name: 'Outros', icon: '💵' }
  ],
  EXPENSE: [
    { id: 'food', name: 'Alimentação', icon: '🍽️' },
    { id: 'transport', name: 'Transporte', icon: '🚗' },
    { id: 'housing', name: 'Moradia', icon: '🏠' },
    { id: 'entertainment', name: 'Lazer', icon: '🎮' },
    { id: 'health', name: 'Saúde', icon: '🏥' },
    { id: 'education', name: 'Educação', icon: '📚' },
    { id: 'shopping', name: 'Compras', icon: '🛍️' },
    { id: 'bills', name: 'Contas', icon: '📄' },
    { id: 'other_expense', name: 'Outros', icon: '💸' }
  ]
}

// Status de autenticação
export const AUTH_STATUS = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated'
}

