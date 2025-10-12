import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/escolas - Lista todas as escolas
 */
export async function GET() {
  try {
    const escolas = await prisma.escola.findMany({
      orderBy: {
        nome: 'asc'
      }
    })

    return NextResponse.json(escolas)
  } catch (error) {
    console.error('Erro ao buscar escolas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar escolas' },
      { status: 500 }
    )
  }
}

