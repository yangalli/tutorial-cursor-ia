"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Building2,
  DollarSign,
  Eye,
  Package
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils/utils"
import { StatusItem } from "@prisma/client"
import { PatrimonioForm } from "./patrimonio-form"
import { deletePatrimonio } from "@/lib/actions/patrimonio"
import type { PatrimonioWithRelations } from "@/types/patrimonio"

interface PatrimonioListClientProps {
  initialPatrimonios: PatrimonioWithRelations[]
  categorias: Array<{ id: number; nome: string }>
  escolas: Array<{ id: number; nome: string }>
}

export function PatrimonioListClient({
  initialPatrimonios,
  categorias,
  escolas
}: PatrimonioListClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const [patrimonios, setPatrimonios] = useState(initialPatrimonios)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPatrimonio, setEditingPatrimonio] = useState<PatrimonioWithRelations | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [filterCategoria, setFilterCategoria] = useState<string>("")
  const [filterEscola, setFilterEscola] = useState<string>("")
  const [activeTab, setActiveTab] = useState("listagem")

  // Filtrar patrimônios
  const filteredPatrimonios = patrimonios.filter(patrimonio => {
    const matchesSearch = patrimonio.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || filterStatus === "todos" || patrimonio.status === filterStatus
    const matchesCategoria = !filterCategoria || filterCategoria === "todas" || patrimonio.categoriaPatrimonioId.toString() === filterCategoria
    const matchesEscola = !filterEscola || filterEscola === "todas" || patrimonio.escolaId.toString() === filterEscola

    return matchesSearch && matchesStatus && matchesCategoria && matchesEscola
  })

  const handleSuccess = () => {
    setIsDialogOpen(false)
    setEditingPatrimonio(null)

    // Recarregar dados do servidor
    startTransition(() => {
      router.refresh()
    })
  }

  const handleEdit = (patrimonio: PatrimonioWithRelations) => {
    setEditingPatrimonio(patrimonio)
    setIsDialogOpen(true)
  }

  const handleDelete = async (patrimonio: PatrimonioWithRelations) => {
    if (!confirm(`Tem certeza que deseja excluir o patrimônio "${patrimonio.nome}"?`)) {
      return
    }

    startTransition(async () => {
      try {
        const result = await deletePatrimonio(patrimonio.id)

        if (!result.success) {
          toast({
            title: "Erro",
            description: result.error,
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Patrimônio excluído",
          description: `Patrimônio "${patrimonio.nome}" excluído com sucesso!`,
        })

        // Atualizar lista local e recarregar do servidor
        setPatrimonios(patrimonios.filter(p => p.id !== patrimonio.id))
        router.refresh()
      } catch (error) {
        console.error('Erro ao excluir:', error)
        toast({
          title: "Erro",
          description: "Erro inesperado ao excluir patrimônio. Tente novamente.",
          variant: "destructive",
        })
      }
    })
  }

  const openNewPatrimonioDialog = () => {
    setEditingPatrimonio(null)
    setIsDialogOpen(true)
  }

  const getStatusColor = (status: StatusItem) => {
    switch (status) {
      case "ativo": return "bg-green-100 text-green-800"
      case "inativo": return "bg-gray-100 text-gray-800"
      case "manutencao": return "bg-yellow-100 text-yellow-800"
      case "obsoleto": return "bg-red-100 text-red-800"
      case "vendido": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patrimônio</h1>
          <p className="text-gray-600">
            Gerencie o patrimônio da instituição
          </p>
        </div>
        <Button onClick={openNewPatrimonioDialog} disabled={isPending}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Patrimônio
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="listagem">Listagem</TabsTrigger>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
        </TabsList>

        {/* Listagem */}
        <TabsContent value="listagem" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Nome..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                      <SelectItem value="obsoleto">Obsoleto</SelectItem>
                      <SelectItem value="vendido">Vendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as categorias</SelectItem>
                      {categorias.map(categoria => (
                        <SelectItem key={categoria.id} value={categoria.id.toString()}>
                          {categoria.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Escola</Label>
                  <Select value={filterEscola} onValueChange={setFilterEscola}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as escolas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as escolas</SelectItem>
                      {escolas.map(escola => (
                        <SelectItem key={escola.id} value={escola.id.toString()}>
                          {escola.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de patrimônios */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPatrimonios.map((patrimonio) => (
              <Card key={patrimonio.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{patrimonio.nome}</CardTitle>
                      <CardDescription className="truncate">
                        {patrimonio.descricao || "Sem descrição"}
                      </CardDescription>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patrimonio.status)}`}>
                      {patrimonio.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Escola:</span>
                      <p className="font-medium truncate">{patrimonio.escola.nome}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Categoria:</span>
                      <p className="font-medium truncate">{patrimonio.categoriaPatrimonio.nome}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">Valor:</span>
                      <p className="font-medium">{formatCurrency(Number(patrimonio.valorAquisicaoReais))}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Atual:</span>
                      <p className="font-medium">{formatCurrency(Number(patrimonio.valorAtual || patrimonio.valorAquisicaoReais))}</p>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Aquisição:</span>
                    <p className="font-medium">{formatDate(patrimonio.dataAquisicao)}</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(patrimonio)}
                      className="flex-1"
                      disabled={isPending}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(patrimonio)}
                      className="text-red-600 hover:text-red-700 flex-1"
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPatrimonios.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum patrimônio encontrado</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Resumo */}
        <TabsContent value="resumo" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{patrimonios.length}</div>
                <p className="text-xs text-muted-foreground">
                  Patrimônios cadastrados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(patrimonios.reduce((sum, p) => sum + Number(p.valorAquisicaoReais), 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Valor de aquisição
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Atual</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(patrimonios.reduce((sum, p) => sum + Number(p.valorAtual || p.valorAquisicaoReais), 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Valor depreciado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Itens Ativos</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {patrimonios.filter(p => p.status === "ativo").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Em uso
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Resumo por categoria */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categorias.map(categoria => {
                  const itens = patrimonios.filter(p => p.categoriaPatrimonioId === categoria.id)
                  const valorTotal = itens.reduce((sum, p) => sum + Number(p.valorAquisicaoReais), 0)

                  if (itens.length === 0) return null

                  return (
                    <div key={categoria.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{categoria.nome}</p>
                        <p className="text-sm text-muted-foreground">{itens.length} itens</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(valorTotal)}</p>
                        <p className="text-sm text-muted-foreground">
                          {patrimonios.length > 0 ? ((itens.length / patrimonios.length) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para criar/editar patrimônio */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPatrimonio ? "Editar Patrimônio" : "Novo Patrimônio"}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do patrimônio
            </DialogDescription>
          </DialogHeader>

          <PatrimonioForm
            patrimonio={editingPatrimonio}
            categorias={categorias}
            escolas={escolas}
            onSuccess={handleSuccess}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
