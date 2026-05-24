import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ secret: string }>;
}

export default async function SubcatPageRedirect({ params }: PageProps) {
  const resolvedParams = await params;
  redirect(`/admin/${resolvedParams.secret}/manage-services?tab=subcategories`);
}
