import { supabase } from '../lib/supabase'

export const transactionsService = {
  // Criar nova transação
  async createTransaction(transaction) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select('*, categories(*)')
      .single()
    
    return { data, error }
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

