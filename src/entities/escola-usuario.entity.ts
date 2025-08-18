import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Escola } from './escola.entity';
import { Usuario } from './usuario.entity';

export enum NivelAcesso {
  ADMIN = 'admin',
  SECRETARIO = 'secretario',
  CHEFE_DE_FILIAL = 'chefe_de_filial',
  USUARIO = 'usuario'
}

@Entity('escola_usuarios')
export class EscolaUsuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  escolaId: string;

  @Column({ type: 'uuid' })
  usuarioId: string;

  @Column({ type: 'enum', enum: NivelAcesso, default: NivelAcesso.USUARIO })
  nivelAcesso: NivelAcesso;

  @CreateDateColumn()
  createdAt: Date;

  // Relacionamentos
  @ManyToOne(() => Escola, escola => escola.escolaUsuarios)
  @JoinColumn({ name: 'escolaId' })
  escola: Escola;

  @ManyToOne(() => Usuario, usuario => usuario.escolaUsuarios)
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;
}
