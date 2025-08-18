import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';
import { EscolaUsuario } from './escola-usuario.entity';
import { Patrimonio } from './patrimonio.entity';
import { Inventario } from './inventario.entity';

@Entity('escolas')
export class Escola {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  siglaMercurio: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamentos
  @OneToMany(() => EscolaUsuario, escolaUsuario => escolaUsuario.escola)
  escolaUsuarios: EscolaUsuario[];

  @OneToMany(() => Usuario, usuario => usuario.escolas)
  usuarios: Usuario[];

  @OneToMany(() => Patrimonio, patrimonio => patrimonio.escola)
  patrimonio: Patrimonio[];

  @OneToMany(() => Inventario, inventario => inventario.escola)
  inventario: Inventario[];
}
