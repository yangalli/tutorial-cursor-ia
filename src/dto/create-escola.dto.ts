import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEscolaDto {
  @ApiProperty({ description: 'Nome da escola', example: 'Nova Acrópole - São Paulo' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  nome: string;

  @ApiProperty({ description: 'Sigla no sistema Mercurio', example: 'NA-SP' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  siglaMercurio: string;

  @ApiProperty({ description: 'Endereço da escola', required: false })
  @IsString()
  @IsOptional()
  endereco?: string;

  @ApiProperty({ description: 'Telefone da escola', required: false })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiProperty({ description: 'Email da escola', required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Nome do diretor', required: false })
  @IsString()
  @IsOptional()
  diretor?: string;
}
