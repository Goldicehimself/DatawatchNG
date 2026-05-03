import { PhoneAuth } from "@/components/product/phone-auth";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const initialMode = params.mode === "signin" ? "signin" : "create";

  return <PhoneAuth initialMode={initialMode} />;
}
