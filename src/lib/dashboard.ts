import prisma from './prisma'
import { DashboardStats, RecentActivity, EscolaResumo, DashboardData } from '@/app/types/dashboard'
import { formatDistanceToNow } from '@/lib/date-utils'

/**
 * Busca estatísticas gerais do dashboard
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  // Buscar totais de patrimônio
  const patrimonioData = await prisma.patrimonio.aggregate({
    where: {
      status: 'ativo'
    },
    _sum: {
      valorAtual: true,
      valorAquisicaoReais: true
    },
    _count: true
  })

  // Buscar totais de inventário
  const inventarioData = await prisma.inventario.aggregate({
    where: {
      status: 'ativo'
    },
    _sum: {
      valorAtual: true,
      valorAquisicaoReais: true
    },
    _count: true
  })

  // Buscar totais do mês anterior para calcular percentuais
  const dataUmMesAtras = new Date()
  dataUmMesAtras.setMonth(dataUmMesAtras.getMonth() - 1)

  const patrimonioMesAnterior = await prisma.patrimonio.aggregate({
    where: {
      status: 'ativo',
      createdAt: {
        lte: dataUmMesAtras
      }
    },
    _sum: {
      valorAtual: true,
      valorAquisicaoReais: true
    }
  })

  const inventarioMesAnterior = await prisma.inventario.aggregate({
    where: {
      status: 'ativo',
      createdAt: {
        lte: dataUmMesAtras
      }
    },
    _sum: {
      valorAtual: true,
      valorAquisicaoReais: true
    }
  })

  // Contar usuários ativos
  const usuariosAtivos = await prisma.usuario.count()

  // Contar total de itens (ativos e inativos)
  const totalItens = await prisma.patrimonio.count() + await prisma.inventario.count()

  // Calcular valores atuais
  const totalPatrimonio = Number(patrimonioData._sum.valorAtual || patrimonioData._sum.valorAquisicaoReais || 0)
  const totalInventario = Number(inventarioData._sum.valorAtual || inventarioData._sum.valorAquisicaoReais || 0)
  const itensAtivos = patrimonioData._count + inventarioData._count

  // Calcular percentuais
  const totalPatrimonioAnterior = Number(patrimonioMesAnterior._sum.valorAtual || patrimonioMesAnterior._sum.valorAquisicaoReais || 0)
  const totalInventarioAnterior = Number(inventarioMesAnterior._sum.valorAtual || inventarioMesAnterior._sum.valorAquisicaoReais || 0)

  const percentualPatrimonio = totalPatrimonioAnterior > 0
    ? ((totalPatrimonio - totalPatrimonioAnterior) / totalPatrimonioAnterior) * 100
    : 0

  const percentualInventario = totalInventarioAnterior > 0
    ? ((totalInventario - totalInventarioAnterior) / totalInventarioAnterior) * 100
    : 0

  const percentualItensAtivos = totalItens > 0
    ? (itensAtivos / totalItens) * 100
    : 0

  return {
    totalPatrimonio,
    totalInventario,
    itensAtivos,
    usuariosAtivos,
    percentualPatrimonio,
    percentualInventario,
    percentualItensAtivos
  }
}

/**
 * Busca atividades recentes do sistema
 */
export async function getRecentActivities(): Promise<RecentActivity[]> {
  // Buscar patrimônios recentes
  const patrimoniosRecentes = await prisma.patrimonio.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      escola: true
    }
  })

  // Buscar inventários recentes
  const inventariosRecentes = await prisma.inventario.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      escola: true
    }
  })

  // Buscar categorias recentes
  const categoriasPatrimonioRecentes = await prisma.categoriaPatrimonio.findMany({
    take: 2,
    orderBy: {
      createdAt: 'desc'
    }
  })

  const categoriasInventarioRecentes = await prisma.categoriaInventario.findMany({
    take: 2,
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Combinar e formatar atividades
  const atividades: RecentActivity[] = [
    ...patrimoniosRecentes.map(p => ({
      id: `patrimonio-${p.id}`,
      action: 'Novo patrimônio cadastrado',
      item: p.nome,
      escola: p.escola.nome,
      time: formatDistanceToNow(p.createdAt),
      type: 'patrimonio' as const,
      createdAt: p.createdAt
    })),
    ...inventariosRecentes.map(i => ({
      id: `inventario-${i.id}`,
      action: 'Inventário atualizado',
      item: i.nome,
      escola: i.escola.nome,
      time: formatDistanceToNow(i.createdAt),
      type: 'inventario' as const,
      createdAt: i.createdAt
    })),
    ...categoriasPatrimonioRecentes.map(c => ({
      id: `categoria-patrimonio-${c.id}`,
      action: 'Categoria criada',
      item: c.nome,
      escola: 'Sistema',
      time: formatDistanceToNow(c.createdAt),
      type: 'categoria' as const,
      createdAt: c.createdAt
    })),
    ...categoriasInventarioRecentes.map(c => ({
      id: `categoria-inventario-${c.id}`,
      action: 'Categoria criada',
      item: c.nome,
      escola: 'Sistema',
      time: formatDistanceToNow(c.createdAt),
      type: 'categoria' as const,
      createdAt: c.createdAt
    }))
  ]

  // Ordenar por data e pegar apenas os 4 mais recentes
  return atividades
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 4)
}

/**
 * Busca resumo por escola
 */
export async function getEscolasResumo(): Promise<EscolaResumo[]> {
  const escolas = await prisma.escola.findMany({
    include: {
      patrimonios: {
        where: {
          status: 'ativo'
        }
      },
      inventarios: {
        where: {
          status: 'ativo'
        }
      }
    }
  })

  // Calcular valor total de todos os itens para percentual
  const valorTotalGeral = escolas.reduce((total, escola) => {
    const valorPatrimonios = escola.patrimonios.reduce((sum, p) =>
      sum + Number(p.valorAtual || p.valorAquisicaoReais), 0)
    const valorInventarios = escola.inventarios.reduce((sum, i) =>
      sum + Number(i.valorAtual || i.valorAquisicaoReais), 0)
    return total + valorPatrimonios + valorInventarios
  }, 0)

  // Mapear dados das escolas
  const escolasResumo = escolas.map(escola => {
    const valorPatrimonios = escola.patrimonios.reduce((sum, p) =>
      sum + Number(p.valorAtual || p.valorAquisicaoReais), 0)
    const valorInventarios = escola.inventarios.reduce((sum, i) =>
      sum + Number(i.valorAtual || i.valorAquisicaoReais), 0)
    const valorTotal = valorPatrimonios + valorInventarios
    const itensTotal = escola.patrimonios.length + escola.inventarios.length

    return {
      id: escola.id,
      nome: escola.nome,
      valor: valorTotal,
      itens: itensTotal,
      percentage: valorTotalGeral > 0 ? (valorTotal / valorTotalGeral) * 100 : 0
    }
  })

  // Ordenar por valor (maior para menor) e pegar apenas os 4 principais
  return escolasResumo
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 4)
}

/**
 * Busca todos os dados do dashboard
 */
export async function getDashboardData(): Promise<DashboardData> {
  const [stats, recentActivities, escolasResumo] = await Promise.all([
    getDashboardStats(),
    getRecentActivities(),
    getEscolasResumo()
  ])

  return {
    stats,
    recentActivities,
    escolasResumo
  }
}

