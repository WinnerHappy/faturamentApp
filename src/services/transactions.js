import { supabase } from '../lib/supabase'

// Verificar se Supabase está configurado
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  return url && key && url !== 'sua_url_do_supabase' && key !== 'sua_chave_anonima_do_supabase'
}

// Forçar modo mock para desenvolvimento
const FORCE_MOCK_MODE = true

// Armazenamento local para transações mock
let mockTransactions = []

export const transactionsService = {
  // Criar nova transação
  async createTransaction(transaction) {
    if (FORCE_MOCK_MODE || !isSupabaseConfigured()) {
      console.log('Usando transações mock para desenvolvimento')
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Criar transação mock
      const mockTransaction = {
        id: 'mock-' + Date.now(),
        ...transaction,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        categories: {
          name: 'Categoria Mock',
          icon: '📊'
        }
      }
      
      // Adicionar à lista mock
      mockTransactions.push(mockTransaction)
      
      return { data: mockTransaction, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select('*, categories(*)')
        .single()
      
      return { data, error }
    } catch (err) {
      console.log('Erro ao criar transação (Supabase não configurado), usando mock:', err)
      
      // Fallback para mock
      const mockTransaction = {
        id: 'mock-' + Date.now(),
        ...transaction,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        categories: {
          name: 'Categoria Mock',
          icon: '📊'
        }
      }
      
      mockTransactions.push(mockTransaction)
      return { data: mockTransaction, error: null }
    }
  },

  // Obter todas as transações do usuário
  async getTransactions(filters = {}) {
    let query = supabase
      .from('transactions')
      .select('*, categories(*)')
      .order('date', { ascending: false })

    // Aplicar filtros
    if (filters.startDate) {
      query = query.gte('date', filters.startDate)
    }
    if (filters.endDate) {
      query = query.lte('date', filters.endDate)
    }
    if (filters.type) {
      query = query.eq('type', filters.type)
    }
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId)
    }

    const { data, error } = await query
    return { data, error }
  },

  // Obter transação por ID
  async getTransactionById(id) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, categories(*)')
      .eq('id', id)
      .single()
    
    return { data, error }
  },

  // Atualizar transação
  async updateTransaction(id, updates) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select('*, categories(*)')
      .single()
    
    return { data, error }
  },

  // Deletar transação
  async deleteTransaction(id) {
    const { data, error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
    
    return { data, error }
  },

  // Obter resumo financeiro
  async getFinancialSummary(startDate, endDate) {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, type')
      .gte('date', startDate)
      .lte('date', endDate)

    if (error) return { data: null, error }

    const summary = data.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        acc.totalIncome += parseFloat(transaction.amount)
      } else {
        acc.totalExpenses += parseFloat(transaction.amount)
      }
      return acc
    }, { totalIncome: 0, totalExpenses: 0 })

    summary.balance = summary.totalIncome - summary.totalExpenses

    return { data: summary, error: null }
  },

  // Obter transações por categoria
  async getTransactionsByCategory(startDate, endDate) {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, type, categories(name, icon)')
      .gte('date', startDate)
      .lte('date', endDate)

    if (error) return { data: null, error }

    const categoryData = data.reduce((acc, transaction) => {
      const categoryName = transaction.categories?.name || 'Sem categoria'
      const categoryIcon = transaction.categories?.icon || '📊'
      
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          icon: categoryIcon,
          income: 0,
          expense: 0,
          total: 0
        }
      }

      const amount = parseFloat(transaction.amount)
      if (transaction.type === 'income') {
        acc[categoryName].income += amount
        acc[categoryName].total += amount
      } else {
        acc[categoryName].expense += amount
        acc[categoryName].total -= amount
      }

      return acc
    }, {})

    return { data: Object.values(categoryData), error: null }
  }
}

