'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Escola } from '@/types';

// Dados mockados para teste
const mockUsers: User[] = [
  {
    id: '1',
    codMercurio: 'ADM001',
    nome: 'Administrador',
    email: 'admin@novaacropole.com',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    codMercurio: 'SEC001',
    nome: 'Secretário',
    email: 'secretario@novaacropole.com',
    role: 'secretario',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    codMercurio: 'CHE001',
    nome: 'Chefe de Filial',
    email: 'chefe@novaacropole.com',
    role: 'chefe_de_filial',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    codMercurio: 'USR001',
    nome: 'Usuário',
    email: 'usuario@novaacropole.com',
    role: 'usuario',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockEscolas: Escola[] = [
  {
    id: '1',
    nome: 'Nova Acrópole - São Paulo',
    siglaMercurio: 'NA-SP',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    nome: 'Nova Acrópole - Rio de Janeiro',
    siglaMercurio: 'NA-RJ',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Buscar usuário mockado
      const user = mockUsers.find(u => u.email === email);

      if (!user) {
        setError('Usuário não encontrado');
        return;
      }

      // Simular verificação de senha (qualquer senha funciona para teste)
      if (password.length < 3) {
        setError('Senha deve ter pelo menos 3 caracteres');
        return;
      }

      // Selecionar escola (para teste, sempre usar a primeira)
      const escola = mockEscolas[0];

      // Fazer login
      login(user, escola);

      // Redirecionar para dashboard
      router.push('/dashboard');

    } catch (err) {
      setError('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-2xl font-bold">NA</span>
          </div>
          <CardTitle className="text-2xl">Nova Acrópole</CardTitle>
          <CardDescription>
            Sistema de Gestão de Patrimônio
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          {/* Informações para teste */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-2">Usuários para teste:</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              {mockUsers.map((user) => (
                <div key={user.id}>
                  <strong>{user.role}:</strong> {user.email} (senha: qualquer)
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
