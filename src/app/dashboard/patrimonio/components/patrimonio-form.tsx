"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { StatusItem } from "@prisma/client"
import { createPatrimonio, updatePatrimonio } from "@/lib/actions/patrimonio"
import type { PatrimonioWithRelations } from "@/types/patrimonio"

interface PatrimonioFormProps {
  patrimonio?: PatrimonioWithRelations | null
  categorias: Array<{ id: number; nome: string }>
  escolas: Array<{ id: number; nome: string }>
  onSuccess: () => void
  onCancel: () => void
}

export function PatrimonioForm({ patrimonio, categorias, escolas, onSuccess, onCancel }: PatrimonioFormProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

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

    // Validação básica no client
    if (!formData.nome || !formData.categoriaPatrimonioId || !formData.escolaId || !formData.valorAquisicaoReais) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      try {
        // Preparar dados para envio
        const inputData = {
          nome: formData.nome,
          descricao: formData.descricao || undefined,
          escolaId: parseInt(formData.escolaId),
          categoriaPatrimonioId: parseInt(formData.categoriaPatrimonioId),
          dataAquisicao: new Date(formData.dataAquisicao),
          valorAquisicaoReais: parseFloat(formData.valorAquisicaoReais),
          valorAtual: formData.valorAtual ? parseFloat(formData.valorAtual) : undefined,
          status: formData.status,
          caracteristicas: formData.caracteristicas
        }

        // Chamar Server Action apropriada
        const result = patrimonio
          ? await updatePatrimonio(patrimonio.id, inputData)
          : await createPatrimonio(inputData)

        if (!result.success) {
          toast({
            title: "Erro",
            description: result.error,
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Sucesso",
          description: patrimonio
            ? "Patrimônio atualizado com sucesso!"
            : "Patrimônio criado com sucesso!",
        })

        onSuccess()
      } catch (error) {
        console.error('Erro ao salvar patrimônio:', error)
        toast({
          title: "Erro",
          description: "Erro inesperado ao salvar patrimônio. Tente novamente.",
          variant: "destructive",
        })
      }
    })
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
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria *</Label>
          <Select
            value={formData.categoriaPatrimonioId}
            onValueChange={(value) => setFormData({ ...formData, categoriaPatrimonioId: value })}
            required
            disabled={isPending}
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
            disabled={isPending}
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
            disabled={isPending}
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
            disabled={isPending}
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
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as StatusItem })}
            disabled={isPending}
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
          disabled={isPending}
        />
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : patrimonio ? "Atualizar" : "Criar"}
        </Button>
      </DialogFooter>
    </form>
  )
}
