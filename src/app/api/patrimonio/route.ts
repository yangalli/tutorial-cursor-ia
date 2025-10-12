import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { StatusItem } from '@prisma/client'

/**
 * GET /api/patrimonio - Lista todos os patrimônios
 */
export async function GET() {
  try {
    const patrimonios = await prisma.patrimonio.findMany({
      include: {
        escola: true,
        categoriaPatrimonio: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(patrimonios)
  } catch (error) {
    console.error('Erro ao buscar patrimônios:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar patrimônios' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/patrimonio - Cria um novo patrimônio
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const patrimonio = await prisma.patrimonio.create({
      data: {
        nome: body.nome,
        descricao: body.descricao,
        escolaId: parseInt(body.escolaId),
        categoriaPatrimonioId: parseInt(body.categoriaPatrimonioId),
        dataAquisicao: new Date(body.dataAquisicao),
        valorAquisicaoReais: parseFloat(body.valorAquisicaoReais),
        valorAtual: body.valorAtual ? parseFloat(body.valorAtual) : parseFloat(body.valorAquisicaoReais),
        status: body.status as StatusItem || 'ativo',
        caracteristicas: body.caracteristicas || {}
      },
      include: {
        escola: true,
        categoriaPatrimonio: true
      }
    })

    return NextResponse.json(patrimonio, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar patrimônio:', error)
    return NextResponse.json(
      { error: 'Erro ao criar patrimônio' },
      { status: 500 }
    )
  }
}

