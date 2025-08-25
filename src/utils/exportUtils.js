// Função para converter dados para CSV
export const convertToCSV = (data, headers) => {
  if (!data || data.length === 0) {
    return ''
  }

  // Criar cabeçalho
  const csvHeaders = headers.join(',')
  
  // Converter dados para linhas CSV
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header] || ''
      // Escapar aspas duplas e envolver em aspas se necessário
      const stringValue = String(value).replace(/"/g, '""')
      return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
        ? `"${stringValue}"`
        : stringValue
    }).join(',')
  })

  return [csvHeaders, ...csvRows].join('\n')
}

// Função para fazer download do arquivo CSV
export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Função para exportar transações
export const exportTransactions = (transactions) => {
  if (!transactions || transactions.length === 0) {
    throw new Error('Nenhuma transação para exportar')
  }

  // Preparar dados para exportação
  const exportData = transactions.map(transaction => ({
    'Data': new Date(transaction.date).toLocaleDateString('pt-BR'),
    'Tipo': transaction.type === 'income' ? 'Receita' : 'Despesa',
    'Categoria': transaction.categories?.name || 'Sem categoria',
    'Descrição': transaction.description || '',
    'Valor': parseFloat(transaction.amount).toFixed(2).replace('.', ','),
    'Criado em': new Date(transaction.created_at).toLocaleString('pt-BR')
  }))

  const headers = ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor', 'Criado em']
  const csvContent = convertToCSV(exportData, headers)
  
  const now = new Date()
  const timestamp = now.toISOString().split('T')[0]
  const filename = `transacoes_${timestamp}.csv`
  
  downloadCSV(csvContent, filename)
}

// Função para exportar resumo financeiro
export const exportFinancialSummary = (summary, period) => {
  const exportData = [{
    'Período': period,
    'Total de Receitas': parseFloat(summary.totalIncome || 0).toFixed(2).replace('.', ','),
    'Total de Despesas': parseFloat(summary.totalExpenses || 0).toFixed(2).replace('.', ','),
    'Saldo': parseFloat(summary.balance || 0).toFixed(2).replace('.', ','),
    'Gerado em': new Date().toLocaleString('pt-BR')
  }]

  const headers = ['Período', 'Total de Receitas', 'Total de Despesas', 'Saldo', 'Gerado em']
  const csvContent = convertToCSV(exportData, headers)
  
  const now = new Date()
  const timestamp = now.toISOString().split('T')[0]
  const filename = `resumo_financeiro_${timestamp}.csv`
  
  downloadCSV(csvContent, filename)
}

// Função para exportar dados por categoria
export const exportCategoryData = (categoryData, type) => {
  if (!categoryData || categoryData.length === 0) {
    throw new Error('Nenhum dado de categoria para exportar')
  }

  const exportData = categoryData.map(category => ({
    'Categoria': category.name,
    'Receitas': parseFloat(category.income || 0).toFixed(2).replace('.', ','),
    'Despesas': parseFloat(category.expense || 0).toFixed(2).replace('.', ','),
    'Total': parseFloat(category.total || 0).toFixed(2).replace('.', ',')
  }))

  const headers = ['Categoria', 'Receitas', 'Despesas', 'Total']
  const csvContent = convertToCSV(exportData, headers)
  
  const now = new Date()
  const timestamp = now.toISOString().split('T')[0]
  const filename = `categorias_${type}_${timestamp}.csv`
  
  downloadCSV(csvContent, filename)
}

