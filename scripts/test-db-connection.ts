import prisma from '../src/lib/prisma'

/**
 * Script para testar a conexão com o banco de dados Supabase
 */
async function testConnection() {
  try {
    console.log('🔍 Testando conexão com o banco de dados...\n')

    // Testar conexão básica
    await prisma.$connect()
    console.log('✅ Conexão estabelecida com sucesso!\n')

    // Contar registros
    const escolasCount = await prisma.escola.count()
    const usuariosCount = await prisma.usuario.count()
    const patrimoniosCount = await prisma.patrimonio.count()
    const inventariosCount = await prisma.inventario.count()

    console.log('📊 Estatísticas do banco de dados:')
    console.log(`   - Escolas: ${escolasCount}`)
    console.log(`   - Usuários: ${usuariosCount}`)
    console.log(`   - Patrimônios: ${patrimoniosCount}`)
    console.log(`   - Inventários: ${inventariosCount}\n`)

    if (escolasCount === 0) {
      console.log('⚠️  O banco está vazio. Execute o seed para popular os dados:')
      console.log('   npm run db:seed\n')
    }

    // Testar agregações (similar ao que o dashboard faz)
    const patrimonioTotal = await prisma.patrimonio.aggregate({
      where: { status: 'ativo' },
      _sum: { valorAquisicaoReais: true },
      _count: true
    })

    const inventarioTotal = await prisma.inventario.aggregate({
      where: { status: 'ativo' },
      _sum: { valorAquisicaoReais: true },
      _count: true
    })

    console.log('💰 Valores totais:')
    console.log(`   - Patrimônio: R$ ${Number(patrimonioTotal._sum.valorAquisicaoReais || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
    console.log(`   - Inventário: R$ ${Number(inventarioTotal._sum.valorAquisicaoReais || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
    console.log(`   - Total de itens ativos: ${patrimonioTotal._count + inventarioTotal._count}\n`)

    console.log('✅ Todos os testes passaram!\n')

  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

