"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { StatusItem } from "@prisma/client"

export async function fetchPatrimonioData() {
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
      orderBy: {
        nome: 'asc'
      }
    }),
    prisma.escola.findMany({
      orderBy: {
        nome: 'asc'
      }
    })
  ])

  return {
    patrimonios,
    categorias,
    escolas
  }
}

export async function fetchPatrimonioById(id: number) {
  return await prisma.patrimonio.findUnique({
    where: { id },
    include: {
      escola: true,
      categoriaPatrimonio: true,
      documentos: true
    }
  })
}

export async function createPatrimonio(data: {
  nome: string
  descricao?: string
  escolaId: number
  categoriaPatrimonioId: number
  dataAquisicao: Date
  valorAquisicaoReais: number
  status: StatusItem
  caracteristicas?: any
}) {
  const patrimonio = await prisma.patrimonio.create({
    data,
    include: {
      escola: true,
      categoriaPatrimonio: true,
    }
  })

  revalidatePath('/dashboard/patrimonio')
  return patrimonio
}

export async function updatePatrimonio(
  id: number,
  data: Partial<{
    nome: string
    descricao?: string
    escolaId: number
    categoriaPatrimonioId: number
    dataAquisicao: Date
    valorAquisicaoReais: number
    status: StatusItem
    caracteristicas?: any
  }>
) {
  const patrimonio = await prisma.patrimonio.update({
    where: { id },
    data,
    include: {
      escola: true,
      categoriaPatrimonio: true,
    }
  })

  revalidatePath('/dashboard/patrimonio')
  return patrimonio
}

export async function deletePatrimonio(id: number) {
  await prisma.patrimonio.delete({
    where: { id }
  })

  revalidatePath('/dashboard/patrimonio')
}

export async function fetchPatrimonioStats() {
  const total = await prisma.patrimonio.count()

  const ativos = await prisma.patrimonio.count({
    where: { status: 'ativo' }
  })

  const valorTotal = await prisma.patrimonio.aggregate({
    _sum: {
      valorAquisicaoReais: true,
      valorAtual: true
    }
  })

  const porCategoria = await prisma.patrimonio.groupBy({
    by: ['categoriaPatrimonioId'],
    _count: true,
    _sum: {
      valorAquisicaoReais: true
    }
  })

  return {
    total,
    ativos,
    valorTotalAquisicao: Number(valorTotal._sum.valorAquisicaoReais || 0),
    valorTotalAtual: Number(valorTotal._sum.valorAtual || 0),
    porCategoria
  }
}

