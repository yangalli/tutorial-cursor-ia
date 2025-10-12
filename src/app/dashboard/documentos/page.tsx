"use client"

import { useState, useRef } from "react"
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
  FileText,
  Upload,
  Download,
  Eye,
  Calendar,
  Building2,
  Package,
  File,
  FileImage,
  FileSpreadsheet,
  FileCode
} from "lucide-react"
import { formatDate } from "@/lib/utils/utils"

// Dados mockados para demonstração
const documentosMock = [
  {
    id: 1,
    nome: "Nota Fiscal Projetor Epson",
    descricao: "Nota fiscal da aquisição do projetor Epson EB-X41",
    tipo: "patrimonio",
    itemId: 1,
    itemNome: "Projetor Epson EB-X41",
    escola: "Escola Municipal São José",
    nomeArquivo: "nota_fiscal_projetor.pdf",
    tamanho: 245760, // 240KB
    extensao: "pdf",
    dataUpload: new Date("2024-01-15"),
    responsavel: "Prof. João Silva",
    categoria: "Notas Fiscais"
  },
  {
    id: 2,
    nome: "Manual de Instruções",
    descricao: "Manual de instruções do projetor Epson EB-X41",
    tipo: "patrimonio",
    itemId: 1,
    itemNome: "Projetor Epson EB-X41",
    escola: "Escola Municipal São José",
    nomeArquivo: "manual_projetor.pdf",
    tamanho: 1048576, // 1MB
    extensao: "pdf",
    dataUpload: new Date("2024-01-15"),
    responsavel: "Prof. João Silva",
    categoria: "Manuais"
  },
  {
    id: 3,
    nome: "Foto do Projetor Instalado",
    descricao: "Foto do projetor instalado na sala 101",
    tipo: "patrimonio",
    itemId: 1,
    itemNome: "Projetor Epson EB-X41",
    escola: "Escola Municipal São José",
    nomeArquivo: "foto_projetor_instalado.jpg",
    tamanho: 524288, // 512KB
    extensao: "jpg",
    dataUpload: new Date("2024-01-16"),
    responsavel: "Prof. João Silva",
    categoria: "Fotos"
  },
  {
    id: 4,
    nome: "Contrato de Compra",
    descricao: "Contrato de compra dos computadores Dell",
    tipo: "patrimonio",
    itemId: 2,
    itemNome: "Computadores Dell OptiPlex 7090",
    escola: "Escola Estadual João Silva",
    nomeArquivo: "contrato_computadores.pdf",
    tamanho: 2097152, // 2MB
    extensao: "pdf",
    dataUpload: new Date("2024-02-01"),
    responsavel: "Prof. Maria Santos",
    categoria: "Contratos"
  },
  {
    id: 5,
    nome: "Relatório de Inventário",
    descricao: "Relatório mensal de inventário de materiais",
    tipo: "inventario",
    itemId: 1,
    itemNome: "Papel A4 500 folhas",
    escola: "Escola Municipal São José",
    nomeArquivo: "relatorio_inventario.xlsx",
    tamanho: 1572864, // 1.5MB
    extensao: "xlsx",
    dataUpload: new Date("2024-02-15"),
    responsavel: "Secretária Maria",
    categoria: "Relatórios"
  }
]

const categoriasMock = [
  "Notas Fiscais",
  "Manuais",
  "Fotos",
  "Contratos",
  "Relatórios",
  "Certificados",
  "Outros"
]

const escolasMock = [
  "Escola Municipal São José",
  "Escola Estadual João Silva",
  "Escola Particular ABC",
  "Escola Técnica XYZ"
]

const tiposMock = [
  { value: "patrimonio", label: "Patrimônio" },
  { value: "inventario", label: "Inventário" }
]

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState(documentosMock)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDocumento, setEditingDocumento] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipo, setFilterTipo] = useState<string>("")
  const [filterCategoria, setFilterCategoria] = useState<string>("")
  const [filterEscola, setFilterEscola] = useState<string>("")
  const [activeTab, setActiveTab] = useState("listagem")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    tipo: "",
    itemId: "",
    itemNome: "",
    escola: "",
    categoria: "",
    arquivo: null as File | null
  })

  // Filtrar documentos
  const filteredDocumentos = documentos.filter(documento => {
    const matchesSearch = documento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      documento.nomeArquivo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = !filterTipo || documento.tipo === filterTipo
    const matchesCategoria = !filterCategoria || documento.categoria === filterCategoria
    const matchesEscola = !filterEscola || documento.escola === filterEscola

    return matchesSearch && matchesTipo && matchesCategoria && matchesEscola
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.tipo || !formData.escola || !formData.arquivo) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios e selecione um arquivo",
        variant: "destructive",
      })
      return
    }

    // Simular upload para Supabase Storage
    setIsUploading(true)
    setUploadProgress(0)

    // Simular progresso de upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadProgress(0)

          if (editingDocumento) {
            // Editar documento existente
            const updatedDocumentos = documentos.map(d =>
              d.id === editingDocumento.id
                ? {
                  ...d,
                  nome: formData.nome,
                  descricao: formData.descricao,
                  categoria: formData.categoria,
                  escola: formData.escola
                }
                : d
            )
            setDocumentos(updatedDocumentos)
            toast({
              title: "Sucesso",
              description: "Documento atualizado com sucesso!",
            })
          } else {
            // Criar novo documento
            const newDocumento = {
              id: Date.now(),
              nome: formData.nome,
              descricao: formData.descricao || "",
              tipo: formData.tipo as "patrimonio" | "inventario",
              itemId: parseInt(formData.itemId) || 0,
              itemNome: formData.itemNome || "",
              escola: formData.escola,
              nomeArquivo: formData.arquivo?.name || "",
              tamanho: formData.arquivo?.size || 0,
              extensao: formData.arquivo?.name.split('.').pop() || "",
              dataUpload: new Date(),
              responsavel: "Usuário Atual", // Será substituído pelo usuário logado
              categoria: formData.categoria
            }
            setDocumentos([newDocumento, ...documentos])
            toast({
              title: "Sucesso",
              description: "Documento enviado com sucesso!",
            })
          }

          setIsDialogOpen(false)
          setEditingDocumento(null)
          setFormData({
            nome: "",
            descricao: "",
            tipo: "",
            itemId: "",
            itemNome: "",
            escola: "",
            categoria: "",
            arquivo: null
          })
          return 0
        }
        return prev + 10
      })
    }, 200)

    return () => clearInterval(interval)
  }

  const handleEdit = (documento: any) => {
    setEditingDocumento(documento)
    setFormData({
      nome: documento.nome,
      descricao: documento.descricao || "",
      tipo: documento.tipo,
      itemId: documento.itemId.toString(),
      itemNome: documento.itemNome || "",
      escola: documento.escola,
      categoria: documento.categoria,
      arquivo: null
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (documento: any) => {
    if (confirm(`Tem certeza que deseja excluir o documento "${documento.nome}"?`)) {
      const updatedDocumentos = documentos.filter(d => d.id !== documento.id)
      setDocumentos(updatedDocumentos)
      toast({
        title: "Documento excluído",
        description: `Documento "${documento.nome}" excluído com sucesso!`,
      })
    }
  }

  const openNewDocumentoDialog = () => {
    setEditingDocumento(null)
    setFormData({
      nome: "",
      descricao: "",
      tipo: "",
      itemId: "",
      itemNome: "",
      escola: "",
      categoria: "",
      arquivo: null
    })
    setIsDialogOpen(true)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, arquivo: file })
    }
  }

  const getFileIcon = (extensao: string) => {
    switch (extensao.toLowerCase()) {
      case "pdf": return <FileCode className="h-8 w-8 text-red-500" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif": return <FileImage className="h-8 w-8 text-green-500" />
      case "doc":
      case "docx": return <FileCode className="h-8 w-8 text-blue-500" />
      case "xls":
      case "xlsx": return <FileSpreadsheet className="h-8 w-8 text-green-600" />
      case "zip":
      case "rar": return <FileCode className="h-8 w-8 text-purple-500" />
      default: return <File className="h-8 w-8 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleDownload = (documento: any) => {
    // Simular download
    toast({
      title: "Download",
      description: `Iniciando download de ${documento.nomeArquivo}`,
    })
  }

  const handlePreview = (documento: any) => {
    // Simular preview
    toast({
      title: "Preview",
      description: `Visualizando ${documento.nomeArquivo}`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
          <p className="text-gray-600">
            Gerencie documentos de patrimônio e inventário
          </p>
        </div>
        <Button onClick={openNewDocumentoDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Documento
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
                      placeholder="Nome ou arquivo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={filterTipo} onValueChange={setFilterTipo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      {tiposMock.map(tipo => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
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

          {/* Lista de documentos */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDocumentos.map((documento) => (
              <Card key={documento.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{documento.nome}</CardTitle>
                      <CardDescription className="truncate">
                        {documento.descricao}
                      </CardDescription>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${documento.tipo === "patrimonio"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                      }`}>
                      {documento.tipo === "patrimonio" ? "Patrimônio" : "Inventário"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                    {getFileIcon(documento.extensao)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Arquivo:</span>
                      <p className="font-medium truncate">{documento.nomeArquivo}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tamanho:</span>
                      <p className="font-medium">{formatFileSize(documento.tamanho)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Escola:</span>
                      <p className="font-medium truncate">{documento.escola}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Categoria:</span>
                      <p className="font-medium truncate">{documento.categoria}</p>
                    </div>
                  </div>

                  {documento.itemNome && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Item:</span>
                      <p className="font-medium truncate">{documento.itemNome}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">Upload:</span>
                      <p className="font-medium">{formatDate(documento.dataUpload)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Responsável:</span>
                      <p className="font-medium truncate">{documento.responsavel}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(documento)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Visualizar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(documento)}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(documento)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(documento)}
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

          {filteredDocumentos.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum documento encontrado</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Resumo */}
        <TabsContent value="resumo" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{documentos.length}</div>
                <p className="text-xs text-muted-foreground">
                  Documentos cadastrados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Patrimônio</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {documentos.filter(d => d.tipo === "patrimonio").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Documentos de patrimônio
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventário</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {documentos.filter(d => d.tipo === "inventario").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Documentos de inventário
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tamanho Total</CardTitle>
                <File className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatFileSize(documentos.reduce((sum, d) => sum + d.tamanho, 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Espaço ocupado
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
                  const docs = documentos.filter(d => d.categoria === categoria)
                  const tamanhoTotal = docs.reduce((sum, d) => sum + d.tamanho, 0)

                  return (
                    <div key={categoria} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{categoria}</p>
                        <p className="text-sm text-muted-foreground">{docs.length} documentos</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatFileSize(tamanhoTotal)}</p>
                        <p className="text-sm text-muted-foreground">
                          {((docs.length / documentos.length) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Resumo por tipo de arquivo */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo por Tipo de Arquivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["pdf", "jpg", "xlsx", "docx", "outros"].map(tipo => {
                  const docs = documentos.filter(d => {
                    if (tipo === "outros") {
                      return !["pdf", "jpg", "jpeg", "png", "gif", "doc", "docx", "xls", "xlsx", "zip", "rar"].includes(d.extensao.toLowerCase())
                    }
                    return d.extensao.toLowerCase() === tipo
                  })
                  const tamanhoTotal = docs.reduce((sum, d) => sum + d.tamanho, 0)

                  return (
                    <div key={tipo} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {getFileIcon(tipo === "outros" ? "txt" : tipo)}
                        <div>
                          <p className="font-medium">{tipo.toUpperCase()}</p>
                          <p className="text-sm text-muted-foreground">{docs.length} arquivos</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatFileSize(tamanhoTotal)}</p>
                        <p className="text-sm text-muted-foreground">
                          {((docs.length / documentos.length) * 100).toFixed(1)}%
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

      {/* Dialog para criar/editar documento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDocumento ? "Editar Documento" : "Novo Documento"}
            </DialogTitle>
            <DialogDescription>
              {editingDocumento
                ? "Edite as informações do documento"
                : "Faça upload de um novo documento"
              }
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
                  placeholder="Ex: Nota Fiscal Projetor"
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
                <Label htmlFor="tipo">Tipo *</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposMock.map(tipo => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
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
                <Label htmlFor="itemId">ID do Item</Label>
                <Input
                  id="itemId"
                  type="number"
                  value={formData.itemId}
                  onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                  placeholder="Ex: 1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemNome">Nome do Item</Label>
                <Input
                  id="itemNome"
                  value={formData.itemNome}
                  onChange={(e) => setFormData({ ...formData, itemNome: e.target.value })}
                  placeholder="Ex: Projetor Epson EB-X41"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição detalhada do documento"
              />
            </div>

            {!editingDocumento && (
              <div className="space-y-2">
                <Label htmlFor="arquivo">Arquivo *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="arquivo"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.zip,.rar"
                  />
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Selecionar Arquivo
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formData.arquivo
                        ? `Arquivo selecionado: ${formData.arquivo.name}`
                        : "PDF, Word, Excel, Imagens, etc. (máx. 10MB)"
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isUploading && (
              <div className="space-y-2">
                <Label>Progresso do Upload</Label>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{uploadProgress}% concluído</p>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isUploading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-pulse" />
                    Enviando...
                  </>
                ) : (
                  editingDocumento ? "Atualizar" : "Enviar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
