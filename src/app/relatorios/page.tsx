'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Filter,
  RefreshCw,
  FileText,
  DollarSign,
  Package,
  Building
} from 'lucide-react';
import { Patrimonio, Inventario, RelatorioMensal } from '@/types';

// Dados mockados para demonstração
const mockPatrimonio: Patrimonio[] = [
  {
    id: '1',
    escolaId: '1',
    categoriaPatrimonioId: '1',
    nome: 'Computador Dell OptiPlex 7090',
    descricao: 'Computador desktop para uso administrativo',
    dataAquisicao: new Date('2023-01-15'),
    valorAquisicaoReais: 4500,
    valorAquisicaoDolares: 900,
    valorAquisicaoEuros: 800,
    status: 'ativo',
    caracteristicas: {},
    historico: [],
    valorAtual: 3800,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
    categoriaPatrimonio: {
      id: '1',
      nome: 'Equipamentos de Informática',
      tempoDepreciacao: 60,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    }
  },
  {
    id: '2',
    escolaId: '1',
    categoriaPatrimonioId: '2',
    nome: 'Ar Condicionado Split 12.000 BTUs',
    descricao: 'Ar condicionado para sala de aula',
    dataAquisicao: new Date('2022-06-10'),
    valorAquisicaoReais: 2800,
    valorAquisicaoDolares: 560,
    valorAquisicaoEuros: 500,
    status: 'ativo',
    caracteristicas: {},
    historico: [],
    valorAtual: 2100,
    createdAt: new Date('2022-06-10'),
    updatedAt: new Date('2022-06-10'),
    categoriaPatrimonio: {
      id: '2',
      nome: 'Climatização',
      tempoDepreciacao: 120,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2022-01-01')
    }
  }
];

const mockInventario: Inventario[] = [
  {
    id: '1',
    escolaId: '1',
    categoriaInventarioId: '1',
    nome: 'Mesa de Escritório',
    descricao: 'Mesa de escritório com gavetas',
    dataAquisicao: new Date('2023-03-20'),
    valorAquisicaoReais: 800,
    valorAquisicaoDolares: 160,
    valorAquisicaoEuros: 140,
    status: 'ativo',
    caracteristicas: {},
    historico: [],
    valorAtual: 750,
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-03-20'),
    categoriaInventario: {
      id: '1',
      nome: 'Mobiliário',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    }
  }
];

function RelatoriosContent() {
  const [patrimonio, setPatrimonio] = useState<Patrimonio[]>(mockPatrimonio);
  const [inventario, setInventario] = useState<Inventario[]>(mockInventario);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedSchool, setSelectedSchool] = useState('todas');
  const [selectedCategory, setSelectedCategory] = useState('todas');

  // Cálculos para relatórios
  const totalPatrimonio = patrimonio.reduce((sum, item) => sum + item.valorAtual, 0);
  const totalInventario = inventario.reduce((sum, item) => sum + item.valorAtual, 0);
  const valorTotal = totalPatrimonio + totalInventario;

  const patrimonioPorCategoria = patrimonio.reduce((acc, item) => {
    const categoria = item.categoriaPatrimonio?.nome || 'Sem categoria';
    acc[categoria] = (acc[categoria] || 0) + item.valorAtual;
    return acc;
  }, {} as Record<string, number>);

  const patrimonioPorStatus = patrimonio.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + item.valorAtual;
    return acc;
  }, {} as Record<string, number>);

  const depreciacaoMensal = patrimonio
    .filter(item => item.status === 'ativo')
    .reduce((sum, item) => {
      const mesesDesdeAquisicao = Math.floor(
        (new Date().getTime() - item.dataAquisicao.getTime()) / (1000 * 60 * 60 * 24 * 30)
      );
      const depreciacaoMensal = item.valorAquisicaoReais / (item.categoriaPatrimonio?.tempoDepreciacao || 60);
      return sum + (depreciacaoMensal * mesesDesdeAquisicao);
    }, 0);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // Simular sincronização com dados mockados
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Sincronização concluída com dados mockados');
    } catch (error) {
      console.error('Erro na sincronização:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const exportToPDF = () => {
    // Implementar exportação para PDF
    console.log('Exportando para PDF...');
  };

  const exportToExcel = () => {
    // Implementar exportação para Excel
    console.log('Exportando para Excel...');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Relatórios e análises do patrimônio e inventário
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSync}
            disabled={isSyncing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Exportar Relatórios</DialogTitle>
                <DialogDescription>
                  Escolha o formato de exportação
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2">
                <Button onClick={exportToPDF} variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button onClick={exportToExcel} variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="periodo">Período</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="escola">Escola</Label>
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as escolas</SelectItem>
                  <SelectItem value="1">Nova Acrópole - São Paulo</SelectItem>
                  <SelectItem value="2">Nova Acrópole - Rio de Janeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  <SelectItem value="informatica">Informática</SelectItem>
                  <SelectItem value="climatizacao">Climatização</SelectItem>
                  <SelectItem value="mobiliario">Mobiliário</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Executivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(valorTotal)}</div>
            <p className="text-xs text-muted-foreground">
              Patrimônio + Inventário
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patrimônio</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPatrimonio)}</div>
            <p className="text-xs text-muted-foreground">
              {patrimonio.length} itens
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventário</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalInventario)}</div>
            <p className="text-xs text-muted-foreground">
              {inventario.length} itens
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Depreciação Acumulada</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(depreciacaoMensal)}</div>
            <p className="text-xs text-muted-foreground">
              Perdas por depreciação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Relatórios */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="patrimonio">Patrimônio</TabsTrigger>
          <TabsTrigger value="inventario">Inventário</TabsTrigger>
          <TabsTrigger value="analise">Análise Detalhada</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gráfico de Pizza - Distribuição por Categoria */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>
                  Valor total por categoria de patrimônio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(patrimonioPorCategoria).map(([categoria, valor]) => (
                    <div key={categoria} className="flex items-center justify-between">
                      <span className="text-sm">{categoria}</span>
                      <Badge variant="secondary">
                        {formatCurrency(valor)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Barras - Status dos Itens */}
            <Card>
              <CardHeader>
                <CardTitle>Status dos Itens</CardTitle>
                <CardDescription>
                  Quantidade de itens por status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(patrimonioPorStatus).map(([status, valor]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{status}</span>
                      <Badge variant="outline">
                        {formatCurrency(valor)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patrimonio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Patrimônio</CardTitle>
              <CardDescription>
                Lista detalhada de todos os itens de patrimônio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valor Aquisição</TableHead>
                    <TableHead>Valor Atual</TableHead>
                    <TableHead>Depreciação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patrimonio.map((item) => {
                    const depreciacao = item.valorAquisicaoReais - item.valorAtual;
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.nome}</TableCell>
                        <TableCell>{item.categoriaPatrimonio?.nome}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(item.valorAquisicaoReais)}</TableCell>
                        <TableCell>{formatCurrency(item.valorAtual)}</TableCell>
                        <TableCell className={depreciacao > 0 ? 'text-red-600' : 'text-green-600'}>
                          {formatCurrency(depreciacao)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventario" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Inventário</CardTitle>
              <CardDescription>
                Lista detalhada de todos os itens de inventário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valor Aquisição</TableHead>
                    <TableHead>Valor Atual</TableHead>
                    <TableHead>Data Aquisição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventario.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell>{item.categoriaInventario?.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(item.valorAquisicaoReais)}</TableCell>
                      <TableCell>{formatCurrency(item.valorAtual)}</TableCell>
                      <TableCell>{formatDate(item.dataAquisicao)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analise" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Análise de Depreciação */}
            <Card>
              <CardHeader>
                <CardTitle>Análise de Depreciação</CardTitle>
                <CardDescription>
                  Itens com maior perda de valor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {patrimonio
                    .filter(item => item.valorAquisicaoReais > item.valorAtual)
                    .sort((a, b) => (b.valorAquisicaoReais - b.valorAtual) - (a.valorAquisicaoReais - a.valorAtual))
                    .slice(0, 5)
                    .map((item) => {
                      const depreciacao = item.valorAquisicaoReais - item.valorAtual;
                      const percentual = (depreciacao / item.valorAquisicaoReais) * 100;
                      return (
                        <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="font-medium text-sm">{item.nome}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.categoriaPatrimonio?.nome}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-red-600">
                              -{formatCurrency(depreciacao)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {percentual.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Itens por Escola */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Escola</CardTitle>
                <CardDescription>
                  Valor total por escola
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium text-sm">Nova Acrópole - São Paulo</div>
                      <div className="text-xs text-muted-foreground">Escola principal</div>
                    </div>
                    <Badge variant="secondary">
                      {formatCurrency(valorTotal)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function RelatoriosPage() {
  return (
    <ProtectedRoute>
      <RelatoriosContent />
    </ProtectedRoute>
  );
}
