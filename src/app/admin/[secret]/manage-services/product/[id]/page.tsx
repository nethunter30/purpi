import Formproduct from "./Formproduct";

interface PageProps {
  params: Promise<{
    secret: string;
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductEditPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { secret, id } = resolvedParams;
  const subcat = typeof resolvedSearchParams.subcat === "string" ? resolvedSearchParams.subcat : undefined;

  return <Formproduct id={id} secret={secret} initialSubcat={subcat} />;
}
