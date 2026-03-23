"use client";

import { useEffect } from "react";
import { createClient } from "../../lib/supabase/client";

export default function LogoutPage() {
  useEffect(() => {
    async function doLogout() {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/login";
    }

    void doLogout();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#020617",
        color: "#f8fafc",
        fontSize: 18,
        fontWeight: 700,
      }}
    >
      Saindo da conta...
    </div>
  );
}