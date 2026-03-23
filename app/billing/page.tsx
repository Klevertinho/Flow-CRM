import { Suspense } from "react";
import BillingClient from "./BillingClient";

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Carregando...</div>}>
      <BillingClient />
    </Suspense>
  );
}