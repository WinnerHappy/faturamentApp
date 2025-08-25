import { useState, useEffect } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import { transactionsService } from '../../services/transactions'

export const BalanceChart = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChartData()
  }, [])

  const loadChartData = async () => {
    try {
      setLoading(true)
      
      // Gerar dados dos últimos 12 meses
      const chartData = []
      const now = new Date()
      let cumulativeBalance = 0
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0]
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0]
        
        const { data: summary } = await transactionsService.getFinancialSummary(startDate, endDate)
        
        const monthlyBalance = (summary?.totalIncome || 0) - (summary?.totalExpenses || 0)
        cumulativeBalance += monthlyBalance
        
        chartData.push({
          month: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
          saldo: cumulativeBalance,
          receitas: summary?.totalIncome || 0,
          despesas: summary?.totalExpenses || 0,
          saldoMensal: monthlyBalance
        })
      }
      
      setData(chartData)
    } catch (error) {
      console.error('Erro ao carregar dados do gráfico de saldo:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          <p style={{ color: payload[0].color }}>
            Saldo Acumulado: {formatCurrency(data.saldo)}
          </p>
          <p className="text-green-600">
            Receitas: {formatCurrency(data.receitas)}
          </p>
          <p className="text-red-600">
            Despesas: {formatCurrency(data.despesas)}
          </p>
          <p className={data.saldoMensal >= 0 ? 'text-green-600' : 'text-red-600'}>
            Saldo Mensal: {formatCurrency(data.saldoMensal)}
          </p>
        </div>
      )
    }
    return null
  }

  const CustomDot = (props) => {
    const { cx, cy, payload } = props
    const color = payload.saldo >= 0 ? '#10b981' : '#ef4444'
    
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={4} 
        fill={color} 
        stroke="white" 
        strokeWidth={2}
      />
    )
  }

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando gráfico...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="month" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="2 2" />
          <Line 
            type="monotone" 
            dataKey="saldo" 
            stroke="#3b82f6"
            strokeWidth={3}
            dot={<CustomDot />}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

