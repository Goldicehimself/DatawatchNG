import { Suspense } from "react";
import { PhoneAuth } from "@/components/product/phone-auth";

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <PhoneAuth />
    </Suspense>
  );
}
