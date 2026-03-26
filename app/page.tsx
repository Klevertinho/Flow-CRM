import { Suspense } from "react";
import LandingClientPage from "./landing-client-page";

export default function HomePage() {
  return (
    <Suspense fallback={<LandingLoadingFallback />}>
      <LandingClientPage />
    </Suspense>
  );
}

function LandingLoadingFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        color: "#f8fafc",
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.16) 0%, rgba(15,23,42,0.98) 30%, #020617 70%, #01030a 100%)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          color: "rgba(255,255,255,0.68)",
          fontWeight: 800,
          fontSize: 16,
        }}
      >
        Carregando VALORA...
      </div>
    </div>
  );
}