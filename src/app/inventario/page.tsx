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
import { Plus, Search, Edit, Trash2, Eye, Package } from 'lucide-react';
import { Inventario, ItemStatus } from '@/types';

// Dados mockados para demonstração
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
    caracteristicas: {
      material: 'Madeira MDF',
      dimensoes: '120x60x75cm',
      cor: 'Marrom',
      gavetas: 3
    },
    historico: [
      {
        data: new Date('2023-03-20'),
        descricao: 'Aquisição inicial',
        valor: 800,
        tipo: 'avaliacao'
      }
    ],
    valorAtual: 750,
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-03-20'),
    categoriaInventario: {
      id: '1',
      nome: 'Mobiliário',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    }
  },
  {
    id: '2',
    escolaId: '1',
    categoriaInventarioId: '2',
    nome: 'Projetor Epson',
    descricao: 'Projetor para apresentações',
    dataAquisicao: new Date('2023-02-15'),
    valorAquisicaoReais: 2500,
    valorAquisicaoDolares: 500,
    valorAquisicaoEuros: 450,
    status: 'ativo',
    caracteristicas: {
      resolucao: '1920x1080',
      lumens: 3500,
      marca: 'Epson',
      tipo: 'LCD'
    },
    historico: [
      {
        data: new Date('2023-02-15'),
        descricao: 'Aquisição inicial',
        valor: 2500,
        tipo: 'avaliacao'
      }
    ],
    valorAtual: 2200,
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-15'),
    categoriaInventario: {
      id: '2',
      nome: 'Equipamentos Audiovisuais',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
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

function InventarioContent() {
  const [inventario, setInventario] = useState<Inventario[]>(mockInventario);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Inventario | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const filteredInventario = inventario.filter(item => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (formData: Partial<Inventario>) => {
    const newItem: Inventario = {
      id: Date.now().toString(),
      escolaId: '1',
      categoriaInventarioId: formData.categoriaInventarioId || '1',
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
      categoriaInventario: {
        id: '1',
        nome: 'Mobiliário',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    setInventario([newItem, ...inventario]);
    setIsCreateDialogOpen(false);
  };

  const handleEdit = (item: Inventario) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (formData: Partial<Inventario>) => {
    if (!editingItem) return;

    const updatedItem = { ...editingItem, ...formData, updatedAt: new Date() };
    setInventario(inventario.map(item =>
      item.id === editingItem.id ? updatedItem : item
    ));
    setIsEditDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      setInventario(inventario.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventário</h1>
          <p className="text-muted-foreground">
            Gerencie os itens de inventário da escola
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
              <DialogTitle>Novo Item de Inventário</DialogTitle>
              <DialogDescription>
                Adicione um novo item ao inventário da escola
              </DialogDescription>
            </DialogHeader>
            <InventarioForm onSubmit={handleCreate} />
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
          <CardTitle>Itens de Inventário</CardTitle>
          <CardDescription>
            {filteredInventario.length} itens encontrados
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
              {filteredInventario.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.nome}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.descricao}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.categoriaInventario?.nome}</TableCell>
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
            <DialogTitle>Editar Item de Inventário</DialogTitle>
            <DialogDescription>
              Edite as informações do item selecionado
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <InventarioForm
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
interface InventarioFormProps {
  item?: Inventario;
  onSubmit: (data: Partial<Inventario>) => void;
}

function InventarioForm({ item, onSubmit }: InventarioFormProps) {
  const [formData, setFormData] = useState({
    nome: item?.nome || '',
    descricao: item?.descricao || '',
    categoriaInventarioId: item?.categoriaInventarioId || '1',
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
            value={formData.categoriaInventarioId}
            onValueChange={(value) => setFormData({ ...formData, categoriaInventarioId: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Mobiliário</SelectItem>
              <SelectItem value="2">Equipamentos Audiovisuais</SelectItem>
              <SelectItem value="3">Material de Escritório</SelectItem>
              <SelectItem value="4">Livros e Materiais Didáticos</SelectItem>
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

export default function InventarioPage() {
  return (
    <ProtectedRoute>
      <InventarioContent />
    </ProtectedRoute>
  );
}
