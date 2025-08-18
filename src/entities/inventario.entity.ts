import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Escola } from './escola.entity';
import { CategoriaInventario } from './categoria-inventario.entity';
import { DocumentoInventario } from './documento-inventario.entity';
import { ItemStatus, TipoHistorico } from './patrimonio.entity';

@Entity('inventario')
export class Inventario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  escolaId: string;

  @Column({ type: 'uuid' })
  categoriaInventarioId: string;

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
  @ManyToOne(() => Escola, escola => escola.inventario)
  @JoinColumn({ name: 'escolaId' })
  escola: Escola;

  @ManyToOne(() => CategoriaInventario, categoria => categoria.inventario)
  @JoinColumn({ name: 'categoriaInventarioId' })
  categoriaInventario: CategoriaInventario;

  @OneToMany(() => DocumentoInventario, documento => documento.inventario)
  documentos: DocumentoInventario[];
}
