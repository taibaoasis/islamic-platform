import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { UserProfileView } from "@/components/admin/users/user-profile-view";
import { getUserById, mockAdminUsers } from "@/lib/mock/admin-users";
import { siteConfig, type Locale } from "@/config/site";

export function generateStaticParams() {
  return mockAdminUsers.map((u) => ({ userId: u.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; userId: string }>;
}): Promise<Metadata> {
  const { userId } = await params;
  const user = getUserById(userId);
  if (!user) return {};
  return { title: `${user.name} — ${siteConfig.name}` };
}

export default async function AdminUserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = getUserById(userId);
  if (!user) notFound();

  return <UserProfileView user={user} />;
}
