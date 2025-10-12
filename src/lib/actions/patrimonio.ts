"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import {
  createPatrimonioSchema,
  updatePatrimonioSchema,
  patrimonioIdSchema,
  type CreatePatrimonioInput
} from "@/lib/schemas/patrimonio"
import {
  successResponse,
  errorResponse,
  handleActionError,
  type ActionResponse
} from "@/lib/action-response"
import type { PatrimonioWithRelations } from "@/types/patrimonio"

/**
 * Converte Decimal para number para serialização em Client Components
 */
function serializePatrimonio(patrimonio: {
  valorAquisicaoReais: Prisma.Decimal
  valorAtual: Prisma.Decimal | null
  valorAquisicaoDolares: Prisma.Decimal | null
  valorAquisicaoEuros: Prisma.Decimal | null
  [key: string]: unknown
}): PatrimonioWithRelations {
  return {
    ...patrimonio,
    valorAquisicaoReais: patrimonio.valorAquisicaoReais.toNumber(),
    valorAtual: patrimonio.valorAtual?.toNumber() ?? null,
    valorAquisicaoDolares: patrimonio.valorAquisicaoDolares?.toNumber() ?? null,
    valorAquisicaoEuros: patrimonio.valorAquisicaoEuros?.toNumber() ?? null,
  } as PatrimonioWithRelations
}

/**
 * Busca todos os patrimônios com seus relacionamentos
 */
export async function fetchPatrimonioData(): Promise<ActionResponse<{
  patrimonios: PatrimonioWithRelations[]
  categorias: { id: number; nome: string }[]
  escolas: { id: number; nome: string }[]
}>> {
  try {
    const [patrimonios, categorias, escolas] = await Promise.all([
      prisma.patrimonio.findMany({
        include: {
          escola: true,
          categoriaPatrimonio: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.categoriaPatrimonio.findMany({
        select: {
          id: true,
          nome: true
        },
        orderBy: {
          nome: 'asc'
        }
      }),
      prisma.escola.findMany({
        select: {
          id: true,
          nome: true
        },
        orderBy: {
          nome: 'asc'
        }
      })
    ])

    // Serializar Decimal para number
    const serializedPatrimonios = patrimonios.map(serializePatrimonio)

    return successResponse({
      patrimonios: serializedPatrimonios,
      categorias,
      escolas
    })
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Busca um patrimônio específico por ID
 */
export async function fetchPatrimonioById(id: number): Promise<ActionResponse<PatrimonioWithRelations>> {
  try {
    const validatedId = patrimonioIdSchema.parse(id)

    const patrimonio = await prisma.patrimonio.findUnique({
      where: { id: validatedId },
      include: {
        escola: true,
        categoriaPatrimonio: true,
        documentos: true
      }
    })

    if (!patrimonio) {
      return errorResponse("Patrimônio não encontrado")
    }

    return successResponse(serializePatrimonio(patrimonio))
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Cria um novo patrimônio
 */
export async function createPatrimonio(
  input: CreatePatrimonioInput
): Promise<ActionResponse<PatrimonioWithRelations>> {
  try {
    // Validar dados de entrada
    const validatedData = createPatrimonioSchema.parse(input)

    // Preparar dados para o Prisma (conversão de tipos)
    const prismaData: Prisma.PatrimonioCreateInput = {
      nome: validatedData.nome,
      descricao: validatedData.descricao,
      dataAquisicao: validatedData.dataAquisicao,
      valorAquisicaoReais: new Prisma.Decimal(validatedData.valorAquisicaoReais),
      valorAtual: validatedData.valorAtual ? new Prisma.Decimal(validatedData.valorAtual) : undefined,
      status: validatedData.status,
      caracteristicas: validatedData.caracteristicas as Prisma.InputJsonValue,
      escola: {
        connect: { id: validatedData.escolaId }
      },
      categoriaPatrimonio: {
        connect: { id: validatedData.categoriaPatrimonioId }
      }
    }

    // Criar patrimônio no banco
    const patrimonio = await prisma.patrimonio.create({
      data: prismaData,
      include: {
        escola: true,
        categoriaPatrimonio: true,
      }
    })

    // Revalidar a página para refletir mudanças
    revalidatePath('/dashboard/patrimonio')

    return successResponse(serializePatrimonio(patrimonio))
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Atualiza um patrimônio existente
 */
export async function updatePatrimonio(
  id: number,
  input: Partial<CreatePatrimonioInput>
): Promise<ActionResponse<PatrimonioWithRelations>> {
  try {
    // Validar dados de entrada
    const validatedData = updatePatrimonioSchema.parse({ id, ...input })

    // Extrair ID e dados separadamente
    const { id: patrimonioId, ...updateFields } = validatedData

    // Verificar se patrimônio existe
    const exists = await prisma.patrimonio.findUnique({
      where: { id: patrimonioId }
    })

    if (!exists) {
      return errorResponse("Patrimônio não encontrado")
    }

    // Preparar dados para o Prisma
    const prismaData: Prisma.PatrimonioUpdateInput = {
      ...(updateFields.nome && { nome: updateFields.nome }),
      ...(updateFields.descricao !== undefined && { descricao: updateFields.descricao }),
      ...(updateFields.dataAquisicao && { dataAquisicao: updateFields.dataAquisicao }),
      ...(updateFields.valorAquisicaoReais && {
        valorAquisicaoReais: new Prisma.Decimal(updateFields.valorAquisicaoReais)
      }),
      ...(updateFields.valorAtual && {
        valorAtual: new Prisma.Decimal(updateFields.valorAtual)
      }),
      ...(updateFields.status && { status: updateFields.status }),
      ...(updateFields.caracteristicas && {
        caracteristicas: updateFields.caracteristicas as Prisma.InputJsonValue
      }),
      ...(updateFields.escolaId && {
        escola: { connect: { id: updateFields.escolaId } }
      }),
      ...(updateFields.categoriaPatrimonioId && {
        categoriaPatrimonio: { connect: { id: updateFields.categoriaPatrimonioId } }
      })
    }

    // Atualizar patrimônio
    const patrimonio = await prisma.patrimonio.update({
      where: { id: patrimonioId },
      data: prismaData,
      include: {
        escola: true,
        categoriaPatrimonio: true,
      }
    })

    // Revalidar a página
    revalidatePath('/dashboard/patrimonio')

    return successResponse(serializePatrimonio(patrimonio))
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Exclui um patrimônio
 */
export async function deletePatrimonio(id: number): Promise<ActionResponse<{ id: number }>> {
  try {
    const validatedId = patrimonioIdSchema.parse(id)

    // Verificar se patrimônio existe
    const exists = await prisma.patrimonio.findUnique({
      where: { id: validatedId }
    })

    if (!exists) {
      return errorResponse("Patrimônio não encontrado")
    }

    // Deletar patrimônio (documentos são deletados em cascata)
    await prisma.patrimonio.delete({
      where: { id: validatedId }
    })

    // Revalidar a página
    revalidatePath('/dashboard/patrimonio')

    return successResponse({ id: validatedId })
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Busca todas as categorias de patrimônio
 */
export async function fetchCategorias(): Promise<ActionResponse<Array<{ id: number; nome: string }>>> {
  try {
    const categorias = await prisma.categoriaPatrimonio.findMany({
      select: {
        id: true,
        nome: true
      },
      orderBy: {
        nome: 'asc'
      }
    })

    return successResponse(categorias)
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Busca todas as escolas
 */
export async function fetchEscolas(): Promise<ActionResponse<Array<{ id: number; nome: string }>>> {
  try {
    const escolas = await prisma.escola.findMany({
      select: {
        id: true,
        nome: true
      },
      orderBy: {
        nome: 'asc'
      }
    })

    return successResponse(escolas)
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Busca estatísticas de patrimônio
 */
export async function fetchPatrimonioStats(): Promise<ActionResponse<{
  total: number
  ativos: number
  valorTotalAquisicao: number
  valorTotalAtual: number
  porCategoria: Array<{
    categoriaPatrimonioId: number
    count: number
    valorTotal: number
  }>
}>> {
  try {
    const [total, ativos, valorTotal, porCategoria] = await Promise.all([
      prisma.patrimonio.count(),
      prisma.patrimonio.count({
        where: { status: 'ativo' }
      }),
      prisma.patrimonio.aggregate({
        _sum: {
          valorAquisicaoReais: true,
          valorAtual: true
        }
      }),
      prisma.patrimonio.groupBy({
        by: ['categoriaPatrimonioId'],
        _count: true,
        _sum: {
          valorAquisicaoReais: true
        }
      })
    ])

    return successResponse({
      total,
      ativos,
      valorTotalAquisicao: Number(valorTotal._sum.valorAquisicaoReais || 0),
      valorTotalAtual: Number(valorTotal._sum.valorAtual || 0),
      porCategoria: porCategoria.map(item => ({
        categoriaPatrimonioId: item.categoriaPatrimonioId,
        count: item._count,
        valorTotal: Number(item._sum.valorAquisicaoReais || 0)
      }))
    })
  } catch (error) {
    return handleActionError(error)
  }
}
