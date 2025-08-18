'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Edit, Trash2, Eye, Download } from 'lucide-react';
import { Patrimonio, ItemStatus } from '@/types';

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
    caracteristicas: {
      processador: 'Intel i5-10500',
      memoria: '8GB DDR4',
      armazenamento: '256GB SSD',
      sistema: 'Windows 11 Pro'
    },
    historico: [
      {
        data: new Date('2023-01-15'),
        descricao: 'Aquisição inicial',
        valor: 4500,
        tipo: 'avaliacao'
      }
    ],
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
    caracteristicas: {
      potencia: '12.000 BTUs',
      tipo: 'Split',
      marca: 'LG',
      eficiencia: 'A++'
    },
    historico: [
      {
        data: new Date('2022-06-10'),
        descricao: 'Aquisição inicial',
        valor: 2800,
        tipo: 'avaliacao'
      },
      {
        data: new Date('2023-12-01'),
        descricao: 'Manutenção preventiva',
        valor: 150,
        tipo: 'manutencao'
      }
    ],
    valorAtual: 2100,
    createdAt: new Date('2022-06-10'),
    updatedAt: new Date('2023-12-01'),
    categoriaPatrimonio: {
      id: '2',
      nome: 'Climatização',
      tempoDepreciacao: 120,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2022-01-01')
    }
  }
];

const statusColors: Record<ItemStatus, string> = {
  ativo: 'bg-green-100 text-green-800',
  inativo: 'bg-gray-100 text-gray-800',
  manutencao: 'bg-yellow-100 text-yellow-800',
  depreciado: 'bg-red-100 text-red-800',
  vendido: 'bg-blue-100 text-blue-800'
};

function PatrimonioContent() {
  const [patrimonio, setPatrimonio] = useState<Patrimonio[]>(mockPatrimonio);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Patrimonio | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const filteredPatrimonio = patrimonio.filter(item => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (formData: Partial<Patrimonio>) => {
    const newItem: Patrimonio = {
      id: Date.now().toString(),
      escolaId: '1',
      categoriaPatrimonioId: formData.categoriaPatrimonioId || '1',
      nome: formData.nome || '',
      descricao: formData.descricao || '',
      dataAquisicao: new Date(),
      valorAquisicaoReais: formData.valorAquisicaoReais || 0,
      valorAquisicaoDolares: formData.valorAquisicaoDolares || 0,
      valorAquisicaoEuros: formData.valorAquisicaoEuros || 0,
      status: 'ativo',
      caracteristicas: {},
      historico: [],
      valorAtual: formData.valorAquisicaoReais || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      categoriaPatrimonio: {
        id: '1',
        nome: 'Equipamentos de Informática',
        tempoDepreciacao: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    setPatrimonio([newItem, ...patrimonio]);
    setIsCreateDialogOpen(false);
  };

  const handleEdit = (item: Patrimonio) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (formData: Partial<Patrimonio>) => {
    if (!editingItem) return;

    const updatedItem = { ...editingItem, ...formData, updatedAt: new Date() };
    setPatrimonio(patrimonio.map(item =>
      item.id === editingItem.id ? updatedItem : item
    ));
    setIsEditDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      setPatrimonio(patrimonio.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patrimônio</h1>
          <p className="text-muted-foreground">
            Gerencie os bens patrimoniais da escola
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Item de Patrimônio</DialogTitle>
              <DialogDescription>
                Adicione um novo item ao patrimônio da escola
              </DialogDescription>
            </DialogHeader>
            <PatrimonioForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por nome ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                  <SelectItem value="depreciado">Depreciado</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Itens de Patrimônio</CardTitle>
          <CardDescription>
            {filteredPatrimonio.length} itens encontrados
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
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatrimonio.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.nome}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.descricao}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.categoriaPatrimonio?.nome}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[item.status]}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(item.valorAquisicaoReais)}</TableCell>
                  <TableCell>{formatCurrency(item.valorAtual)}</TableCell>
                  <TableCell>{formatDate(item.dataAquisicao)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Item de Patrimônio</DialogTitle>
            <DialogDescription>
              Edite as informações do item selecionado
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <PatrimonioForm
              item={editingItem}
              onSubmit={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente do formulário
interface PatrimonioFormProps {
  item?: Patrimonio;
  onSubmit: (data: Partial<Patrimonio>) => void;
}

function PatrimonioForm({ item, onSubmit }: PatrimonioFormProps) {
  const [formData, setFormData] = useState({
    nome: item?.nome || '',
    descricao: item?.descricao || '',
    categoriaPatrimonioId: item?.categoriaPatrimonioId || '1',
    valorAquisicaoReais: item?.valorAquisicaoReais || 0,
    valorAquisicaoDolares: item?.valorAquisicaoDolares || 0,
    valorAquisicaoEuros: item?.valorAquisicaoEuros || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="categoria">Categoria</Label>
          <Select
            value={formData.categoriaPatrimonioId}
            onValueChange={(value) => setFormData({ ...formData, categoriaPatrimonioId: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Equipamentos de Informática</SelectItem>
              <SelectItem value="2">Climatização</SelectItem>
              <SelectItem value="3">Mobiliário</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="valorReais">Valor (R$)</Label>
          <Input
            id="valorReais"
            type="number"
            step="0.01"
            value={formData.valorAquisicaoReais}
            onChange={(e) => setFormData({ ...formData, valorAquisicaoReais: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        <div>
          <Label htmlFor="valorDolares">Valor (US$)</Label>
          <Input
            id="valorDolares"
            type="number"
            step="0.01"
            value={formData.valorAquisicaoDolares}
            onChange={(e) => setFormData({ ...formData, valorAquisicaoDolares: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="valorEuros">Valor (€)</Label>
          <Input
            id="valorEuros"
            type="number"
            step="0.01"
            value={formData.valorAquisicaoEuros}
            onChange={(e) => setFormData({ ...formData, valorAquisicaoEuros: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">
          {item ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
}

export default function PatrimonioPage() {
  return (
    <ProtectedRoute>
      <PatrimonioContent />
    </ProtectedRoute>
  );
}
