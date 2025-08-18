import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Patrimonio } from './patrimonio.entity';

@Entity('categorias_patrimonio')
export class CategoriaPatrimonio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'int', comment: 'Tempo de depreciação em meses' })
  tempoDepreciacao: number;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamentos
  @OneToMany(() => Patrimonio, patrimonio => patrimonio.categoriaPatrimonio)
  patrimonio: Patrimonio[];
}
