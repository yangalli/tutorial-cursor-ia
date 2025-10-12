import { z } from "zod"
import { StatusItem } from "@prisma/client"

/**
 * Schema para criação de patrimônio
 */
export const createPatrimonioSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  descricao: z.string().optional(),
  escolaId: z.number().int().positive("Escola é obrigatória"),
  categoriaPatrimonioId: z.number().int().positive("Categoria é obrigatória"),
  dataAquisicao: z.date({
    required_error: "Data de aquisição é obrigatória",
    invalid_type_error: "Data inválida"
  }),
  valorAquisicaoReais: z.number().positive("Valor deve ser maior que zero"),
  valorAtual: z.number().positive().optional(),
  status: z.nativeEnum(StatusItem).default("ativo"),
  caracteristicas: z.record(z.unknown()).optional()
})

/**
 * Schema para atualização de patrimônio
 * Todos os campos são opcionais exceto o ID
 */
export const updatePatrimonioSchema = z.object({
  id: z.number().int().positive("ID inválido"),
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").optional(),
  descricao: z.string().optional(),
  escolaId: z.number().int().positive("Escola é obrigatória").optional(),
  categoriaPatrimonioId: z.number().int().positive("Categoria é obrigatória").optional(),
  dataAquisicao: z.date({
    invalid_type_error: "Data inválida"
  }).optional(),
  valorAquisicaoReais: z.number().positive("Valor deve ser maior que zero").optional(),
  valorAtual: z.number().positive().optional(),
  status: z.nativeEnum(StatusItem).optional(),
  caracteristicas: z.record(z.unknown()).optional()
})

/**
 * Schema para validar ID de patrimônio
 */
export const patrimonioIdSchema = z.number().int().positive("ID inválido")

/**
 * Tipos inferidos dos schemas
 */
export type CreatePatrimonioInput = z.infer<typeof createPatrimonioSchema>
export type UpdatePatrimonioInput = z.infer<typeof updatePatrimonioSchema>

