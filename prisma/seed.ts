import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // 1. Criar Categorias de Patrimônio
  console.log('📦 Criando categorias de patrimônio...')
  const categoriaEletronicos = await prisma.categoriaPatrimonio.upsert({
    where: { nome: 'Eletrônicos' },
    update: {},
    create: {
      nome: 'Eletrônicos',
      tempoDepreciacao: 60, // 5 anos
      requisitos: {
        garantia: '12 meses',
        certificacao: 'ANATEL',
        voltagem: '110V/220V'
      }
    }
  })

  const categoriaMoveis = await prisma.categoriaPatrimonio.upsert({
    where: { nome: 'Móveis' },
    update: {},
    create: {
      nome: 'Móveis',
      tempoDepreciacao: 120, // 10 anos
      requisitos: {
        material: 'Madeira/MDF',
        acabamento: 'Resistente ao uso',
        dimensoes: 'Padrão escolar'
      }
    }
  })

  const categoriaVeiculos = await prisma.categoriaPatrimonio.upsert({
    where: { nome: 'Veículos' },
    update: {},
    create: {
      nome: 'Veículos',
      tempoDepreciacao: 180, // 15 anos
      requisitos: {
        combustivel: 'Flex',
        capacidade: 'Mínimo 8 passageiros',
        manutencao: 'A cada 10.000km'
      }
    }
  })

  // 2. Criar Categorias de Inventário
  console.log('📋 Criando categorias de inventário...')
  const categoriaMaterialEscolar = await prisma.categoriaInventario.upsert({
    where: { nome: 'Material Escolar' },
    update: {},
    create: {
      nome: 'Material Escolar',
      requisitos: {
        tipo: 'Consumível',
        validade: 'Indefinida',
        armazenamento: 'Local seco'
      }
    }
  })

  const categoriaLivros = await prisma.categoriaInventario.upsert({
    where: { nome: 'Livros' },
    update: {},
    create: {
      nome: 'Livros',
      requisitos: {
        tipo: 'Didático',
        conservacao: 'Boa',
        reposicao: 'Anual'
      }
    }
  })

  // 3. Criar Escolas
  console.log('🏫 Criando escolas...')
  const escolaPrincipal = await prisma.escola.upsert({
    where: { siglaMercurio: 'EP001' },
    update: {},
    create: {
      nome: 'Escola Municipal São João',
      siglaMercurio: 'EP001'
    }
  })

  const escolaSecundaria = await prisma.escola.upsert({
    where: { siglaMercurio: 'EP002' },
    update: {},
    create: {
      nome: 'Escola Estadual Dom Pedro II',
      siglaMercurio: 'EP002'
    }
  })

  // 4. Criar Usuários
  console.log('👥 Criando usuários...')
  const admin = await prisma.usuario.upsert({
    where: { codMercurio: 1001 },
    update: {},
    create: {
      codMercurio: 1001,
      nome: 'João Silva',
      email: 'joao.silva@escola.com',
      senha: 'senha123', // Em produção, usar hash!
      tipoUsuario: 'admin'
    }
  })

  const secretario = await prisma.usuario.upsert({
    where: { codMercurio: 1002 },
    update: {},
    create: {
      codMercurio: 1002,
      nome: 'Maria Santos',
      email: 'maria.santos@escola.com',
      senha: 'senha123',
      tipoUsuario: 'secretario'
    }
  })

  const chefeFilial = await prisma.usuario.upsert({
    where: { codMercurio: 1003 },
    update: {},
    create: {
      codMercurio: 1003,
      nome: 'Pedro Oliveira',
      email: 'pedro.oliveira@escola.com',
      senha: 'senha123',
      tipoUsuario: 'chefe_de_filial'
    }
  })

  const usuario = await prisma.usuario.upsert({
    where: { codMercurio: 1004 },
    update: {},
    create: {
      codMercurio: 1004,
      nome: 'Ana Costa',
      email: 'ana.costa@escola.com',
      senha: 'senha123',
      tipoUsuario: 'usuario'
    }
  })

  // 5. Criar Relacionamentos Escola-Usuário
  console.log('🔗 Criando relacionamentos escola-usuário...')
  await prisma.escolaUsuario.upsert({
    where: {
      escolaId_usuarioId: {
        escolaId: escolaPrincipal.id,
        usuarioId: admin.id
      }
    },
    update: {},
    create: {
      escolaId: escolaPrincipal.id,
      usuarioId: admin.id,
      nivelAcesso: 5
    }
  })

  await prisma.escolaUsuario.upsert({
    where: {
      escolaId_usuarioId: {
        escolaId: escolaPrincipal.id,
        usuarioId: secretario.id
      }
    },
    update: {},
    create: {
      escolaId: escolaPrincipal.id,
      usuarioId: secretario.id,
      nivelAcesso: 4
    }
  })

  await prisma.escolaUsuario.upsert({
    where: {
      escolaId_usuarioId: {
        escolaId: escolaSecundaria.id,
        usuarioId: chefeFilial.id
      }
    },
    update: {},
    create: {
      escolaId: escolaSecundaria.id,
      usuarioId: chefeFilial.id,
      nivelAcesso: 5
    }
  })

  // 6. Criar Patrimônios
  console.log('💻 Criando patrimônios...')
  const computador = await prisma.patrimonio.create({
    data: {
      escolaId: escolaPrincipal.id,
      categoriaPatrimonioId: categoriaEletronicos.id,
      nome: 'Computador Dell OptiPlex 7090',
      descricao: 'Computador desktop para laboratório de informática',
      dataAquisicao: new Date('2023-01-15'),
      valorAquisicaoReais: 3500.00,
      valorAquisicaoDolares: 650.00,
      status: 'ativo',
      caracteristicas: {
        processador: 'Intel i5-10500',
        memoria: '8GB RAM',
        armazenamento: '256GB SSD',
        sistema: 'Windows 11 Pro'
      },
      historico: {
        instalacao: '2023-01-20',
        manutencao: '2023-06-15'
      },
      valorAtual: 2800.00
    }
  })

  const mesaEscritorio = await prisma.patrimonio.create({
    data: {
      escolaId: escolaPrincipal.id,
      categoriaPatrimonioId: categoriaMoveis.id,
      nome: 'Mesa de Escritório',
      descricao: 'Mesa para secretaria escolar',
      dataAquisicao: new Date('2022-08-10'),
      valorAquisicaoReais: 800.00,
      status: 'ativo',
      caracteristicas: {
        material: 'MDF com acabamento laminado',
        dimensoes: '120x60x75cm',
        cor: 'Marrom escuro',
        gavetas: 3
      },
      historico: {
        instalacao: '2022-08-15'
      },
      valorAtual: 600.00
    }
  })

  const vanEscolar = await prisma.patrimonio.create({
    data: {
      escolaId: escolaSecundaria.id,
      categoriaPatrimonioId: categoriaVeiculos.id,
      nome: 'Van Escolar Mercedes-Benz',
      descricao: 'Van para transporte de alunos',
      dataAquisicao: new Date('2021-03-20'),
      valorAquisicaoReais: 85000.00,
      status: 'ativo',
      caracteristicas: {
        marca: 'Mercedes-Benz',
        modelo: 'Sprinter',
        ano: 2021,
        capacidade: '15 passageiros',
        combustivel: 'Diesel'
      },
      historico: {
        entrega: '2021-03-25',
        primeira_manutencao: '2021-09-20'
      },
      valorAtual: 68000.00
    }
  })

  // 7. Criar Inventários
  console.log('📚 Criando inventários...')
  const livrosMatematica = await prisma.inventario.create({
    data: {
      escolaId: escolaPrincipal.id,
      categoriaInventarioId: categoriaLivros.id,
      nome: 'Coleção de Livros de Matemática',
      descricao: 'Livros didáticos de matemática para ensino fundamental',
      dataAquisicao: new Date('2023-02-01'),
      valorAquisicaoReais: 2500.00,
      status: 'ativo',
      caracteristicas: {
        quantidade: 150,
        series: '1º ao 9º ano',
        editora: 'Editora Moderna',
        ano: 2023
      },
      historico: {
        recebimento: '2023-02-05',
        distribuicao: '2023-02-10'
      },
      valorAtual: 2500.00
    }
  })

  const materialEscritorio = await prisma.inventario.create({
    data: {
      escolaId: escolaPrincipal.id,
      categoriaInventarioId: categoriaMaterialEscolar.id,
      nome: 'Material de Escritório',
      descricao: 'Material básico para escritório escolar',
      dataAquisicao: new Date('2023-08-01'),
      valorAquisicaoReais: 800.00,
      status: 'ativo',
      caracteristicas: {
        itens: ['Papel A4', 'Canetas', 'Lápis', 'Grampeadores', 'Clips'],
        quantidade: 'Variada',
        validade: 'Indefinida'
      },
      historico: {
        recebimento: '2023-08-02',
        armazenamento: 'Depósito central'
      },
      valorAtual: 800.00
    }
  })

  // 8. Criar Documentos
  console.log('📄 Criando documentos...')
  await prisma.documentoPatrimonio.create({
    data: {
      patrimonioId: computador.id,
      nomeArquivo: 'nota_fiscal_computador.pdf',
      descricao: 'Nota fiscal do computador Dell',
      urlArquivo: '/documentos/patrimonio/nota_fiscal_computador.pdf',
      tipoArquivo: 'PDF',
      tamanho: 245760
    }
  })

  await prisma.documentoPatrimonio.create({
    data: {
      patrimonioId: computador.id,
      nomeArquivo: 'garantia_computador.pdf',
      descricao: 'Certificado de garantia do computador',
      urlArquivo: '/documentos/patrimonio/garantia_computador.pdf',
      tipoArquivo: 'PDF',
      tamanho: 153600
    }
  })

  await prisma.documentoInventario.create({
    data: {
      inventarioId: livrosMatematica.id,
      nomeArquivo: 'pedido_livros.pdf',
      descricao: 'Pedido de compra dos livros de matemática',
      urlArquivo: '/documentos/inventario/pedido_livros.pdf',
      tipoArquivo: 'PDF',
      tamanho: 102400
    }
  })

  console.log('✅ Seed concluído com sucesso!')
  console.log(`📊 Dados criados:`)
  console.log(`   - ${await prisma.categoriaPatrimonio.count()} categorias de patrimônio`)
  console.log(`   - ${await prisma.categoriaInventario.count()} categorias de inventário`)
  console.log(`   - ${await prisma.escola.count()} escolas`)
  console.log(`   - ${await prisma.usuario.count()} usuários`)
  console.log(`   - ${await prisma.patrimonio.count()} patrimônios`)
  console.log(`   - ${await prisma.inventario.count()} inventários`)
  console.log(`   - ${await prisma.documentoPatrimonio.count()} documentos de patrimônio`)
  console.log(`   - ${await prisma.documentoInventario.count()} documentos de inventário`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro durante o seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
