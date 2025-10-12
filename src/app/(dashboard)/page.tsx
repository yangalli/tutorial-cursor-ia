import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Building2, Package, TrendingUp, Users, FileText, BarChart3, Plus, ArrowUpRight, Activity, Tag } from "lucide-react"
import { getDashboardData } from "@/lib/dashboard"
import { formatCurrency } from "@/lib/utils"

export default async function DashboardPage() {
  // Buscar dados reais do banco de dados
  const { stats, recentActivities, escolasResumo } = await getDashboardData()

  // Configuração de cards de estatísticas
  const statsCards = [
    {
      title: "Total de Patrimônio",
      value: formatCurrency(stats.totalPatrimonio),
      description: `${stats.percentualPatrimonio >= 0 ? '+' : ''}${stats.percentualPatrimonio.toFixed(1)}% em relação ao mês anterior`,
      icon: Building2,
      trend: stats.percentualPatrimonio >= 0 ? "up" : "down",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total de Inventário",
      value: formatCurrency(stats.totalInventario),
      description: `${stats.percentualInventario >= 0 ? '+' : ''}${stats.percentualInventario.toFixed(1)}% em relação ao mês anterior`,
      icon: Package,
      trend: stats.percentualInventario >= 0 ? "up" : "down",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Itens Ativos",
      value: stats.itensAtivos.toString(),
      description: `${stats.percentualItensAtivos.toFixed(1)}% do total de itens`,
      icon: TrendingUp,
      trend: "up",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Usuários Ativos",
      value: stats.usuariosAtivos.toString(),
      description: `${escolasResumo.length} escolas cadastradas`,
      icon: Users,
      trend: "up",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ]

  const quickActions = [
    {
      title: "Novo Patrimônio",
      description: "Cadastrar novo item",
      icon: Building2,
      href: "/dashboard/patrimonio",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Novo Inventário",
      description: "Criar inventário",
      icon: Package,
      href: "/dashboard/inventario",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Gerar Relatório",
      description: "Relatórios personalizados",
      icon: BarChart3,
      href: "/dashboard/relatorios",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Documentos",
      description: "Gerenciar arquivos",
      icon: FileText,
      href: "/dashboard/documentos",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header com gradiente */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 p-8 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-xl text-slate-200">
            Visão geral do sistema de patrimônio e inventário
          </p>
          <div className="mt-6 flex items-center gap-2">
            <div className="flex h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span className="text-sm text-slate-300">Sistema online</span>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent" />
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="group relative overflow-hidden border-0 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="mt-2 flex items-center gap-2">
                <div className={`flex items-center gap-1 text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.description}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Atividades recentes */}
        <div className="lg:col-span-2">
          <Card className="border-0 bg-white shadow-lg">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">Atividades Recentes</CardTitle>
                  <CardDescription className="text-gray-600">
                    Últimas ações realizadas no sistema
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  <Activity className="mr-2 h-4 w-4" />
                  Ver todas
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${activity.type === 'patrimonio' ? 'bg-blue-100' :
                        activity.type === 'inventario' ? 'bg-emerald-100' :
                          activity.type === 'categoria' ? 'bg-purple-100' :
                            'bg-orange-100'
                        }`}>
                        {activity.type === 'patrimonio' && <Building2 className="h-5 w-5 text-blue-600" />}
                        {activity.type === 'inventario' && <Package className="h-5 w-5 text-emerald-600" />}
                        {activity.type === 'categoria' && <Tag className="h-5 w-5 text-purple-600" />}
                        {activity.type === 'relatorio' && <BarChart3 className="h-5 w-5 text-orange-600" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.item}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <span>{activity.escola}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo por escola */}
        <div>
          <Card className="border-0 bg-white shadow-lg">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <CardTitle className="text-xl font-semibold text-gray-900">Resumo por Escola</CardTitle>
              <CardDescription className="text-gray-600">
                Valor total de patrimônio por instituição
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {escolasResumo.length > 0 ? (
                  escolasResumo.map((escola) => (
                    <div key={escola.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {escola.nome}
                          </p>
                          <p className="text-xs text-gray-500">
                            {escola.itens} itens
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">
                            {formatCurrency(escola.valor)}
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${escola.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Nenhuma escola cadastrada ainda</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ações rápidas */}
      <Card className="border-0 bg-white shadow-lg">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <CardTitle className="text-xl font-semibold text-gray-900">Ações Rápidas</CardTitle>
          <CardDescription className="text-gray-600">
            Acesse rapidamente as funcionalidades principais
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="group relative flex flex-col items-center p-6 text-center rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-gray-50 hover:from-white hover:to-gray-100"
              >
                <div className={`mb-4 rounded-xl p-3 ${action.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className={`h-8 w-8 ${action.iconColor}`} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-xs text-gray-600">{action.description}</p>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Plus className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
