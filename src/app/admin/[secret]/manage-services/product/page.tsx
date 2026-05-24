import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ secret: string }>;
}

export default async function ProductPageRedirect({ params }: PageProps) {
  const resolvedParams = await params;
  redirect(`/admin/${resolvedParams.secret}/manage-services?tab=products`);
}
