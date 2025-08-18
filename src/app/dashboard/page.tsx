'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Package,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  School
} from 'lucide-react';

// Dados mockados para o dashboard
const mockStats = {
  totalPatrimonio: 156,
  totalInventario: 89,
  valorTotalPatrimonio: 1250000,
  valorTotalInventario: 450000,
  documentos: 234,
  usuarios: 12,
  escolas: 3,
  itensNovos: 23,
  itensDepreciados: 8,
};

function DashboardContent() {
  const { user, escola } = useAuth();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const statsCards = [
    {
      title: 'Total Patrimônio',
      value: mockStats.totalPatrimonio.toString(),
      description: formatCurrency(mockStats.valorTotalPatrimonio),
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Inventário',
      value: mockStats.totalInventario.toString(),
      description: formatCurrency(mockStats.valorTotalInventario),
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Documentos',
      value: mockStats.documentos.toString(),
      description: 'Arquivos anexados',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Valor Total',
      value: formatCurrency(mockStats.valorTotalPatrimonio + mockStats.valorTotalInventario),
      description: 'Patrimônio + Inventário',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      tipo: 'patrimonio',
      acao: 'Novo item registrado',
      descricao: 'Computador Dell OptiPlex 7090',
      valor: 4500,
      data: '2024-01-15',
    },
    {
      id: 2,
      tipo: 'inventario',
      acao: 'Item atualizado',
      descricao: 'Mesa de escritório',
      valor: 800,
      data: '2024-01-14',
    },
    {
      id: 3,
      tipo: 'patrimonio',
      acao: 'Depreciação aplicada',
      descricao: 'Ar condicionado',
      valor: -1200,
      data: '2024-01-13',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {user?.nome}! Escola: {escola?.nome}
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {user?.role.replace('_', ' ')}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.usuarios}</div>
            <p className="text-xs text-muted-foreground">
              Total de usuários ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escolas</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.escolas}</div>
            <p className="text-xs text-muted-foreground">
              Filiais ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Movimentação</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{mockStats.itensNovos}</div>
            <p className="text-xs text-muted-foreground">
              Itens novos este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>
            Últimas movimentações no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${activity.tipo === 'patrimonio' ? 'bg-blue-50' : 'bg-green-50'
                  }`}>
                  {activity.tipo === 'patrimonio' ? (
                    <Building2 className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Package className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.acao}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.descricao}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${activity.valor >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {activity.valor >= 0 ? '+' : ''}{formatCurrency(activity.valor)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
