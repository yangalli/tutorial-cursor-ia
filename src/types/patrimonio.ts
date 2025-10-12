import { Patrimonio, Escola, CategoriaPatrimonio, DocumentoPatrimonio } from '@prisma/client'

/**
 * Patrimônio serializado (Decimal convertido para number para Client Components)
 */
export type PatrimonioSerialized = Omit<Patrimonio, 'valorAquisicaoReais' | 'valorAtual' | 'valorAquisicaoDolares' | 'valorAquisicaoEuros'> & {
  valorAquisicaoReais: number
  valorAtual: number | null
  valorAquisicaoDolares: number | null
  valorAquisicaoEuros: number | null
}

/**
 * Patrimônio com relacionamentos básicos (escola e categoria)
 */
export type PatrimonioWithRelations = PatrimonioSerialized & {
  escola: Escola
  categoriaPatrimonio: CategoriaPatrimonio
}

/**
 * Patrimônio com todos os relacionamentos incluindo documentos
 */
export type PatrimonioComplete = PatrimonioSerialized & {
  escola: Escola
  categoriaPatrimonio: CategoriaPatrimonio
  documentos: DocumentoPatrimonio[]
}

/**
 * Tipo para listagem simples (apenas os campos essenciais)
 */
export type PatrimonioListItem = Pick<
  Patrimonio,
  'id' | 'nome' | 'descricao' | 'status' | 'valorAquisicaoReais' | 'valorAtual' | 'dataAquisicao'
> & {
  escola: Pick<Escola, 'id' | 'nome'>
  categoriaPatrimonio: Pick<CategoriaPatrimonio, 'id' | 'nome'>
}

/**
 * Tipo para formulário de patrimônio
 */
export type PatrimonioFormData = {
  nome: string
  descricao?: string
  escolaId: number
  categoriaPatrimonioId: number
  dataAquisicao: Date
  valorAquisicaoReais: number
  valorAtual?: number
  status: Patrimonio['status']
  caracteristicas?: Record<string, unknown>
}

