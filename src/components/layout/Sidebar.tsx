'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Package, 
  FileText, 
  BarChart3, 
  Settings, 
  Users, 
  LogOut,
  Home,
  Shield,
  ClipboardList
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['admin', 'secretario', 'chefe_de_filial', 'usuario'],
  },
  {
    label: 'Patrimônio',
    href: '/patrimonio',
    icon: Building2,
    roles: ['admin', 'secretario', 'chefe_de_filial', 'usuario'],
  },
  {
    label: 'Inventário',
    href: '/inventario',
    icon: Package,
    roles: ['admin', 'secretario', 'chefe_de_filial', 'usuario'],
  },
  {
    label: 'Categorias',
    href: '/categorias',
    icon: ClipboardList,
    roles: ['admin', 'secretario'],
  },
  {
    label: 'Documentos',
    href: '/documentos',
    icon: FileText,
    roles: ['admin', 'secretario', 'chefe_de_filial'],
  },
  {
    label: 'Relatórios',
    href: '/relatorios',
    icon: BarChart3,
    roles: ['admin', 'secretario', 'chefe_de_filial'],
  },
  {
    label: 'Usuários',
    href: '/usuarios',
    icon: Users,
    roles: ['admin'],
  },
  {
    label: 'Escolas',
    href: '/escolas',
    icon: Shield,
    roles: ['admin'],
  },
  {
    label: 'Configurações',
    href: '/configuracoes',
    icon: Settings,
    roles: ['admin'],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const filteredItems = sidebarItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">NA</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Nova Acrópole</span>
            <span className="text-xs text-muted-foreground">Patrimônio</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-sm font-medium">
              {user.nome.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.nome}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {user.role.replace('_', ' ')}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
}
