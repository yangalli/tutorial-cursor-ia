import { PatrimonioListClient } from "./components/patrimonio-list-client";
import { fetchPatrimonioData } from "@/app/actions/patrimonio";

export default async function PatrimonioPage() {
  const { patrimonios, categorias, escolas } = await fetchPatrimonioData();

  return (
    <PatrimonioListClient
      initialPatrimonios={patrimonios}
      categorias={categorias}
      escolas={escolas}
    />
  )
}
