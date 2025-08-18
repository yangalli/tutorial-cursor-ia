import { createClient } from '@supabase/supabase-js';
import { Patrimonio, Inventario, Escola, User } from '@/types';

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas do Supabase
export interface Database {
  public: {
    Tables: {
      escolas: {
        Row: {
          id: string;
          nome: string;
          endereco: string;
          telefone: string;
          email: string;
          diretor: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          endereco: string;
          telefone: string;
          email: string;
          diretor: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          endereco?: string;
          telefone?: string;
          email?: string;
          diretor?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      usuarios: {
        Row: {
          id: string;
          nome: string;
          email: string;
          role: string;
          escola_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          email: string;
          role: string;
          escola_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          email?: string;
          role?: string;
          escola_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      patrimonio: {
        Row: {
          id: string;
          escola_id: string;
          categoria_patrimonio_id: string;
          nome: string;
          descricao: string;
          data_aquisicao: string;
          valor_aquisicao_reais: number;
          valor_aquisicao_dolares: number;
          valor_aquisicao_euros: number;
          status: string;
          caracteristicas: any;
          historico: any;
          valor_atual: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          escola_id: string;
          categoria_patrimonio_id: string;
          nome: string;
          descricao: string;
          data_aquisicao: string;
          valor_aquisicao_reais: number;
          valor_aquisicao_dolares: number;
          valor_aquisicao_euros: number;
          status: string;
          caracteristicas?: any;
          historico?: any;
          valor_atual: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          escola_id?: string;
          categoria_patrimonio_id?: string;
          nome?: string;
          descricao?: string;
          data_aquisicao?: string;
          valor_aquisicao_reais?: number;
          valor_aquisicao_dolares?: number;
          valor_aquisicao_euros?: number;
          status?: string;
          caracteristicas?: any;
          historico?: any;
          valor_atual?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      inventario: {
        Row: {
          id: string;
          escola_id: string;
          categoria_inventario_id: string;
          nome: string;
          descricao: string;
          data_aquisicao: string;
          valor_aquisicao_reais: number;
          valor_aquisicao_dolares: number;
          valor_aquisicao_euros: number;
          status: string;
          caracteristicas: any;
          historico: any;
          valor_atual: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          escola_id: string;
          categoria_inventario_id: string;
          nome: string;
          descricao: string;
          data_aquisicao: string;
          valor_aquisicao_reais: number;
          valor_aquisicao_dolares: number;
          valor_aquisicao_euros: number;
          status: string;
          caracteristicas?: any;
          historico?: any;
          valor_atual: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          escola_id?: string;
          categoria_inventario_id?: string;
          nome?: string;
          descricao?: string;
          data_aquisicao?: string;
          valor_aquisicao_reais?: number;
          valor_aquisicao_dolares?: number;
          valor_aquisicao_euros?: number;
          status?: string;
          caracteristicas?: any;
          historico?: any;
          valor_atual?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Funções de sincronização para escolas
export const syncEscolas = async (): Promise<Escola[]> => {
  try {
    const { data, error } = await supabase
      .from('escolas')
      .select('*')
      .order('nome');

    if (error) throw error;

    return data.map(escola => ({
      id: escola.id,
      nome: escola.nome,
      endereco: escola.endereco,
      telefone: escola.telefone,
      email: escola.email,
      diretor: escola.diretor,
      createdAt: new Date(escola.created_at),
      updatedAt: new Date(escola.updated_at)
    }));
  } catch (error) {
    console.error('Erro ao sincronizar escolas:', error);
    return [];
  }
};

// Funções de sincronização para usuários
export const syncUsuarios = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nome');

    if (error) throw error;

    return data.map(usuario => ({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role as any,
      escolaId: usuario.escola_id,
      createdAt: new Date(usuario.created_at),
      updatedAt: new Date(usuario.updated_at)
    }));
  } catch (error) {
    console.error('Erro ao sincronizar usuários:', error);
    return [];
  }
};

// Funções CRUD para patrimônio
export const getPatrimonio = async (escolaId?: string): Promise<Patrimonio[]> => {
  try {
    let query = supabase.from('patrimonio').select('*');
    
    if (escolaId) {
      query = query.eq('escola_id', escolaId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      escolaId: item.escola_id,
      categoriaPatrimonioId: item.categoria_patrimonio_id,
      nome: item.nome,
      descricao: item.descricao,
      dataAquisicao: new Date(item.data_aquisicao),
      valorAquisicaoReais: item.valor_aquisicao_reais,
      valorAquisicaoDolares: item.valor_aquisicao_dolares,
      valorAquisicaoEuros: item.valor_aquisicao_euros,
      status: item.status as any,
      caracteristicas: item.caracteristicas || {},
      historico: item.historico || [],
      valorAtual: item.valor_atual,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      categoriaPatrimonio: {
        id: item.categoria_patrimonio_id,
        nome: 'Categoria',
        tempoDepreciacao: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }));
  } catch (error) {
    console.error('Erro ao buscar patrimônio:', error);
    return [];
  }
};

export const createPatrimonio = async (patrimonio: Omit<Patrimonio, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patrimonio | null> => {
  try {
    const { data, error } = await supabase
      .from('patrimonio')
      .insert({
        escola_id: patrimonio.escolaId,
        categoria_patrimonio_id: patrimonio.categoriaPatrimonioId,
        nome: patrimonio.nome,
        descricao: patrimonio.descricao,
        data_aquisicao: patrimonio.dataAquisicao.toISOString(),
        valor_aquisicao_reais: patrimonio.valorAquisicaoReais,
        valor_aquisicao_dolares: patrimonio.valorAquisicaoDolares,
        valor_aquisicao_euros: patrimonio.valorAquisicaoEuros,
        status: patrimonio.status,
        caracteristicas: patrimonio.caracteristicas,
        historico: patrimonio.historico,
        valor_atual: patrimonio.valorAtual
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      escolaId: data.escola_id,
      categoriaPatrimonioId: data.categoria_patrimonio_id,
      nome: data.nome,
      descricao: data.descricao,
      dataAquisicao: new Date(data.data_aquisicao),
      valorAquisicaoReais: data.valor_aquisicao_reais,
      valorAquisicaoDolares: data.valor_aquisicao_dolares,
      valorAquisicaoEuros: data.valor_aquisicao_euros,
      status: data.status as any,
      caracteristicas: data.caracteristicas || {},
      historico: data.historico || [],
      valorAtual: data.valor_atual,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      categoriaPatrimonio: {
        id: data.categoria_patrimonio_id,
        nome: 'Categoria',
        tempoDepreciacao: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
  } catch (error) {
    console.error('Erro ao criar patrimônio:', error);
    return null;
  }
};

export const updatePatrimonio = async (id: string, updates: Partial<Patrimonio>): Promise<Patrimonio | null> => {
  try {
    const updateData: any = {};
    
    if (updates.nome !== undefined) updateData.nome = updates.nome;
    if (updates.descricao !== undefined) updateData.descricao = updates.descricao;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.valorAtual !== undefined) updateData.valor_atual = updates.valorAtual;
    if (updates.caracteristicas !== undefined) updateData.caracteristicas = updates.caracteristicas;
    if (updates.historico !== undefined) updateData.historico = updates.historico;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('patrimonio')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      escolaId: data.escola_id,
      categoriaPatrimonioId: data.categoria_patrimonio_id,
      nome: data.nome,
      descricao: data.descricao,
      dataAquisicao: new Date(data.data_aquisicao),
      valorAquisicaoReais: data.valor_aquisicao_reais,
      valorAquisicaoDolares: data.valor_aquisicao_dolares,
      valorAquisicaoEuros: data.valor_aquisicao_euros,
      status: data.status as any,
      caracteristicas: data.caracteristicas || {},
      historico: data.historico || [],
      valorAtual: data.valor_atual,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      categoriaPatrimonio: {
        id: data.categoria_patrimonio_id,
        nome: 'Categoria',
        tempoDepreciacao: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
  } catch (error) {
    console.error('Erro ao atualizar patrimônio:', error);
    return null;
  }
};

export const deletePatrimonio = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('patrimonio')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao deletar patrimônio:', error);
    return false;
  }
};

// Funções CRUD para inventário
export const getInventario = async (escolaId?: string): Promise<Inventario[]> => {
  try {
    let query = supabase.from('inventario').select('*');
    
    if (escolaId) {
      query = query.eq('escola_id', escolaId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      escolaId: item.escola_id,
      categoriaInventarioId: item.categoria_inventario_id,
      nome: item.nome,
      descricao: item.descricao,
      dataAquisicao: new Date(item.data_aquisicao),
      valorAquisicaoReais: item.valor_aquisicao_reais,
      valorAquisicaoDolares: item.valor_aquisicao_dolares,
      valorAquisicaoEuros: item.valor_aquisicao_euros,
      status: item.status as any,
      caracteristicas: item.caracteristicas || {},
      historico: item.historico || [],
      valorAtual: item.valor_atual,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      categoriaInventario: {
        id: item.categoria_inventario_id,
        nome: 'Categoria',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }));
  } catch (error) {
    console.error('Erro ao buscar inventário:', error);
    return [];
  }
};

export const createInventario = async (inventario: Omit<Inventario, 'id' | 'createdAt' | 'updatedAt'>): Promise<Inventario | null> => {
  try {
    const { data, error } = await supabase
      .from('inventario')
      .insert({
        escola_id: inventario.escolaId,
        categoria_inventario_id: inventario.categoriaInventarioId,
        nome: inventario.nome,
        descricao: inventario.descricao,
        data_aquisicao: inventario.dataAquisicao.toISOString(),
        valor_aquisicao_reais: inventario.valorAquisicaoReais,
        valor_aquisicao_dolares: inventario.valorAquisicaoDolares,
        valor_aquisicao_euros: inventario.valorAquisicaoEuros,
        status: inventario.status,
        caracteristicas: inventario.caracteristicas,
        historico: inventario.historico,
        valor_atual: inventario.valorAtual
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      escolaId: data.escola_id,
      categoriaInventarioId: data.categoria_inventario_id,
      nome: data.nome,
      descricao: data.descricao,
      dataAquisicao: new Date(data.data_aquisicao),
      valorAquisicaoReais: data.valor_aquisicao_reais,
      valorAquisicaoDolares: data.valor_aquisicao_dolares,
      valorAquisicaoEuros: data.valor_aquisicao_euros,
      status: data.status as any,
      caracteristicas: data.caracteristicas || {},
      historico: data.historico || [],
      valorAtual: data.valor_atual,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      categoriaInventario: {
        id: data.categoria_inventario_id,
        nome: 'Categoria',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
  } catch (error) {
    console.error('Erro ao criar inventário:', error);
    return null;
  }
};

export const updateInventario = async (id: string, updates: Partial<Inventario>): Promise<Inventario | null> => {
  try {
    const updateData: any = {};
    
    if (updates.nome !== undefined) updateData.nome = updates.nome;
    if (updates.descricao !== undefined) updateData.descricao = updates.descricao;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.valorAtual !== undefined) updateData.valor_atual = updates.valorAtual;
    if (updates.caracteristicas !== undefined) updateData.caracteristicas = updates.caracteristicas;
    if (updates.historico !== undefined) updateData.historico = updates.historico;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('inventario')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      escolaId: data.escola_id,
      categoriaInventarioId: data.categoria_inventario_id,
      nome: data.nome,
      descricao: data.descricao,
      dataAquisicao: new Date(data.data_aquisicao),
      valorAquisicaoReais: data.valor_aquisicao_reais,
      valorAquisicaoDolares: data.valor_aquisicao_dolares,
      valorAquisicaoEuros: data.valor_aquisicao_euros,
      status: data.status as any,
      caracteristicas: data.caracteristicas || {},
      historico: data.historico || [],
      valorAtual: data.valor_atual,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      categoriaInventario: {
        id: data.categoria_inventario_id,
        nome: 'Categoria',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
  } catch (error) {
    console.error('Erro ao atualizar inventário:', error);
    return null;
  }
};

export const deleteInventario = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('inventario')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao deletar inventário:', error);
    return false;
  }
};

// Função para sincronizar dados externos
export const syncExternalData = async () => {
  try {
    // Aqui você implementaria a lógica para sincronizar com o sistema externo
    // Por enquanto, retornamos um status de sucesso
    console.log('Sincronizando dados externos...');
    
    // Simular delay de sincronização
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      message: 'Dados sincronizados com sucesso',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro na sincronização:', error);
    return {
      success: false,
      message: 'Erro na sincronização',
      timestamp: new Date().toISOString()
    };
  }
};
