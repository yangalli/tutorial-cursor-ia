"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { useToast } from "@/app/hooks/use-toast"
import { Plus, Edit, Trash2, Building2, Package } from "lucide-react"

// Dados mockados para demonstração
const categoriasPatrimonio = [
  { id: 1, nome: "Equipamentos de Informática", tempoDepreciacao: 60, itens: 45 },
  { id: 2, nome: "Móveis e Utensílios", tempoDepreciacao: 120, itens: 89 },
  { id: 3, nome: "Equipamentos de Laboratório", tempoDepreciacao: 84, itens: 23 },
  { id: 4, nome: "Veículos", tempoDepreciacao: 180, itens: 12 },
]

const categoriasInventario = [
  { id: 1, nome: "Material de Escritório", itens: 156 },
  { id: 2, nome: "Material de Limpeza", itens: 78 },
  { id: 3, nome: "Material Didático", itens: 234 },
  { id: 4, nome: "Equipamentos de Segurança", itens: 34 },
]

export default function CategoriasPage() {
  const [activeTab, setActiveTab] = useState("patrimonio")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [formData, setFormData] = useState({
    nome: "",
    tempoDepreciacao: "",
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive",
      })
      return
    }

    if (activeTab === "patrimonio" && !formData.tempoDepreciacao) {
      toast({
        title: "Erro",
        description: "Tempo de depreciação é obrigatório para patrimônio",
        variant: "destructive",
      })
      return
    }

    // TODO: Implementar criação/edição real
    toast({
      title: editingCategory ? "Categoria atualizada" : "Categoria criada",
      description: `Categoria "${formData.nome}" ${editingCategory ? 'atualizada' : 'criada'} com sucesso!`,
    })

    setIsDialogOpen(false)
    setEditingCategory(null)
    setFormData({ nome: "", tempoDepreciacao: "" })
  }

  const handleEdit = (categoria: any) => {
    setEditingCategory(categoria)
    setFormData({
      nome: categoria.nome,
      tempoDepreciacao: categoria.tempoDepreciacao?.toString() || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (categoria: any) => {
    if (confirm(`Tem certeza que deseja excluir a categoria "${categoria.nome}"?`)) {
      toast({
        title: "Categoria excluída",
        description: `Categoria "${categoria.nome}" excluída com sucesso!`,
      })
    }
  }

  const openNewCategoryDialog = () => {
    setEditingCategory(null)
    setFormData({ nome: "", tempoDepreciacao: "" })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600">
            Gerencie as categorias de patrimônio e inventário
          </p>
        </div>
        <Button onClick={openNewCategoryDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="patrimonio" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Patrimônio
          </TabsTrigger>
          <TabsTrigger value="inventario" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventário
          </TabsTrigger>
        </TabsList>

        {/* Categorias de Patrimônio */}
        <TabsContent value="patrimonio" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoriasPatrimonio.map((categoria) => (
              <Card key={categoria.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{categoria.nome}</CardTitle>
                  <CardDescription>
                    {categoria.itens} itens cadastrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Depreciação:</span>
                      <span className="font-medium">{categoria.tempoDepreciacao} meses</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(categoria)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(categoria)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Categorias de Inventário */}
        <TabsContent value="inventario" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoriasInventario.map((categoria) => (
              <Card key={categoria.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{categoria.nome}</CardTitle>
                  <CardDescription>
                    {categoria.itens} itens cadastrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(categoria)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(categoria)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog para criar/editar categoria */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
            <DialogDescription>
              {activeTab === "patrimonio"
                ? "Crie uma nova categoria de patrimônio com tempo de depreciação"
                : "Crie uma nova categoria de inventário"
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Categoria</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Equipamentos de Informática"
              />
            </div>

            {activeTab === "patrimonio" && (
              <div className="space-y-2">
                <Label htmlFor="tempoDepreciacao">Tempo de Depreciação (meses)</Label>
                <Select
                  value={formData.tempoDepreciacao}
                  onValueChange={(value) => setFormData({ ...formData, tempoDepreciacao: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tempo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 meses (1 ano)</SelectItem>
                    <SelectItem value="24">24 meses (2 anos)</SelectItem>
                    <SelectItem value="36">36 meses (3 anos)</SelectItem>
                    <SelectItem value="48">48 meses (4 anos)</SelectItem>
                    <SelectItem value="60">60 meses (5 anos)</SelectItem>
                    <SelectItem value="84">84 meses (7 anos)</SelectItem>
                    <SelectItem value="120">120 meses (10 anos)</SelectItem>
                    <SelectItem value="180">180 meses (15 anos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingCategory ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
