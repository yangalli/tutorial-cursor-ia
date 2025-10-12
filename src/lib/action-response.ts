/**
 * Tipos padronizados para respostas de Server Actions
 * Garante tratamento consistente de sucesso e erros
 */

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Helper para criar resposta de sucesso
 */
export function successResponse<T>(data: T): ActionResponse<T> {
  return { success: true, data }
}

/**
 * Helper para criar resposta de erro
 */
export function errorResponse(error: string): ActionResponse<never> {
  return { success: false, error }
}

/**
 * Helper para lidar com erros de forma padronizada
 */
export function handleActionError(error: unknown): ActionResponse<never> {
  console.error('Action error:', error)

  if (error instanceof Error) {
    return errorResponse(error.message)
  }

  return errorResponse('Erro inesperado. Tente novamente.')
}

