import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Plus, List } from 'lucide-react'
import { Layout } from '../components/Layout'
import { QuickStats } from '../components/QuickStats'
import { TransactionForm } from '../components/TransactionForm'
import { Transactions } from './Transactions'
import { Reports } from './Reports'
import { IncomeExpenseChart } from '../components/charts/IncomeExpenseChart'
import { CategoryChart } from '../components/charts/CategoryChart'
import { transactionsService } from '../services/transactions'
import { TRANSACTION_TYPES } from '../types'

export const Dashboard = () => {
  const { user } = useAuth()
  const [currentView, setCurrentView] = useState('dashboard')
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  })
  const [recentTransactions, setRecentTransactions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState(TRANSACTION_TYPES.EXPENSE)
  const [loading, setSummaryLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setSummaryLoading(true)
      
      // Carregar resumo do mês atual
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
      
      const [summaryResult, transactionsResult] = await Promise.all([
        transactionsService.getFinancialSummary(startOfMonth, endOfMonth),
        transactionsService.getTransactions({ limit: 5 })
      ])

      if (summaryResult.data) {
        setSummary(summaryResult.data)
      }
      
      if (transactionsResult.data) {
        setRecentTransactions(transactionsResult.data.slice(0, 5))
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setSummaryLoading(false)
    }
  }

  const handleNavigate = (view) => {
    setCurrentView(view)
  }

  const handleAddTransaction = (type = TRANSACTION_TYPES.EXPENSE) => {
    setFormType(type)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    loadDashboardData() // Recarregar dados
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // Renderizar páginas baseado na navegação
  if (currentView === 'transactions') {
    return (
      <Layout 
        title="Transações"
        currentView={currentView}
        onNavigate={handleNavigate}
        onAddTransaction={handleAddTransaction}
      >
        <Transactions onBack={() => setCurrentView('dashboard')} />
      </Layout>
    )
  }

  if (currentView === 'reports') {
    return (
      <Layout 
        title="Relatórios"
        currentView={currentView}
        onNavigate={handleNavigate}
        onAddTransaction={handleAddTransaction}
      >
        <Reports onBack={() => setCurrentView('dashboard')} />
      </Layout>
    )
  }

  return (
    <Layout 
      currentView={currentView}
      onNavigate={handleNavigate}
      onAddTransaction={handleAddTransaction}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Quick Stats */}
        <QuickStats summary={summary} loading={loading} />

        {/* Quick Actions - Mobile Optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              <CardDescription>
                Adicione receitas e despesas rapidamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => handleAddTransaction(TRANSACTION_TYPES.INCOME)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Receita
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => handleAddTransaction(TRANSACTION_TYPES.EXPENSE)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Despesa
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setCurrentView('transactions')}
              >
                <List className="mr-2 h-4 w-4" />
                Ver Todas as Transações
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transações Recentes</CardTitle>
              <CardDescription>
                Suas últimas movimentações financeiras
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <p>Nenhuma transação encontrada</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => handleAddTransaction()}
                  >
                    Adicionar primeira transação
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`p-1 rounded-full text-xs ${
                          transaction.type === TRANSACTION_TYPES.INCOME 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                            : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                        }`}>
                          {transaction.categories?.icon || '💰'}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {transaction.categories?.name || 'Sem categoria'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${
                        transaction.type === TRANSACTION_TYPES.INCOME 
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === TRANSACTION_TYPES.INCOME ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Section - Responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Receitas vs Despesas</CardTitle>
                <CardDescription>
                  Comparativo dos últimos 6 meses
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentView('reports')}
                className="hidden sm:flex"
              >
                Ver Relatórios
              </Button>
            </CardHeader>
            <CardContent>
              <IncomeExpenseChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gastos por Categoria</CardTitle>
              <CardDescription>
                Distribuição das suas despesas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryChart type="expense" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal do Formulário */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Nova Transação</DialogTitle>
          </DialogHeader>
          <TransactionForm
            transaction={{ type: formType }}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

