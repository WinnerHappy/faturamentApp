import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { ArrowLeft, Download, TrendingUp, PieChart, BarChart3 } from 'lucide-react'
import { IncomeExpenseChart } from '../components/charts/IncomeExpenseChart'
import { CategoryChart } from '../components/charts/CategoryChart'
import { BalanceChart } from '../components/charts/BalanceChart'
import { exportFinancialSummary } from '../utils/exportUtils'
import { transactionsService } from '../services/transactions'

export const Reports = ({ onBack }) => {
  const [period, setPeriod] = useState('month')
  const [categoryType, setCategoryType] = useState('expense')

  const handleExportData = async () => {
    try {
      // Implementar diferentes tipos de exportação baseado na aba ativa
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
      
      const { data: summary } = await transactionsService.getFinancialSummary(startOfMonth, endOfMonth)
      
      if (summary) {
        exportFinancialSummary(summary, 'Mês Atual')
      } else {
        alert('Nenhum dado encontrado para exportar')
      }
    } catch (error) {
      console.error('Erro ao exportar dados:', error)
      alert('Erro ao exportar dados. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Relatórios
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Mensal</SelectItem>
                  <SelectItem value="quarter">Trimestral</SelectItem>
                  <SelectItem value="year">Anual</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExportData} className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="income-expense">Receitas vs Despesas</TabsTrigger>
            <TabsTrigger value="categories">Por Categoria</TabsTrigger>
            <TabsTrigger value="balance">Evolução do Saldo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-base">Receitas vs Despesas</CardTitle>
                    <CardDescription>Últimos 6 meses</CardDescription>
                  </div>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <IncomeExpenseChart period={period} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-base">Despesas por Categoria</CardTitle>
                    <CardDescription>Mês atual</CardDescription>
                  </div>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <CategoryChart type="expense" />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-base">Evolução do Saldo</CardTitle>
                    <CardDescription>Últimos 12 meses</CardDescription>
                  </div>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <BalanceChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="income-expense" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Receitas vs Despesas</CardTitle>
                <CardDescription>
                  Comparativo detalhado entre receitas e despesas ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IncomeExpenseChart period={period} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <label className="text-sm font-medium">Tipo:</label>
              <Select value={categoryType} onValueChange={setCategoryType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Despesas</SelectItem>
                  <SelectItem value="income">Receitas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {categoryType === 'expense' ? 'Despesas' : 'Receitas'} por Categoria
                  </CardTitle>
                  <CardDescription>
                    Distribuição das suas {categoryType === 'expense' ? 'despesas' : 'receitas'} por categoria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoryChart type={categoryType} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo por Categoria</CardTitle>
                  <CardDescription>
                    Detalhamento das principais categorias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    Tabela detalhada será implementada em breve
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="balance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução do Saldo</CardTitle>
                <CardDescription>
                  Acompanhe como seu saldo evoluiu ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BalanceChart />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

