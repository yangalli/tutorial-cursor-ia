import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Escola } from '../entities/escola.entity';
import { CreateEscolaDto } from '../dto/create-escola.dto';
import { UpdateEscolaDto } from '../dto/update-escola.dto';

@Injectable()
export class EscolaService {
  constructor(
    @InjectRepository(Escola)
    private escolaRepository: Repository<Escola>,
  ) { }

  async create(createEscolaDto: CreateEscolaDto): Promise<Escola> {
    // Verificar se já existe uma escola com a mesma sigla
    const existingEscola = await this.escolaRepository.findOne({
      where: { siglaMercurio: createEscolaDto.siglaMercurio }
    });

    if (existingEscola) {
      throw new ConflictException('Já existe uma escola com esta sigla Mercurio');
    }

    const escola = this.escolaRepository.create(createEscolaDto);
    return await this.escolaRepository.save(escola);
  }

  async findAll(): Promise<Escola[]> {
    return await this.escolaRepository.find({
      order: { nome: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Escola> {
    const escola = await this.escolaRepository.findOne({
      where: { id },
      relations: ['patrimonio', 'inventario', 'usuarios']
    });

    if (!escola) {
      throw new NotFoundException(`Escola com ID ${id} não encontrada`);
    }

    return escola;
  }

  async findBySiglaMercurio(siglaMercurio: string): Promise<Escola> {
    const escola = await this.escolaRepository.findOne({
      where: { siglaMercurio }
    });

    if (!escola) {
      throw new NotFoundException(`Escola com sigla ${siglaMercurio} não encontrada`);
    }

    return escola;
  }

  async update(id: string, updateEscolaDto: UpdateEscolaDto): Promise<Escola> {
    const escola = await this.findOne(id);

    // Se estiver alterando a sigla, verificar se não conflita
    if (updateEscolaDto.siglaMercurio && updateEscolaDto.siglaMercurio !== escola.siglaMercurio) {
      const existingEscola = await this.escolaRepository.findOne({
        where: { siglaMercurio: updateEscolaDto.siglaMercurio }
      });

      if (existingEscola) {
        throw new ConflictException('Já existe uma escola com esta sigla Mercurio');
      }
    }

    Object.assign(escola, updateEscolaDto);
    return await this.escolaRepository.save(escola);
  }

  async remove(id: string): Promise<void> {
    const escola = await this.findOne(id);

    // Verificar se a escola tem patrimônio ou inventário
    if (escola.patrimonio && escola.patrimonio.length > 0) {
      throw new ConflictException('Não é possível excluir uma escola que possui patrimônio');
    }

    if (escola.inventario && escola.inventario.length > 0) {
      throw new ConflictException('Não é possível excluir uma escola que possui inventário');
    }

    if (escola.usuarios && escola.usuarios.length > 0) {
      throw new ConflictException('Não é possível excluir uma escola que possui usuários');
    }

    await this.escolaRepository.remove(escola);
  }

  async getEstatisticas(id: string): Promise<any> {
    const escola = await this.escolaRepository.findOne({
      where: { id },
      relations: ['patrimonio', 'inventario']
    });

    if (!escola) {
      throw new NotFoundException(`Escola com ID ${id} não encontrada`);
    }

    const totalPatrimonio = escola.patrimonio?.reduce((sum, item) => sum + Number(item.valorAtual), 0) || 0;
    const totalInventario = escola.inventario?.reduce((sum, item) => sum + Number(item.valorAtual), 0) || 0;

    return {
      escola: {
        id: escola.id,
        nome: escola.nome,
        siglaMercurio: escola.siglaMercurio
      },
      estatisticas: {
        totalPatrimonio,
        totalInventario,
        valorTotal: totalPatrimonio + totalInventario,
        quantidadePatrimonio: escola.patrimonio?.length || 0,
        quantidadeInventario: escola.inventario?.length || 0
      }
    };
  }
}
