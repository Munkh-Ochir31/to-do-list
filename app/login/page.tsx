import { redirect } from "next/navigation";
import { readSession } from "../lib/session";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  // Хэрэв аль хэдийн нэвтэрсэн бол үндсэн хуудас руу буцаана.
  const session = await readSession();
  if (session) {
    redirect("/");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: 14,
          padding: 28,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "#0a0a0a",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h1
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#0a0a0a",
                letterSpacing: "-0.02em",
              }}
            >
              Нэвтрэх
            </h1>
            <p style={{ fontSize: 12, color: "#a3a3a3", marginTop: 2 }}>
              Хөнжүүлэх систем · Даалгаврын модуль
            </p>
          </div>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
