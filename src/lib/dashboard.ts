import { unstable_cache } from 'next/cache'
import prisma from './prisma'
import { DashboardStats, RecentActivity, EscolaResumo, DashboardData } from '@/types/dashboard'
import { formatDistanceToNow } from '@/lib/utils/date-utils'

/**
 * Busca estatísticas gerais do dashboard
 * Cache: 5 minutos (revalidado quando patrimônio/inventário muda)
 */
export const getDashboardStats = unstable_cache(
  async (): Promise<DashboardStats> => {
    // Calcular data de um mês atrás
    const dataUmMesAtras = new Date()
    dataUmMesAtras.setMonth(dataUmMesAtras.getMonth() - 1)

    // Otimização: agregar patrimônio e inventário em paralelo
    const [patrimonioData, inventarioData] = await Promise.all([
      prisma.patrimonio.aggregate({
        where: { status: 'ativo' },
        _sum: {
          valorAtual: true,
          valorAquisicaoReais: true
        },
        _count: true
      }),
      prisma.inventario.aggregate({
        where: { status: 'ativo' },
        _sum: {
          valorAtual: true,
          valorAquisicaoReais: true
        },
        _count: true
      })
    ])

    // Buscar dados do mês anterior em paralelo
    const [patrimonioMesAnterior, inventarioMesAnterior, usuariosAtivos, totalItens] = await Promise.all([
      prisma.patrimonio.aggregate({
        where: {
          status: 'ativo',
          createdAt: { lte: dataUmMesAtras }
        },
        _sum: {
          valorAtual: true,
          valorAquisicaoReais: true
        }
      }),
      prisma.inventario.aggregate({
        where: {
          status: 'ativo',
          createdAt: { lte: dataUmMesAtras }
        },
        _sum: {
          valorAtual: true,
          valorAquisicaoReais: true
        }
      }),
      prisma.usuario.count(),
      Promise.all([
        prisma.patrimonio.count(),
        prisma.inventario.count()
      ]).then(([p, i]) => p + i)
    ])

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
  },
  ['dashboard-stats'],
  {
    revalidate: 300, // 5 minutos
    tags: ['dashboard', 'stats']
  }
)

/**
 * Busca atividades recentes do sistema
 * Cache: 2 minutos
 */
export const getRecentActivities = unstable_cache(
  async (): Promise<RecentActivity[]> => {
    // Otimização: buscar todos em paralelo com menos registros
    const [patrimoniosRecentes, inventariosRecentes, categoriasPatrimonio, categoriasInventario] = await Promise.all([
      prisma.patrimonio.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          nome: true,
          createdAt: true,
          escola: {
            select: { nome: true }
          }
        }
      }),
      prisma.inventario.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          nome: true,
          createdAt: true,
          escola: {
            select: { nome: true }
          }
        }
      }),
      prisma.categoriaPatrimonio.findMany({
        take: 1,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          nome: true,
          createdAt: true
        }
      }),
      prisma.categoriaInventario.findMany({
        take: 1,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          nome: true,
          createdAt: true
        }
      })
    ])

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
      ...categoriasPatrimonio.map(c => ({
        id: `categoria-patrimonio-${c.id}`,
        action: 'Categoria criada',
        item: c.nome,
        escola: 'Sistema',
        time: formatDistanceToNow(c.createdAt),
        type: 'categoria' as const,
        createdAt: c.createdAt
      })),
      ...categoriasInventario.map(c => ({
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
  },
  ['dashboard-recent-activities'],
  {
    revalidate: 120, // 2 minutos
    tags: ['dashboard', 'activities']
  }
)

/**
 * Busca resumo por escola
 * Cache: 5 minutos
 */
export const getEscolasResumo = unstable_cache(
  async (): Promise<EscolaResumo[]> => {
    // Otimização: buscar escolas com counts agregados diretamente
    const escolas = await prisma.escola.findMany({
      select: {
        id: true,
        nome: true,
        patrimonios: {
          where: { status: 'ativo' },
          select: {
            valorAtual: true,
            valorAquisicaoReais: true
          }
        },
        inventarios: {
          where: { status: 'ativo' },
          select: {
            valorAtual: true,
            valorAquisicaoReais: true
          }
        }
      }
    })

    // Calcular valor total geral e mapear dados
    let valorTotalGeral = 0
    const escolasResumo = escolas.map(escola => {
      const valorPatrimonios = escola.patrimonios.reduce((sum, p) =>
        sum + Number(p.valorAtual || p.valorAquisicaoReais), 0)
      const valorInventarios = escola.inventarios.reduce((sum, i) =>
        sum + Number(i.valorAtual || i.valorAquisicaoReais), 0)
      const valorTotal = valorPatrimonios + valorInventarios
      valorTotalGeral += valorTotal

      return {
        id: escola.id,
        nome: escola.nome,
        valor: valorTotal,
        itens: escola.patrimonios.length + escola.inventarios.length,
        percentage: 0 // Será calculado depois
      }
    })

    // Calcular percentuais e ordenar
    escolasResumo.forEach(escola => {
      escola.percentage = valorTotalGeral > 0 ? (escola.valor / valorTotalGeral) * 100 : 0
    })

    // Ordenar por valor (maior para menor) e pegar apenas os 4 principais
    return escolasResumo
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 4)
  },
  ['dashboard-escolas-resumo'],
  {
    revalidate: 300, // 5 minutos
    tags: ['dashboard', 'escolas']
  }
)

/**
 * Busca todos os dados do dashboard
 * Aproveita o cache individual de cada função
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

/**
 * Estratégia de Revalidação:
 *
 * Para revalidar o cache do dashboard após mudanças em patrimônio/inventário,
 * use em suas Server Actions:
 *
 * import { revalidateTag } from 'next/cache'
 * revalidateTag('dashboard')
 *
 * Ou para revalidar partes específicas:
 * revalidateTag('stats')
 * revalidateTag('activities')
 * revalidateTag('escolas')
 */
