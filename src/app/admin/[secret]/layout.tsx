// src/app/admin/[secret]/layout.tsx
import { notFound } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminLayoutClient from "./AdminLayoutClient";

export const dynamic = "force-dynamic";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ secret: string }>;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const resolvedParams = await params;
  const { secret } = resolvedParams;

  // Block any layout render with wrong secret path
  if (secret !== process.env.ADMIN_SECRET_PATH) {
    notFound();
  }

  const user = await isAuthenticated();

  // If not logged in, just render children directly (e.g. LoginForm)
  // The middleware handles redirecting unauthenticated traffic to login page
  if (!user) {
    return <>{children}</>;
  }

  return (
    <AdminLayoutClient secret={secret}>
      {children}
    </AdminLayoutClient>
  );
}