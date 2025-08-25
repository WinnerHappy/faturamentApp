import { Button } from './ui/button'
import { Home, List, BarChart3, Plus } from 'lucide-react'

export const MobileNavigation = ({ 
  currentView, 
  onNavigate, 
  onAddTransaction 
}) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Início' },
    { id: 'transactions', icon: List, label: 'Transações' },
    { id: 'reports', icon: BarChart3, label: 'Relatórios' }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-50">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`h-full rounded-none flex flex-col items-center justify-center space-y-1 ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          )
        })}
        
        <Button
          className="h-full rounded-none flex flex-col items-center justify-center space-y-1 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={onAddTransaction}
        >
          <Plus className="h-5 w-5" />
          <span className="text-xs">Adicionar</span>
        </Button>
      </div>
    </div>
  )
}

