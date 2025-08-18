import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patrimonio } from './patrimonio.entity';

@Entity('documentos_patrimonio')
export class DocumentoPatrimonio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  patrimonioId: string;

  @Column({ type: 'varchar', length: 255 })
  descricao: string;

  @Column({ type: 'varchar', length: 255 })
  nomeArquivo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  urlArquivo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tipoArquivo: string;

  @Column({ type: 'int', nullable: true })
  tamanhoArquivo: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => Patrimonio, patrimonio => patrimonio.documentos)
  @JoinColumn({ name: 'patrimonioId' })
  patrimonio: Patrimonio;
}
