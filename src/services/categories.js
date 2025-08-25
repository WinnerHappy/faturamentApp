import { supabase } from '../lib/supabase'

export const categoriesService = {
  // Obter todas as categorias (padrão + do usuário)
  async getCategories(type = null) {
    let query = supabase
      .from('categories')
      .select('*')
      .order('name')

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query
    return { data, error }
  },

  // Criar nova categoria personalizada
  async createCategory(category) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        ...category,
        is_default: false
      }])
      .select()
      .single()
    
    return { data, error }
  },

  // Atualizar categoria (apenas categorias do usuário)
  async updateCategory(id, updates) {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .eq('is_default', false)
      .select()
      .single()
    
    return { data, error }
  },

  // Deletar categoria (apenas categorias do usuário)
  async deleteCategory(id) {
    const { data, error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('is_default', false)
    
    return { data, error }
  },

  // Obter categoria por ID
  async getCategoryById(id) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
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

