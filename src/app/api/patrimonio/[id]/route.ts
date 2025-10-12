import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { StatusItem } from '@prisma/client'

/**
 * GET /api/patrimonio/[id] - Busca um patrimônio específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patrimonio = await prisma.patrimonio.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        escola: true,
        categoriaPatrimonio: true,
        documentos: true
      }
    })

    if (!patrimonio) {
      return NextResponse.json(
        { error: 'Patrimônio não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(patrimonio)
  } catch (error) {
    console.error('Erro ao buscar patrimônio:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar patrimônio' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/patrimonio/[id] - Atualiza um patrimônio
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const patrimonio = await prisma.patrimonio.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(body.nome && { nome: body.nome }),
        ...(body.descricao !== undefined && { descricao: body.descricao }),
        ...(body.escolaId && { escolaId: parseInt(body.escolaId) }),
        ...(body.categoriaPatrimonioId && { categoriaPatrimonioId: parseInt(body.categoriaPatrimonioId) }),
        ...(body.dataAquisicao && { dataAquisicao: new Date(body.dataAquisicao) }),
        ...(body.valorAquisicaoReais && { valorAquisicaoReais: parseFloat(body.valorAquisicaoReais) }),
        ...(body.valorAtual !== undefined && { valorAtual: parseFloat(body.valorAtual) }),
        ...(body.status && { status: body.status as StatusItem }),
        ...(body.caracteristicas !== undefined && { caracteristicas: body.caracteristicas })
      },
      include: {
        escola: true,
        categoriaPatrimonio: true
      }
    })

    return NextResponse.json(patrimonio)
  } catch (error) {
    console.error('Erro ao atualizar patrimônio:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar patrimônio' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/patrimonio/[id] - Deleta um patrimônio
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.patrimonio.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar patrimônio:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar patrimônio' },
      { status: 500 }
    )
  }
}

