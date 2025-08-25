import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { CalendarIcon, Filter, X } from 'lucide-react'
import { categoriesService } from '../services/categories'
import { TRANSACTION_TYPES } from '../types'

export const TransactionFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
    categoryId: '',
    minAmount: '',
    maxAmount: '',
    ...initialFilters
  })
  
  const [categories, setCategories] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    // Aplicar filtros automaticamente quando mudarem
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    )
    onFiltersChange?.(activeFilters)
  }, [filters, onFiltersChange])

  const loadCategories = async () => {
    try {
      const { data, error } = await categoriesService.getCategories()
      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      console.error('Erro ao carregar categorias:', err)
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      type: '',
      categoryId: '',
      minAmount: '',
      maxAmount: ''
    })
  }

  const setQuickFilter = (period) => {
    const now = new Date()
    let startDate, endDate

    switch (period) {
      case 'today':
        startDate = endDate = now.toISOString().split('T')[0]
        break
      case 'week':
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
        const weekEnd = new Date(now.setDate(weekStart.getDate() + 6))
        startDate = weekStart.toISOString().split('T')[0]
        endDate = weekEnd.toISOString().split('T')[0]
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
        endDate = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0]
        break
      default:
        return
    }

    setFilters(prev => ({
      ...prev,
      startDate,
      endDate
    }))
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Filtros</CardTitle>
            <CardDescription>
              Filtre suas transações por período, categoria e valor
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center space-x-1"
              >
                <X className="h-3 w-3" />
                <span>Limpar</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1"
            >
              <Filter className="h-3 w-3" />
              <span className="hidden sm:inline">
                {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {showFilters && (
        <CardContent className="space-y-4">
          {/* Filtros Rápidos */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Períodos Rápidos</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'today', label: 'Hoje' },
                { key: 'week', label: 'Esta Semana' },
                { key: 'month', label: 'Este Mês' },
                { key: 'year', label: 'Este Ano' }
              ].map((period) => (
                <Button
                  key={period.key}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickFilter(period.key)}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Data Início */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Data Início</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Data Fim */}
            <div className="space-y-2">
              <Label htmlFor="endDate">Data Fim</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  <SelectItem value={TRANSACTION_TYPES.INCOME}>
                    📈 Receitas
                  </SelectItem>
                  <SelectItem value={TRANSACTION_TYPES.EXPENSE}>
                    📉 Despesas
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={filters.categoryId}
                onValueChange={(value) => handleFilterChange('categoryId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Valor Mínimo */}
            <div className="space-y-2">
              <Label htmlFor="minAmount">Valor Mínimo</Label>
              <Input
                id="minAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              />
            </div>

            {/* Valor Máximo */}
            <div className="space-y-2">
              <Label htmlFor="maxAmount">Valor Máximo</Label>
              <Input
                id="maxAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

