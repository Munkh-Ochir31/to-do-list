"use client";

import { useActionState } from "react";
import {
  changePassword,
  updateProfile,
  type PasswordState,
  type ProfileState,
} from "../actions/profile";

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

const buttonStyle: React.CSSProperties = {
  padding: "10px 16px",
  background: "#0a0a0a",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontFamily: "var(--font-dm-sans), sans-serif",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
};

const errorBoxStyle: React.CSSProperties = {
  padding: "10px 12px",
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: 8,
  fontSize: 13,
  color: "#b91c1c",
};

const successBoxStyle: React.CSSProperties = {
  padding: "10px 12px",
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: 8,
  fontSize: 13,
  color: "#15803d",
};

const fieldErrorStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#b91c1c",
  marginTop: 4,
};

export function NameForm({ defaultName }: { defaultName: string }) {
  const [state, action, pending] = useActionState<ProfileState | undefined, FormData>(
    updateProfile,
    undefined
  );

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <label htmlFor="name" style={labelStyle}>Дэлгэрэнгүй нэр</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={80}
          defaultValue={defaultName}
          style={fieldStyle}
        />
        {state?.fieldErrors?.name && (
          <p style={fieldErrorStyle}>{state.fieldErrors.name}</p>
        )}
      </div>

      {state?.error && <div role="alert" style={errorBoxStyle}>{state.error}</div>}
      {state?.ok && state.message && <div role="status" style={successBoxStyle}>{state.message}</div>}

      <div>
        <button
          type="submit"
          disabled={pending}
          style={{ ...buttonStyle, opacity: pending ? 0.6 : 1, cursor: pending ? "not-allowed" : "pointer" }}
        >
          {pending ? "Хадгалж байна…" : "Нэр хадгалах"}
        </button>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState<PasswordState | undefined, FormData>(
    changePassword,
    undefined
  );

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <label htmlFor="currentPassword" style={labelStyle}>Одоогийн нууц үг</label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          maxLength={200}
          style={fieldStyle}
        />
        {state?.fieldErrors?.currentPassword && (
          <p style={fieldErrorStyle}>{state.fieldErrors.currentPassword}</p>
        )}
      </div>

      <div>
        <label htmlFor="newPassword" style={labelStyle}>
          Шинэ нууц үг
          <span style={{ color: "#a3a3a3", fontWeight: 400 }}> · 8+ тэмдэгт, үсэг + тоо + тусгай</span>
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          maxLength={200}
          style={fieldStyle}
        />
        {state?.fieldErrors?.newPassword && (
          <p style={fieldErrorStyle}>{state.fieldErrors.newPassword}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" style={labelStyle}>Шинэ нууц үгийг давтах</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          maxLength={200}
          style={fieldStyle}
        />
        {state?.fieldErrors?.confirmPassword && (
          <p style={fieldErrorStyle}>{state.fieldErrors.confirmPassword}</p>
        )}
      </div>

      {state?.error && <div role="alert" style={errorBoxStyle}>{state.error}</div>}
      {state?.ok && state.message && <div role="status" style={successBoxStyle}>{state.message}</div>}

      <div>
        <button
          type="submit"
          disabled={pending}
          style={{ ...buttonStyle, opacity: pending ? 0.6 : 1, cursor: pending ? "not-allowed" : "pointer" }}
        >
          {pending ? "Шинэчилж байна…" : "Нууц үг солих"}
        </button>
      </div>
    </form>
  );
}
