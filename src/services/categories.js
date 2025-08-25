import { supabase } from '../lib/supabase'

// Categorias padrão como fallback
const DEFAULT_CATEGORIES = [
  // Categorias de receita
  { id: 'income-1', name: 'Salário', icon: '💰', type: 'income', is_default: true },
  { id: 'income-2', name: 'Freelance', icon: '💻', type: 'income', is_default: true },
  { id: 'income-3', name: 'Investimentos', icon: '📈', type: 'income', is_default: true },
  { id: 'income-4', name: 'Outros', icon: '💵', type: 'income', is_default: true },
  
  // Categorias de despesa
  { id: 'expense-1', name: 'Alimentação', icon: '🍽️', type: 'expense', is_default: true },
  { id: 'expense-2', name: 'Transporte', icon: '🚗', type: 'expense', is_default: true },
  { id: 'expense-3', name: 'Moradia', icon: '🏠', type: 'expense', is_default: true },
  { id: 'expense-4', name: 'Lazer', icon: '🎮', type: 'expense', is_default: true },
  { id: 'expense-5', name: 'Saúde', icon: '🏥', type: 'expense', is_default: true },
  { id: 'expense-6', name: 'Educação', icon: '📚', type: 'expense', is_default: true },
  { id: 'expense-7', name: 'Compras', icon: '🛍️', type: 'expense', is_default: true },
  { id: 'expense-8', name: 'Contas', icon: '📄', type: 'expense', is_default: true },
]

export const categoriesService = {
  // Obter todas as categorias (padrão + do usuário)
  async getCategories(type = null) {
    try {
      let query = supabase
        .from('categories')
        .select('*')
        .order('name')

      if (type) {
        query = query.eq('type', type)
      }

      const { data, error } = await query
      
      // Se houver erro ou não houver dados, usar categorias padrão
      if (error || !data || data.length === 0) {
        console.log('Usando categorias padrão como fallback')
        let fallbackCategories = DEFAULT_CATEGORIES
        
        if (type) {
          fallbackCategories = DEFAULT_CATEGORIES.filter(cat => cat.type === type)
        }
        
        return { data: fallbackCategories, error: null }
      }
      
      return { data, error }
    } catch (err) {
      console.log('Erro ao conectar com Supabase, usando categorias padrão:', err)
      let fallbackCategories = DEFAULT_CATEGORIES
      
      if (type) {
        fallbackCategories = DEFAULT_CATEGORIES.filter(cat => cat.type === type)
      }
      
      return { data: fallbackCategories, error: null }
    }
  },

  // Criar nova categoria personalizada
  async createCategory(category) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          ...category,
          is_default: false
        }])
        .select()
        .single()
      
      return { data, error }
    } catch (err) {
      console.log('Erro ao criar categoria (Supabase não configurado):', err)
      return { data: null, error: 'Supabase não configurado' }
    }
  },

  // Atualizar categoria (apenas categorias do usuário)
  async updateCategory(id, updates) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .eq('is_default', false)
        .select()
        .single()
      
      return { data, error }
    } catch (err) {
      console.log('Erro ao atualizar categoria (Supabase não configurado):', err)
      return { data: null, error: 'Supabase não configurado' }
    }
  },

  // Deletar categoria (apenas categorias do usuário)
  async deleteCategory(id) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('is_default', false)
      
      return { data, error }
    } catch (err) {
      console.log('Erro ao deletar categoria (Supabase não configurado):', err)
      return { data: null, error: 'Supabase não configurado' }
    }
  },

  // Obter categoria por ID
  async getCategoryById(id) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()
      
      // Se não encontrar no Supabase, procurar nas categorias padrão
      if (error || !data) {
        const fallbackCategory = DEFAULT_CATEGORIES.find(cat => cat.id === id)
        if (fallbackCategory) {
          return { data: fallbackCategory, error: null }
        }
      }
      
      return { data, error }
    } catch (err) {
      console.log('Erro ao buscar categoria, procurando nas padrão:', err)
      const fallbackCategory = DEFAULT_CATEGORIES.find(cat => cat.id === id)
      if (fallbackCategory) {
        return { data: fallbackCategory, error: null }
      }
      return { data: null, error: 'Categoria não encontrada' }
    }
  },

  // Obter categorias de receita
  async getIncomeCategories() {
    return this.getCategories('income')
  },

  // Obter categorias de despesa
  async getExpenseCategories() {
    return this.getCategories('expense')
  }
}

