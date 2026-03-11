import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import * as OperationService from "@/services/operation.service";
import { OperacoesClient } from "./_components/operacoes-client";

const PAGE_LIMIT = 10;

export default async function OperacoesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const params = await searchParams;
  const searchParam = params.search ?? "";
  const statusParam = params.status ?? "active";
  const currentPage = parseInt(params.page ?? "1", 10);

  const { data: operations, pagination } =
    await OperationService.getAllPaginated(
      session.userId,
      currentPage,
      PAGE_LIMIT,
      searchParam || undefined,
      statusParam,
    );

  return (
    <OperacoesClient
      operations={operations}
      pagination={pagination}
      searchParam={searchParam}
      statusParam={statusParam}
      currentPage={currentPage}
    />
  );
}
