import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Escola } from './escola.entity';
import { EscolaUsuario } from './escola-usuario.entity';

export enum UserRole {
  ADMIN = 'admin',
  SECRETARIO = 'secretario',
  CHEFE_DE_FILIAL = 'chefe_de_filial',
  USUARIO = 'usuario'
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  codMercurio: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USUARIO })
  role: UserRole;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamentos
  @ManyToMany(() => Escola, escola => escola.usuarios)
  @JoinTable({
    name: 'escola_usuarios',
    joinColumn: { name: 'usuarioId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'escolaId', referencedColumnName: 'id' }
  })
  escolas: Escola[];

  @OneToMany(() => EscolaUsuario, escolaUsuario => escolaUsuario.usuario)
  escolaUsuarios: EscolaUsuario[];
}
