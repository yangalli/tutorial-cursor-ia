import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Escola } from './escola.entity';
import { CategoriaPatrimonio } from './categoria-patrimonio.entity';
import { DocumentoPatrimonio } from './documento-patrimonio.entity';

export enum ItemStatus {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  MANUTENCAO = 'manutencao',
  DEPRECIADO = 'depreciado',
  VENDIDO = 'vendido'
}

export enum TipoHistorico {
  AVALIACAO = 'avaliacao',
  MANUTENCAO = 'manutencao',
  DEPRECIACAO = 'depreciacao',
  TRANSFERENCIA = 'transferencia'
}

@Entity('patrimonio')
export class Patrimonio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  escolaId: string;

  @Column({ type: 'uuid' })
  categoriaPatrimonioId: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'date' })
  dataAquisicao: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  valorAquisicaoReais: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  valorAquisicaoDolares: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  valorAquisicaoEuros: number;

  @Column({ type: 'enum', enum: ItemStatus, default: ItemStatus.ATIVO })
  status: ItemStatus;

  @Column({ type: 'jsonb', nullable: true })
  caracteristicas: Record<string, any>;

  @Column({ type: 'jsonb', default: [] })
  historico: Array<{
    data: Date;
    descricao: string;
    valor: number;
    tipo: TipoHistorico;
  }>;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  valorAtual: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => Escola, escola => escola.patrimonio)
  @JoinColumn({ name: 'escolaId' })
  escola: Escola;

  @ManyToOne(() => CategoriaPatrimonio, categoria => categoria.patrimonio)
  @JoinColumn({ name: 'categoriaPatrimonioId' })
  categoriaPatrimonio: CategoriaPatrimonio;

  @OneToMany(() => DocumentoPatrimonio, documento => documento.patrimonio)
  documentos: DocumentoPatrimonio[];
}
