"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { DialogFooter } from "@/app/components/ui/dialog"
import { useToast } from "@/app/hooks/use-toast"
import { StatusItem } from "@/app/types"

interface PatrimonioFormProps {
  patrimonio?: any
  categorias: Array<{ id: number; nome: string }>
  escolas: Array<{ id: number; nome: string }>
  onSuccess: () => void
  onCancel: () => void
}

export function PatrimonioForm({ patrimonio, categorias, escolas, onSuccess, onCancel }: PatrimonioFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    nome: patrimonio?.nome || "",
    descricao: patrimonio?.descricao || "",
    categoriaPatrimonioId: patrimonio?.categoriaPatrimonioId?.toString() || "",
    escolaId: patrimonio?.escolaId?.toString() || "",
    dataAquisicao: patrimonio?.dataAquisicao
      ? new Date(patrimonio.dataAquisicao).toISOString().split('T')[0]
      : "",
    valorAquisicaoReais: patrimonio?.valorAquisicaoReais?.toString() || "",
    valorAtual: patrimonio?.valorAtual?.toString() || "",
    status: patrimonio?.status || ("ativo" as StatusItem),
    caracteristicas: patrimonio?.caracteristicas || {}
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.nome || !formData.categoriaPatrimonioId || !formData.escolaId || !formData.valorAquisicaoReais) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive",
        })
        return
      }

      const url = patrimonio ? `/api/patrimonio/${patrimonio.id}` : '/api/patrimonio'
      const method = patrimonio ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          valorAtual: formData.valorAtual || formData.valorAquisicaoReais
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar patrimônio')
      }

      toast({
        title: "Sucesso",
        description: patrimonio
          ? "Patrimônio atualizado com sucesso!"
          : "Patrimônio criado com sucesso!",
      })

      onSuccess()
    } catch (error) {
      console.error('Erro:', error)
      toast({
        title: "Erro",
        description: "Erro ao salvar patrimônio. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Ex: Projetor Epson EB-X41"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria *</Label>
          <Select
            value={formData.categoriaPatrimonioId}
            onValueChange={(value) => setFormData({ ...formData, categoriaPatrimonioId: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map(categoria => (
                <SelectItem key={categoria.id} value={categoria.id.toString()}>
                  {categoria.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="escola">Escola *</Label>
          <Select
            value={formData.escolaId}
            onValueChange={(value) => setFormData({ ...formData, escolaId: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a escola" />
            </SelectTrigger>
            <SelectContent>
              {escolas.map(escola => (
                <SelectItem key={escola.id} value={escola.id.toString()}>
                  {escola.nome}
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
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="valorAquisicaoReais">Valor de Aquisição (R$) *</Label>
          <Input
            id="valorAquisicaoReais"
            type="number"
            step="0.01"
            min="0"
            value={formData.valorAquisicaoReais}
            onChange={(e) => setFormData({ ...formData, valorAquisicaoReais: e.target.value })}
            placeholder="0,00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="valorAtual">Valor Atual (R$)</Label>
          <Input
            id="valorAtual"
            type="number"
            step="0.01"
            min="0"
            value={formData.valorAtual}
            onChange={(e) => setFormData({ ...formData, valorAtual: e.target.value })}
            placeholder="Deixe vazio para usar o valor de aquisição"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as StatusItem })}
          >
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
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : patrimonio ? "Atualizar" : "Criar"}
        </Button>
      </DialogFooter>
    </form>
  )
}

