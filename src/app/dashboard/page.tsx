"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Building2, Package, DollarSign, TrendingUp, Users, FileText, BarChart3 } from "lucide-react"

export default function DashboardPage() {
  // Dados mockados para demonstração
  const stats = [
    {
      title: "Total de Patrimônio",
      value: "R$ 2.450.000",
      description: "+12% em relação ao mês anterior",
      icon: Building2,
      trend: "up",
    },
    {
      title: "Total de Inventário",
      value: "R$ 890.000",
      description: "+8% em relação ao mês anterior",
      icon: Package,
      trend: "up",
    },
    {
      title: "Itens Ativos",
      value: "1.247",
      description: "95% do total de itens",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Usuários Ativos",
      value: "156",
      description: "12 escolas cadastradas",
      icon: Users,
      trend: "up",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      action: "Novo patrimônio cadastrado",
      item: "Projetor Epson EB-X41",
      escola: "Escola Municipal São José",
      time: "2 horas atrás",
    },
    {
      id: 2,
      action: "Inventário atualizado",
      item: "Computadores Dell OptiPlex",
      escola: "Escola Estadual João Silva",
      time: "4 horas atrás",
    },
    {
      id: 3,
      action: "Categoria criada",
      item: "Equipamentos de Laboratório",
      escola: "Sistema",
      time: "1 dia atrás",
    },
    {
      id: 4,
      action: "Relatório gerado",
      item: "Relatório Mensal - Dezembro 2024",
      escola: "Escola Municipal São José",
      time: "2 dias atrás",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Visão geral do sistema de patrimônio e inventário
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Atividades recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.item}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.escola} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumo por escola */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo por Escola</CardTitle>
            <CardDescription>
              Valor total de patrimônio por instituição
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { nome: "Escola Municipal São José", valor: "R$ 450.000", itens: 89 },
                { nome: "Escola Estadual João Silva", valor: "R$ 380.000", itens: 76 },
                { nome: "Escola Particular ABC", valor: "R$ 520.000", itens: 102 },
                { nome: "Escola Técnica XYZ", valor: "R$ 290.000", itens: 58 },
              ].map((escola, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {escola.nome}
                    </p>
                    <p className="text-xs text-gray-500">
                      {escola.itens} itens
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {escola.valor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as funcionalidades principais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col items-center p-4 text-center hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
              <Building2 className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium">Novo Patrimônio</span>
            </div>
            <div className="flex flex-col items-center p-4 text-center hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
              <Package className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium">Novo Inventário</span>
            </div>
            <div className="flex flex-col items-center p-4 text-center hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
              <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium">Gerar Relatório</span>
            </div>
            <div className="flex flex-col items-center p-4 text-center hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
              <FileText className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium">Documentos</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
