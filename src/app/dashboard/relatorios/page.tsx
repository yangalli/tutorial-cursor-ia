"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Building2, 
  Package,
  Download,
  Calendar,
  Eye,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

// Dados mockados para demonstração
const dadosMock = {
  patrimonio: {
    total: 156,
    valorTotal: 1250000.00,
    valorAtual: 875000.00,
    porStatus: {
      ativo: 142,
      inativo: 8,
      manutencao: 4,
      obsoleto: 2
    },
    porCategoria: [
      { categoria: "Equipamentos de Informática", quantidade: 45, valor: 450000 },
      { categoria: "Móveis e Utensílios", quantidade: 38, valor: 190000 },
      { categoria: "Equipamentos de Laboratório", quantidade: 32, valor: 320000 },
      { categoria: "Veículos", quantidade: 8, valor: 180000 },
      { categoria: "Equipamentos de Segurança", quantidade: 33, valor: 110000 }
    ],
    porEscola: [
      { escola: "Escola Municipal São José", quantidade: 52, valor: 420000 },
      { escola: "Escola Estadual João Silva", quantidade: 48, valor: 380000 },
      { escola: "Escola Particular ABC", quantidade: 35, valor: 280000 },
      { escola: "Escola Técnica XYZ", quantidade: 21, valor: 170000 }
    ],
    depreciacao: [
      { mes: "Jan", valor: 1250000, depreciado: 1187500 },
      { mes: "Fev", valor: 1250000, depreciado: 1125000 },
      { mes: "Mar", valor: 1250000, depreciado: 1062500 },
      { mes: "Abr", valor: 1250000, depreciado: 1000000 },
      { mes: "Mai", valor: 1250000, depreciado: 937500 },
      { mes: "Jun", valor: 1250000, depreciado: 875000 }
    ]
  },
  inventario: {
    total: 89,
    valorTotal: 45000.00,
    porCategoria: [
      { categoria: "Material de Escritório", quantidade: 25, valor: 8500 },
      { categoria: "Material de Limpeza", quantidade: 18, valor: 3200 },
      { categoria: "Material Escolar", quantidade: 22, valor: 15800 },
      { categoria: "Material de Laboratório", quantidade: 15, valor: 12500 },
      { categoria: "Material de Manutenção", quantidade: 9, valor: 5000 }
    ],
    porEscola: [
      { escola: "Escola Municipal São José", quantidade: 32, valor: 15800 },
      { escola: "Escola Estadual João Silva", quantidade: 28, valor: 14200 },
      { escola: "Escola Particular ABC", quantidade: 20, valor: 10500 },
      { escola: "Escola Técnica XYZ", quantidade: 9, valor: 4500 }
    ],
    estoqueBaixo: 12,
    estoqueCritico: 5
  },
  documentos: {
    total: 234,
    porTipo: {
      patrimonio: 156,
      inventario: 78
    },
    porCategoria: [
      { categoria: "Notas Fiscais", quantidade: 89 },
      { categoria: "Manuais", quantidade: 45 },
      { categoria: "Fotos", quantidade: 67 },
      { categoria: "Contratos", quantidade: 23 },
      { categoria: "Relatórios", quantidade: 10 }
    ],
    tamanhoTotal: 156.7 // MB
  },
  escolas: {
    total: 4,
    usuarios: 156,
    ativos: 142,
    inativos: 14
  }
}

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

export default function RelatoriosPage() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("6meses")
  const [escolaSelecionada, setEscolaSelecionada] = useState("todas")
  const [activeTab, setActiveTab] = useState("overview")
  
  const { toast } = useToast()

  const handleDownloadRelatorio = (tipo: string) => {
    toast({
      title: "Download",
      description: `Iniciando download do relatório de ${tipo}`,
    })
  }

  const calcularVariacao = (atual: number, anterior: number) => {
    if (anterior === 0) return 0
    return ((atual - anterior) / anterior) * 100
  }

  const getVariacaoIcon = (variacao: number) => {
    if (variacao > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    } else if (variacao < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
    return <Target className="h-4 w-4 text-gray-600" />
  }

  const getVariacaoColor = (variacao: number) => {
    if (variacao > 0) return "text-green-600"
    if (variacao < 0) return "text-red-600"
    return "text-gray-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">
            Dashboard analítico e relatórios do sistema
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1mes">Último Mês</SelectItem>
              <SelectItem value="3meses">Últimos 3 Meses</SelectItem>
              <SelectItem value="6meses">Últimos 6 Meses</SelectItem>
              <SelectItem value="1ano">Último Ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={escolaSelecionada} onValueChange={setEscolaSelecionada}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as Escolas</SelectItem>
              <SelectItem value="sao-jose">Escola Municipal São José</SelectItem>
              <SelectItem value="joao-silva">Escola Estadual João Silva</SelectItem>
              <SelectItem value="abc">Escola Particular ABC</SelectItem>
              <SelectItem value="xyz">Escola Técnica XYZ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="patrimonio">Patrimônio</TabsTrigger>
          <TabsTrigger value="inventario">Inventário</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total Patrimônio</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dadosMock.patrimonio.valorTotal)}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {getVariacaoIcon(2.5)}
                  <span className={getVariacaoColor(2.5)}>+2.5% em relação ao mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dadosMock.patrimonio.total + dadosMock.inventario.total}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {getVariacaoIcon(1.2)}
                  <span className={getVariacaoColor(1.2)}>+1.2% em relação ao mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documentos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dadosMock.documentos.total}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {getVariacaoIcon(5.8)}
                  <span className={getVariacaoColor(5.8)}>+5.8% em relação ao mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dadosMock.escolas.ativos}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {getVariacaoIcon(0)}
                  <span className="text-gray-600">Sem alteração</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos e Análises */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Patrimônio por Categoria */}
            <Card>
              <CardHeader>
                <CardTitle>Patrimônio por Categoria</CardTitle>
                <CardDescription>Distribuição do valor por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dadosMock.patrimonio.porCategoria.map((item, index) => {
                    const percentual = (item.valor / dadosMock.patrimonio.valorTotal) * 100
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.categoria}</span>
                          <span className="text-muted-foreground">{formatCurrency(item.valor)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${percentual}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.quantidade} itens • {percentual.toFixed(1)}%
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Patrimônio por Escola */}
            <Card>
              <CardHeader>
                <CardTitle>Patrimônio por Escola</CardTitle>
                <CardDescription>Distribuição do valor por escola</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dadosMock.patrimonio.porEscola.map((item, index) => {
                    const percentual = (item.valor / dadosMock.patrimonio.valorTotal) * 100
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.escola}</span>
                          <span className="text-muted-foreground">{formatCurrency(item.valor)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${percentual}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.quantidade} itens • {percentual.toFixed(1)}%
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status do Patrimônio */}
          <Card>
            <CardHeader>
              <CardTitle>Status do Patrimônio</CardTitle>
              <CardDescription>Distribuição por status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{dadosMock.patrimonio.porStatus.ativo}</div>
                  <div className="text-sm text-muted-foreground">Ativo</div>
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{dadosMock.patrimonio.porStatus.inativo}</div>
                  <div className="text-sm text-muted-foreground">Inativo</div>
                  <Clock className="h-8 w-8 text-gray-600 mx-auto mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{dadosMock.patrimonio.porStatus.manutencao}</div>
                  <div className="text-sm text-muted-foreground">Manutenção</div>
                  <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{dadosMock.patrimonio.porStatus.obsoleto}</div>
                  <div className="text-sm text-muted-foreground">Obsoleto</div>
                  <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Gerar relatórios específicos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadRelatorio("patrimonio")}
                  className="h-auto p-4 flex-col gap-2"
                >
                  <Building2 className="h-6 w-6" />
                  <span>Relatório de Patrimônio</span>
                  <span className="text-xs text-muted-foreground">PDF • Excel</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadRelatorio("inventario")}
                  className="h-auto p-4 flex-col gap-2"
                >
                  <Package className="h-6 w-6" />
                  <span>Relatório de Inventário</span>
                  <span className="text-xs text-muted-foreground">PDF • Excel</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadRelatorio("depreciacao")}
                  className="h-auto p-4 flex-col gap-2"
                >
                  <TrendingDown className="h-6 w-6" />
                  <span>Relatório de Depreciação</span>
                  <span className="text-xs text-muted-foreground">PDF • Excel</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadRelatorio("consolidado")}
                  className="h-auto p-4 flex-col gap-2"
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>Relatório Consolidado</span>
                  <span className="text-xs text-muted-foreground">PDF • Excel</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patrimônio */}
        <TabsContent value="patrimonio" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Depreciação ao Longo do Tempo */}
            <Card>
              <CardHeader>
                <CardTitle>Depreciação ao Longo do Tempo</CardTitle>
                <CardDescription>Valor original vs. valor depreciado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dadosMock.patrimonio.depreciacao.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.mes}</span>
                        <span className="text-muted-foreground">
                          {formatCurrency(item.depreciado)} / {formatCurrency(item.valor)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(item.depreciado / item.valor) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Depreciação: {((item.valor - item.depreciado) / item.valor * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status por Escola */}
            <Card>
              <CardHeader>
                <CardTitle>Status por Escola</CardTitle>
                <CardDescription>Distribuição do patrimônio por escola</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dadosMock.patrimonio.porEscola.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.escola}</p>
                        <p className="text-sm text-muted-foreground">{item.quantidade} itens</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.valor)}</p>
                        <p className="text-sm text-muted-foreground">
                          {((item.valor / dadosMock.patrimonio.valorTotal) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ações */}
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Patrimônio</CardTitle>
              <CardDescription>Gerar relatórios específicos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Button variant="outline" onClick={() => handleDownloadRelatorio("patrimonio-detalhado")}>
                  <Download className="h-4 w-4 mr-2" />
                  Relatório Detalhado
                </Button>
                <Button variant="outline" onClick={() => handleDownloadRelatorio("patrimonio-depreciacao")}>
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Relatório de Depreciação
                </Button>
                <Button variant="outline" onClick={() => handleDownloadRelatorio("patrimonio-escola")}>
                  <Building2 className="h-4 w-4 mr-2" />
                  Por Escola
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventário */}
        <TabsContent value="inventario" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Inventário por Categoria */}
            <Card>
              <CardHeader>
                <CardTitle>Inventário por Categoria</CardTitle>
                <CardDescription>Quantidade e valor por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dadosMock.inventario.porCategoria.map((item, index) => {
                    const percentual = (item.valor / dadosMock.inventario.valorTotal) * 100
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.categoria}</span>
                          <span className="text-muted-foreground">{formatCurrency(item.valor)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${percentual}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.quantidade} itens • {percentual.toFixed(1)}%
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Estoque e Alertas */}
            <Card>
              <CardHeader>
                <CardTitle>Status do Estoque</CardTitle>
                <CardDescription>Alertas e controles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-yellow-900">Estoque Baixo</p>
                        <p className="text-sm text-yellow-700">{dadosMock.inventario.estoqueBaixo} itens</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Ver Detalhes</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-900">Estoque Crítico</p>
                        <p className="text-sm text-red-700">{dadosMock.inventario.estoqueCritico} itens</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Ver Detalhes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ações */}
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Inventário</CardTitle>
              <CardDescription>Gerar relatórios específicos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Button variant="outline" onClick={() => handleDownloadRelatorio("inventario-detalhado")}>
                  <Download className="h-4 w-4 mr-2" />
                  Relatório Detalhado
                </Button>
                <Button variant="outline" onClick={() => handleDownloadRelatorio("inventario-estoque")}>
                  <Package className="h-4 w-4 mr-2" />
                  Controle de Estoque
                </Button>
                <Button variant="outline" onClick={() => handleDownloadRelatorio("inventario-fornecedor")}>
                  <Users className="h-4 w-4 mr-2" />
                  Por Fornecedor
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentos */}
        <TabsContent value="documentos" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Documentos por Tipo */}
            <Card>
              <CardHeader>
                <CardTitle>Documentos por Tipo</CardTitle>
                <CardDescription>Distribuição por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dadosMock.documentos.porCategoria.map((item, index) => {
                    const percentual = (item.quantidade / dadosMock.documentos.total) * 100
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.categoria}</span>
                          <span className="text-muted-foreground">{item.quantidade}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${percentual}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {percentual.toFixed(1)}% do total
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas de Arquivos */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Arquivos</CardTitle>
                <CardDescription>Resumo do armazenamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total de Documentos</span>
                    <span className="text-2xl font-bold">{dadosMock.documentos.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Patrimônio</span>
                    <span className="text-lg font-medium text-blue-600">{dadosMock.documentos.porTipo.patrimonio}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Inventário</span>
                    <span className="text-lg font-medium text-green-600">{dadosMock.documentos.porTipo.inventario}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tamanho Total</span>
                    <span className="text-lg font-medium">{dadosMock.documentos.tamanhoTotal} MB</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ações */}
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Documentos</CardTitle>
              <CardDescription>Gerar relatórios específicos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Button variant="outline" onClick={() => handleDownloadRelatorio("documentos-detalhado")}>
                  <Download className="h-4 w-4 mr-2" />
                  Relatório Detalhado
                </Button>
                <Button variant="outline" onClick={() => handleDownloadRelatorio("documentos-por-tipo")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Por Tipo
                </Button>
                <Button variant="outline" onClick={() => handleDownloadRelatorio("documentos-armazenamento")}>
                  <Package className="h-4 w-4 mr-2" />
                  Armazenamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
