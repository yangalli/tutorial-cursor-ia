import { PatrimonioListClient } from "./components/patrimonio-list-client"
import { fetchPatrimonioData } from "@/lib/actions/patrimonio"

/**
 * Página de Patrimônio - Server Component
 * Carrega dados do servidor e passa para o Client Component
 */
export default async function PatrimonioPage() {
  const result = await fetchPatrimonioData()

  // Se houver erro, mostrar mensagem
  if (!result.success) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Erro ao carregar dados</h2>
          <p className="text-gray-600">{result.error}</p>
        </div>
      </div>
    )
  }

  const { patrimonios, categorias, escolas } = result.data

  return (
    <PatrimonioListClient
      initialPatrimonios={patrimonios}
      categorias={categorias}
      escolas={escolas}
    />
  )
}
