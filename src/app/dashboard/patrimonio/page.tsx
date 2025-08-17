"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Building2,
  DollarSign,
  Calendar,
  Package,
  Eye
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { StatusItem } from "@/types"

// Dados mockados para demonstração
const patrimoniosMock = [
  {
    id: 1,
    nome: "Projetor Epson EB-X41",
    descricao: "Projetor multimídia para apresentações",
    escola: "Escola Municipal São José",
    categoria: "Equipamentos de Informática",
    dataAquisicao: new Date("2023-03-15"),
    valorAquisicao: 2500.00,
    valorAtual: 1875.00,
    status: "ativo" as StatusItem,
    codigo: "PAT-001",
    localizacao: "Sala 101",
    responsavel: "Prof. João Silva"
  },
  {
    id: 2,
    nome: "Computadores Dell OptiPlex 7090",
    descricao: "Computadores para laboratório de informática",
    escola: "Escola Estadual João Silva",
    categoria: "Equipamentos de Informática",
    dataAquisicao: new Date("2022-08-20"),
    valorAquisicao: 45000.00,
    valorAtual: 31500.00,
    status: "ativo" as StatusItem,
    codigo: "PAT-002",
    localizacao: "Laboratório 2",
    responsavel: "Prof. Maria Santos"
  },
  {
    id: 3,
    nome: "Móveis para Sala de Professores",
    descricao: "Conjunto de móveis para sala dos professores",
    escola: "Escola Municipal São José",
    categoria: "Móveis e Utensílios",
    dataAquisicao: new Date("2021-12-10"),
    valorAquisicao: 8500.00,
    valorAtual: 5950.00,
    status: "ativo" as StatusItem,
    codigo: "PAT-003",
    localizacao: "Sala dos Professores",
    responsavel: "Coord. Pedagógica"
  },
  {
    id: 4,
    nome: "Veículo Fiat Fiorino",
    descricao: "Van para transporte escolar",
    escola: "Escola Técnica XYZ",
    categoria: "Veículos",
    dataAquisicao: new Date("2020-06-15"),
    valorAquisicao: 45000.00,
    valorAtual: 22500.00,
    status: "ativo" as StatusItem,
    codigo: "PAT-004",
    localizacao: "Garagem",
    responsavel: "Motorista José Carlos"
  }
]

const categoriasMock = [
  "Equipamentos de Informática",
  "Móveis e Utensílios",
  "Equipamentos de Laboratório",
  "Veículos",
  "Equipamentos de Segurança"
]

const escolasMock = [
  "Escola Municipal São José",
  "Escola Estadual João Silva",
  "Escola Particular ABC",
  "Escola Técnica XYZ"
]

export default function PatrimonioPage() {
  const [patrimonios, setPatrimonios] = useState(patrimoniosMock)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPatrimonio, setEditingPatrimonio] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [filterCategoria, setFilterCategoria] = useState<string>("")
  const [filterEscola, setFilterEscola] = useState<string>("")
  const [activeTab, setActiveTab] = useState("listagem")

  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    escola: "",
    dataAquisicao: "",
    valorAquisicao: "",
    codigo: "",
    localizacao: "",
    responsavel: "",
    status: "ativo" as StatusItem
  })

  // Filtrar patrimônios
  const filteredPatrimonios = patrimonios.filter(patrimonio => {
    const matchesSearch = patrimonio.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patrimonio.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || patrimonio.status === filterStatus
    const matchesCategoria = !filterCategoria || patrimonio.categoria === filterCategoria
    const matchesEscola = !filterEscola || patrimonio.escola === filterEscola

    return matchesSearch && matchesStatus && matchesCategoria && matchesEscola
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.categoria || !formData.escola || !formData.valorAquisicao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    if (editingPatrimonio) {
      // Editar patrimônio existente
      const updatedPatrimonios = patrimonios.map(p =>
        p.id === editingPatrimonio.id
          ? { ...p, ...formData, valorAquisicao: parseFloat(formData.valorAquisicao) }
          : p
      )
      setPatrimonios(updatedPatrimonios)
      toast({
        title: "Sucesso",
        description: "Patrimônio atualizado com sucesso!",
      })
    } else {
      // Criar novo patrimônio
      const newPatrimonio = {
        id: Date.now(),
        ...formData,
        valorAquisicao: parseFloat(formData.valorAquisicao),
        valorAtual: parseFloat(formData.valorAquisicao) * 0.75, // Simulação de depreciação
        dataAquisicao: new Date(formData.dataAquisicao),
        status: formData.status as StatusItem
      }
      setPatrimonios([newPatrimonio, ...patrimonios])
      toast({
        title: "Sucesso",
        description: "Patrimônio criado com sucesso!",
      })
    }

    setIsDialogOpen(false)
    setEditingPatrimonio(null)
    setFormData({
      nome: "",
      descricao: "",
      categoria: "",
      escola: "",
      dataAquisicao: "",
      valorAquisicao: "",
      codigo: "",
      localizacao: "",
      responsavel: "",
      status: "ativo"
    })
  }

  const handleEdit = (patrimonio: any) => {
    setEditingPatrimonio(patrimonio)
    setFormData({
      nome: patrimonio.nome,
      descricao: patrimonio.descricao || "",
      categoria: patrimonio.categoria,
      escola: patrimonio.escola,
      dataAquisicao: patrimonio.dataAquisicao.toISOString().split('T')[0],
      valorAquisicao: patrimonio.valorAquisicao.toString(),
      codigo: patrimonio.codigo || "",
      localizacao: patrimonio.localizacao || "",
      responsavel: patrimonio.responsavel || "",
      status: patrimonio.status
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (patrimonio: any) => {
    if (confirm(`Tem certeza que deseja excluir o patrimônio "${patrimonio.nome}"?`)) {
      const updatedPatrimonios = patrimonios.filter(p => p.id !== patrimonio.id)
      setPatrimonios(updatedPatrimonios)
      toast({
        title: "Patrimônio excluído",
        description: `Patrimônio "${patrimonio.nome}" excluído com sucesso!`,
      })
    }
  }

  const openNewPatrimonioDialog = () => {
    setEditingPatrimonio(null)
    setFormData({
      nome: "",
      descricao: "",
      categoria: "",
      escola: "",
      dataAquisicao: "",
      valorAquisicao: "",
      codigo: "",
      localizacao: "",
      responsavel: "",
      status: "ativo"
    })
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
        <Button onClick={openNewPatrimonioDialog}>
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
                      placeholder="Nome ou código..."
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
                      {categoriasMock.map(categoria => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
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
                      {escolasMock.map(escola => (
                        <SelectItem key={escola} value={escola}>
                          {escola}
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
                        {patrimonio.descricao}
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
                      <span className="text-muted-foreground">Código:</span>
                      <p className="font-medium">{patrimonio.codigo}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Escola:</span>
                      <p className="font-medium truncate">{patrimonio.escola}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Categoria:</span>
                      <p className="font-medium truncate">{patrimonio.categoria}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Localização:</span>
                      <p className="font-medium truncate">{patrimonio.localizacao}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">Valor:</span>
                      <p className="font-medium">{formatCurrency(patrimonio.valorAquisicao)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Atual:</span>
                      <p className="font-medium">{formatCurrency(patrimonio.valorAtual)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">Aquisição:</span>
                      <p className="font-medium">{formatDate(patrimonio.dataAquisicao)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Responsável:</span>
                      <p className="font-medium truncate">{patrimonio.responsavel}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(patrimonio)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(patrimonio)}
                      className="text-red-600 hover:text-red-700 flex-1"
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
                  {formatCurrency(patrimonios.reduce((sum, p) => sum + p.valorAquisicao, 0))}
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
                  {formatCurrency(patrimonios.reduce((sum, p) => sum + p.valorAtual, 0))}
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
                {categoriasMock.map(categoria => {
                  const itens = patrimonios.filter(p => p.categoria === categoria)
                  const valorTotal = itens.reduce((sum, p) => sum + p.valorAquisicao, 0)

                  return (
                    <div key={categoria} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{categoria}</p>
                        <p className="text-sm text-muted-foreground">{itens.length} itens</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(valorTotal)}</p>
                        <p className="text-sm text-muted-foreground">
                          {((itens.length / patrimonios.length) * 100).toFixed(1)}%
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Projetor Epson EB-X41"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  placeholder="Ex: PAT-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasMock.map(categoria => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="escola">Escola *</Label>
                <Select value={formData.escola} onValueChange={(value) => setFormData({ ...formData, escola: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a escola" />
                  </SelectTrigger>
                  <SelectContent>
                    {escolasMock.map(escola => (
                      <SelectItem key={escola} value={escola}>
                        {escola}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataAquisicao">Data de Aquisição *</Label>
                <Input
                  id="dataAquisicao"
                  type="date"
                  value={formData.dataAquisicao}
                  onChange={(e) => setFormData({ ...formData, dataAquisicao: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorAquisicao">Valor de Aquisição (R$) *</Label>
                <Input
                  id="valorAquisicao"
                  type="number"
                  step="0.01"
                  value={formData.valorAquisicao}
                  onChange={(e) => setFormData({ ...formData, valorAquisicao: e.target.value })}
                  placeholder="0,00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="localizacao">Localização</Label>
                <Input
                  id="localizacao"
                  value={formData.localizacao}
                  onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                  placeholder="Ex: Sala 101"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável</Label>
                <Input
                  id="responsavel"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                  placeholder="Ex: Prof. João Silva"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as StatusItem })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                    <SelectItem value="obsoleto">Obsoleto</SelectItem>
                    <SelectItem value="vendido">Vendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição detalhada do patrimônio"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingPatrimonio ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
