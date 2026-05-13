"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions/auth";

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #e5e5e5",
  borderRadius: 8,
  fontFamily: "var(--font-dm-sans), sans-serif",
  fontSize: 14,
  color: "#0a0a0a",
  background: "#fff",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  color: "#525252",
  marginBottom: 6,
  fontWeight: 500,
};

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState | undefined, FormData>(
    login,
    undefined
  );

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label htmlFor="username" style={labelStyle}>Хэрэглэгчийн нэр</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          maxLength={50}
          placeholder="admin"
          style={fieldStyle}
        />
        {state?.fieldErrors?.username && (
          <p style={{ fontSize: 12, color: "#b91c1c", marginTop: 4 }}>
            {state.fieldErrors.username}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" style={labelStyle}>Нууц үг</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={200}
          placeholder="••••••••"
          style={fieldStyle}
        />
        {state?.fieldErrors?.password && (
          <p style={{ fontSize: 12, color: "#b91c1c", marginTop: 4 }}>
            {state.fieldErrors.password}
          </p>
        )}
      </div>

      {state?.error && (
        <div
          role="alert"
          style={{
            padding: "10px 12px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 8,
            fontSize: 13,
            color: "#b91c1c",
          }}
        >
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          padding: "11px 16px",
          background: "#0a0a0a",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: 14,
          fontWeight: 500,
          cursor: pending ? "not-allowed" : "pointer",
          opacity: pending ? 0.6 : 1,
          marginTop: 4,
        }}
      >
        {pending ? "Шалгаж байна…" : "Нэвтрэх"}
      </button>

      <div
        style={{
          marginTop: 8,
          padding: 12,
          background: "#fafafa",
          borderRadius: 8,
          border: "1px dashed #e5e5e5",
          fontSize: 12,
          color: "#525252",
          lineHeight: 1.6,
          fontFamily: "var(--font-dm-mono), monospace",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 4, fontFamily: "var(--font-dm-sans), sans-serif" }}>
          Туршилтын бүртгэлүүд
        </div>
        admin / Admin@123 (админ)
        <br />
        monkhbat / Password1! (хэрэглэгч)
        <br />
        sarnai / Password1! (хэрэглэгч)
      </div>
    </form>
  );
}
