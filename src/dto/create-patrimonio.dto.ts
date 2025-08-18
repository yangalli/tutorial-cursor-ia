import { IsString, IsNotEmpty, Length, IsOptional, IsUUID, IsDateString, IsNumber, IsEnum, IsObject, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ItemStatus, TipoHistorico } from '../entities/patrimonio.entity';

export class CreatePatrimonioDto {
  @ApiProperty({ description: 'ID da escola', example: 'uuid-da-escola' })
  @IsUUID()
  @IsNotEmpty()
  escolaId: string;

  @ApiProperty({ description: 'ID da categoria de patrimônio', example: 'uuid-da-categoria' })
  @IsUUID()
  @IsNotEmpty()
  categoriaPatrimonioId: string;

  @ApiProperty({ description: 'Nome do item', example: 'Computador Dell OptiPlex 7090' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  nome: string;

  @ApiProperty({ description: 'Descrição do item', required: false })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ description: 'Data de aquisição', example: '2023-01-15' })
  @IsDateString()
  @IsNotEmpty()
  dataAquisicao: string;

  @ApiProperty({ description: 'Valor de aquisição em reais', example: 4500.00 })
  @IsNumber()
  @IsNotEmpty()
  valorAquisicaoReais: number;

  @ApiProperty({ description: 'Valor de aquisição em dólares', required: false })
  @IsNumber()
  @IsOptional()
  valorAquisicaoDolares?: number;

  @ApiProperty({ description: 'Valor de aquisição em euros', required: false })
  @IsNumber()
  @IsOptional()
  valorAquisicaoEuros?: number;

  @ApiProperty({ description: 'Status do item', enum: ItemStatus, example: ItemStatus.ATIVO })
  @IsEnum(ItemStatus)
  @IsOptional()
  status?: ItemStatus;

  @ApiProperty({ description: 'Características do item (JSON)', required: false })
  @IsObject()
  @IsOptional()
  caracteristicas?: Record<string, any>;

  @ApiProperty({ description: 'Histórico do item', required: false })
  @IsArray()
  @IsOptional()
  historico?: Array<{
    data: string;
    descricao: string;
    valor: number;
    tipo: TipoHistorico;
  }>;

  @ApiProperty({ description: 'Valor atual do item', example: 3800.00 })
  @IsNumber()
  @IsNotEmpty()
  valorAtual: number;
}
