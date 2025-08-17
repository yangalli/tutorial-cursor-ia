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
  Package,
  DollarSign,
  Calendar,
  Box,
  Eye,
  TrendingUp,
  AlertTriangle
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { StatusItem } from "@/types"

// Dados mockados para demonstração
const inventariosMock = [
  {
    id: 1,
    nome: "Papel A4 500 folhas",
    descricao: "Papel sulfite A4 90g, pacote com 500 folhas",
    escola: "Escola Municipal São José",
    categoria: "Material de Escritório",
    dataAquisicao: new Date("2024-01-15"),
    valorAquisicao: 25.90,
    valorAtual: 25.90,
    status: "ativo" as StatusItem,
    codigo: "INV-001",
    localizacao: "Almoxarifado",
    responsavel: "Secretária Maria",
    quantidade: 50,
    quantidadeMinima: 10,
    fornecedor: "Papelaria Central"
  },
  {
    id: 2,
    nome: "Canetas Bic Azuis",
    descricao: "Canetas esferográficas azuis, caixa com 50 unidades",
    escola: "Escola Estadual João Silva",
    categoria: "Material de Escritório",
    dataAquisicao: new Date("2024-02-01"),
    valorAquisicao: 45.00,
    valorAtual: 45.00,
    status: "ativo" as StatusItem,
    codigo: "INV-002",
    localizacao: "Almoxarifado",
    responsavel: "Secretário Pedro",
    quantidade: 15,
    quantidadeMinima: 20,
    fornecedor: "Distribuidora ABC"
  },
  {
    id: 3,
    nome: "Limpador Multiuso",
    descricao: "Limpador multiuso para limpeza geral, frasco 500ml",
    escola: "Escola Municipal São José",
    categoria: "Material de Limpeza",
    dataAquisicao: new Date("2024-01-20"),
    valorAquisicao: 12.50,
    valorAtual: 12.50,
    status: "ativo" as StatusItem,
    codigo: "INV-003",
    localizacao: "Depósito de Limpeza",
    responsavel: "Auxiliar de Serviços",
    quantidade: 8,
    quantidadeMinima: 5,
    fornecedor: "Limpeza Pro"
  },
  {
    id: 4,
    nome: "Cadernos Espiral 96 folhas",
    descricao: "Cadernos espiral com 96 folhas, capa dura",
    escola: "Escola Particular ABC",
    categoria: "Material Escolar",
    dataAquisicao: new Date("2024-02-10"),
    valorAquisicao: 180.00,
    valorAtual: 180.00,
    status: "ativo" as StatusItem,
    codigo: "INV-004",
    localizacao: "Almoxarifado",
    responsavel: "Coordenadora Ana",
    quantidade: 25,
    quantidadeMinima: 30,
    fornecedor: "Papelaria Escolar"
  },
  {
    id: 5,
    nome: "Detergente Líquido",
    descricao: "Detergente líquido para louças, garrafa 500ml",
    escola: "Escola Técnica XYZ",
    categoria: "Material de Limpeza",
    dataAquisicao: new Date("2024-01-25"),
    valorAquisicao: 8.90,
    valorAtual: 8.90,
    status: "ativo" as StatusItem,
    codigo: "INV-005",
    localizacao: "Copa",
    responsavel: "Cozinheira Rosa",
    quantidade: 3,
    quantidadeMinima: 10,
    fornecedor: "Limpeza Pro"
  }
]

const categoriasMock = [
  "Material de Escritório",
  "Material de Limpeza",
  "Material Escolar",
  "Material de Laboratório",
  "Material de Manutenção",
  "Material de Segurança"
]

const escolasMock = [
  "Escola Municipal São José",
  "Escola Estadual João Silva",
  "Escola Particular ABC",
  "Escola Técnica XYZ"
]

const fornecedoresMock = [
  "Papelaria Central",
  "Distribuidora ABC",
  "Limpeza Pro",
  "Papelaria Escolar",
  "Fornecedor Geral"
]

export default function InventarioPage() {
  const [inventarios, setInventarios] = useState(inventariosMock)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInventario, setEditingInventario] = useState<any>(null)
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
    status: "ativo" as StatusItem,
    quantidade: "",
    quantidadeMinima: "",
    fornecedor: ""
  })

  // Filtrar inventários
  const filteredInventarios = inventarios.filter(inventario => {
    const matchesSearch = inventario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inventario.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || inventario.status === filterStatus
    const matchesCategoria = !filterCategoria || inventario.categoria === filterCategoria
    const matchesEscola = !filterEscola || inventario.escola === filterEscola

    return matchesSearch && matchesStatus && matchesCategoria && matchesEscola
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.categoria || !formData.escola || !formData.valorAquisicao || !formData.quantidade) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    if (editingInventario) {
      // Editar inventário existente
      const updatedInventarios = inventarios.map(i =>
        i.id === editingInventario.id
          ? {
            ...i,
            ...formData,
            valorAquisicao: parseFloat(formData.valorAquisicao),
            quantidade: parseInt(formData.quantidade),
            quantidadeMinima: parseInt(formData.quantidadeMinima) || 0
          }
          : i
      )
      setInventarios(updatedInventarios)
      toast({
        title: "Sucesso",
        description: "Inventário atualizado com sucesso!",
      })
    } else {
      // Criar novo inventário
      const newInventario = {
        id: Date.now(),
        ...formData,
        valorAquisicao: parseFloat(formData.valorAquisicao),
        valorAtual: parseFloat(formData.valorAquisicao),
        quantidade: parseInt(formData.quantidade),
        quantidadeMinima: parseInt(formData.quantidadeMinima) || 0,
        dataAquisicao: new Date(formData.dataAquisicao),
        status: formData.status as StatusItem
      }
      setInventarios([newInventario, ...inventarios])
      toast({
        title: "Sucesso",
        description: "Inventário criado com sucesso!",
      })
    }

    setIsDialogOpen(false)
    setEditingInventario(null)
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
      status: "ativo",
      quantidade: "",
      quantidadeMinima: "",
      fornecedor: ""
    })
  }

  const handleEdit = (inventario: any) => {
    setEditingInventario(inventario)
    setFormData({
      nome: inventario.nome,
      descricao: inventario.descricao || "",
      categoria: inventario.categoria,
      escola: inventario.escola,
      dataAquisicao: inventario.dataAquisicao.toISOString().split('T')[0],
      valorAquisicao: inventario.valorAquisicao.toString(),
      codigo: inventario.codigo || "",
      localizacao: inventario.localizacao || "",
      responsavel: inventario.responsavel || "",
      status: inventario.status,
      quantidade: inventario.quantidade.toString(),
      quantidadeMinima: (inventario.quantidadeMinima || 0).toString(),
      fornecedor: inventario.fornecedor || ""
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (inventario: any) => {
    if (confirm(`Tem certeza que deseja excluir o inventário "${inventario.nome}"?`)) {
      const updatedInventarios = inventarios.filter(i => i.id !== inventario.id)
      setInventarios(updatedInventarios)
      toast({
        title: "Inventário excluído",
        description: `Inventário "${inventario.nome}" excluído com sucesso!`,
      })
    }
  }

  const openNewInventarioDialog = () => {
    setEditingInventario(null)
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
      status: "ativo",
      quantidade: "",
      quantidadeMinima: "",
      fornecedor: ""
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

  const getQuantidadeStatus = (quantidade: number, quantidadeMinima: number) => {
    if (quantidade <= quantidadeMinima) {
      return "bg-red-100 text-red-800"
    } else if (quantidade <= quantidadeMinima * 1.5) {
      return "bg-yellow-100 text-yellow-800"
    } else {
      return "bg-green-100 text-green-800"
    }
  }

  const getQuantidadeIcon = (quantidade: number, quantidadeMinima: number) => {
    if (quantidade <= quantidadeMinima) {
      return <AlertTriangle className="h-4 w-4" />
    } else if (quantidade <= quantidadeMinima * 1.5) {
      return <TrendingUp className="h-4 w-4" />
    } else {
      return <Box className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventário</h1>
          <p className="text-gray-600">
            Gerencie o inventário de materiais da instituição
          </p>
        </div>
        <Button onClick={openNewInventarioDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
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

          {/* Lista de inventários */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredInventarios.map((inventario) => (
              <Card key={inventario.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{inventario.nome}</CardTitle>
                      <CardDescription className="truncate">
                        {inventario.descricao}
                      </CardDescription>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inventario.status)}`}>
                      {inventario.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Código:</span>
                      <p className="font-medium">{inventario.codigo}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Escola:</span>
                      <p className="font-medium truncate">{inventario.escola}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Categoria:</span>
                      <p className="font-medium truncate">{inventario.categoria}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Localização:</span>
                      <p className="font-medium truncate">{inventario.localizacao}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">Valor:</span>
                      <p className="font-medium">{formatCurrency(inventario.valorAquisicao)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fornecedor:</span>
                      <p className="font-medium truncate">{inventario.fornecedor}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">Quantidade:</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQuantidadeStatus(inventario.quantidade, inventario.quantidadeMinima)}`}>
                          {inventario.quantidade}
                        </span>
                        {getQuantidadeIcon(inventario.quantidade, inventario.quantidadeMinima)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mínima:</span>
                      <p className="font-medium">{inventario.quantidadeMinima}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">Aquisição:</span>
                      <p className="font-medium">{formatDate(inventario.dataAquisicao)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Responsável:</span>
                      <p className="font-medium truncate">{inventario.responsavel}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(inventario)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(inventario)}
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

          {filteredInventarios.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum item de inventário encontrado</p>
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
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventarios.length}</div>
                <p className="text-xs text-muted-foreground">
                  Itens cadastrados
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
                  {formatCurrency(inventarios.reduce((sum, i) => sum + i.valorAquisicao, 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Valor de aquisição
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quantidade Total</CardTitle>
                <Box className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {inventarios.reduce((sum, i) => sum + i.quantidade, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Unidades em estoque
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Itens Críticos</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {inventarios.filter(i => i.quantidade <= i.quantidadeMinima).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Abaixo do mínimo
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
                  const itens = inventarios.filter(i => i.categoria === categoria)
                  const valorTotal = itens.reduce((sum, i) => sum + i.valorAquisicao, 0)
                  const quantidadeTotal = itens.reduce((sum, i) => sum + i.quantidade, 0)

                  return (
                    <div key={categoria} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{categoria}</p>
                        <p className="text-sm text-muted-foreground">{itens.length} itens</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(valorTotal)}</p>
                        <p className="text-sm text-muted-foreground">
                          {quantidadeTotal} unidades
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Itens com estoque baixo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Itens com Estoque Baixo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inventarios
                  .filter(i => i.quantidade <= i.quantidadeMinima)
                  .map((inventario) => (
                    <div key={inventario.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <p className="font-medium text-red-900">{inventario.nome}</p>
                        <p className="text-sm text-red-700">{inventario.escola} - {inventario.localizacao}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-900">
                          {inventario.quantidade} / {inventario.quantidadeMinima}
                        </p>
                        <p className="text-sm text-red-700">Estoque baixo</p>
                      </div>
                    </div>
                  ))}

                {inventarios.filter(i => i.quantidade <= i.quantidadeMinima).length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum item com estoque baixo
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para criar/editar inventário */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingInventario ? "Editar Item" : "Novo Item de Inventário"}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do item
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
                  placeholder="Ex: Papel A4 500 folhas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  placeholder="Ex: INV-001"
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
                <Label htmlFor="quantidade">Quantidade *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="0"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidadeMinima">Quantidade Mínima</Label>
                <Input
                  id="quantidadeMinima"
                  type="number"
                  min="0"
                  value={formData.quantidadeMinima}
                  onChange={(e) => setFormData({ ...formData, quantidadeMinima: e.target.value })}
                  placeholder="0"
                />
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
                  placeholder="Ex: Almoxarifado"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável</Label>
                <Input
                  id="responsavel"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                  placeholder="Ex: Secretária Maria"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Select value={formData.fornecedor} onValueChange={(value) => setFormData({ ...formData, fornecedor: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sem-fornecedor">Sem fornecedor</SelectItem>
                    {fornecedoresMock.map(fornecedor => (
                      <SelectItem key={fornecedor} value={fornecedor}>
                        {fornecedor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                placeholder="Descrição detalhada do item"
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
                {editingInventario ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
