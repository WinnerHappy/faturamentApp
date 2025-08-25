import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Plus, ArrowLeft, Download } from 'lucide-react'
import { TransactionForm } from '../components/TransactionForm'
import { TransactionList } from '../components/TransactionList'
import { TransactionFilters } from '../components/TransactionFilters'
import { exportTransactions } from '../utils/exportUtils'
import { transactionsService } from '../services/transactions'

export const Transactions = ({ onBack }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [filters, setFilters] = useState({})
  const [isExporting, setIsExporting] = useState(false)

  const handleAddTransaction = () => {
    setEditingTransaction(null)
    setShowForm(true)
  }

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingTransaction(null)
    setRefreshKey(prev => prev + 1) // Força atualização da lista
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingTransaction(null)
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    setRefreshKey(prev => prev + 1) // Força atualização da lista com novos filtros
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      
      // Buscar todas as transações com os filtros aplicados
      const { data, error } = await transactionsService.getTransactions(filters)
      
      if (error) throw error
      
      if (!data || data.length === 0) {
        alert('Nenhuma transação encontrada para exportar')
        return
      }

      exportTransactions(data)
      
    } catch (error) {
      console.error('Erro ao exportar transações:', error)
      alert('Erro ao exportar transações. Tente novamente.')
    } finally {
      setIsExporting(false)
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
                Transações
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {isExporting ? 'Exportando...' : 'Exportar CSV'}
                </span>
              </Button>
              <Button onClick={handleAddTransaction} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Nova Transação</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Filtros */}
          <TransactionFilters onFiltersChange={handleFiltersChange} />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Resumo Rápido */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo Rápido</CardTitle>
                  <CardDescription>
                    Ações e informações importantes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handleAddTransaction}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Receita
                  </Button>
                  <Button 
                    onClick={handleAddTransaction}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Despesa
                  </Button>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Dicas</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Use filtros para encontrar transações específicas</li>
                      <li>• Exporte seus dados em CSV</li>
                      <li>• Adicione descrições detalhadas</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Transações */}
            <div className="lg:col-span-3">
              <TransactionList
                key={refreshKey}
                filters={filters}
                onEdit={handleEditTransaction}
                onRefresh={handleRefresh}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modal do Formulário */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm
            transaction={editingTransaction}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

