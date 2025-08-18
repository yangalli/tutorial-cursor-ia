import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EscolaService } from '../services/escola.service';
import { CreateEscolaDto } from '../dto/create-escola.dto';
import { UpdateEscolaDto } from '../dto/update-escola.dto';
import { Escola } from '../entities/escola.entity';

@ApiTags('Escolas')
@Controller('escolas')
export class EscolaController {
  constructor(private readonly escolaService: EscolaService) { }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova escola' })
  @ApiResponse({ status: 201, description: 'Escola criada com sucesso', type: Escola })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Sigla Mercurio já existe' })
  create(@Body() createEscolaDto: CreateEscolaDto): Promise<Escola> {
    return this.escolaService.create(createEscolaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as escolas' })
  @ApiResponse({ status: 200, description: 'Lista de escolas retornada com sucesso', type: [Escola] })
  @ApiQuery({ name: 'orderBy', required: false, description: 'Ordenar por: nome, siglaMercurio' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nome ou sigla' })
  findAll(
    @Query('orderBy') orderBy?: string,
    @Query('search') search?: string
  ): Promise<Escola[]> {
    return this.escolaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar escola por ID' })
  @ApiResponse({ status: 200, description: 'Escola encontrada com sucesso', type: Escola })
  @ApiResponse({ status: 404, description: 'Escola não encontrada' })
  findOne(@Param('id') id: string): Promise<Escola> {
    return this.escolaService.findOne(id);
  }

  @Get('sigla/:siglaMercurio')
  @ApiOperation({ summary: 'Buscar escola por sigla Mercurio' })
  @ApiResponse({ status: 200, description: 'Escola encontrada com sucesso', type: Escola })
  @ApiResponse({ status: 404, description: 'Escola não encontrada' })
  findBySigla(@Param('siglaMercurio') siglaMercurio: string): Promise<Escola> {
    return this.escolaService.findBySiglaMercurio(siglaMercurio);
  }

  @Get(':id/estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas da escola' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas com sucesso' })
  @ApiResponse({ status: 404, description: 'Escola não encontrada' })
  getEstatisticas(@Param('id') id: string) {
    return this.escolaService.getEstatisticas(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar escola' })
  @ApiResponse({ status: 200, description: 'Escola atualizada com sucesso', type: Escola })
  @ApiResponse({ status: 404, description: 'Escola não encontrada' })
  @ApiResponse({ status: 409, description: 'Sigla Mercurio já existe' })
  update(@Param('id') id: string, @Body() updateEscolaDto: UpdateEscolaDto): Promise<Escola> {
    return this.escolaService.update(id, updateEscolaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir escola' })
  @ApiResponse({ status: 200, description: 'Escola excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Escola não encontrada' })
  @ApiResponse({ status: 409, description: 'Não é possível excluir escola com patrimônio/inventário/usuários' })
  remove(@Param('id') id: string): Promise<void> {
    return this.escolaService.remove(id);
  }
}
