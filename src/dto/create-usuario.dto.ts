import { IsString, IsNotEmpty, Length, IsEmail, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Código no sistema Mercurio', example: 'USR001' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  codMercurio: string;

  @ApiProperty({ description: 'Nome completo do usuário', example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  nome: string;

  @ApiProperty({ description: 'Email do usuário', example: 'joao@novaacropole.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'senha123' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 255)
  password: string;

  @ApiProperty({ description: 'Role do usuário', enum: UserRole, example: UserRole.USUARIO })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ description: 'Se o usuário está ativo', example: true })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
