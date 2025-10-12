"use client"

import { useState, useEffect } from "react"

/**
 * Hook para buscar dados iniciais de patrimônio
 * Usado em Client Components que precisam dos dados
 */
export function usePatrimonioData() {
  const [patrimonios, setPatrimonios] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [escolas, setEscolas] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)

        const [patrimoniosRes, categoriasRes, escolasRes] = await Promise.all([
          fetch('/api/patrimonio'),
          fetch('/api/categorias-patrimonio'),
          fetch('/api/escolas')
        ])

        if (!patrimoniosRes.ok || !categoriasRes.ok || !escolasRes.ok) {
          throw new Error('Erro ao buscar dados')
        }

        const [patrimoniosData, categoriasData, escolasData] = await Promise.all([
          patrimoniosRes.json(),
          categoriasRes.json(),
          escolasRes.json()
        ])

        setPatrimonios(patrimoniosData)
        setCategorias(categoriasData)
        setEscolas(escolasData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    patrimonios,
    categorias,
    escolas,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true)
      // Trigger useEffect again
    }
  }
}

