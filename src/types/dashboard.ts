import { StatusItem } from "@prisma/client"

export interface DashboardStats {
  totalPatrimonio: number
  totalInventario: number
  itensAtivos: number
  usuariosAtivos: number
  percentualPatrimonio: number
  percentualInventario: number
  percentualItensAtivos: number
}

export interface RecentActivity {
  id: string
  action: string
  item: string
  escola: string
  time: string
  type: 'patrimonio' | 'inventario' | 'categoria' | 'relatorio'
  createdAt: Date
}

export interface EscolaResumo {
  id: number
  nome: string
  valor: number
  itens: number
  percentage: number
}

export interface DashboardData {
  stats: DashboardStats
  recentActivities: RecentActivity[]
  escolasResumo: EscolaResumo[]
}

