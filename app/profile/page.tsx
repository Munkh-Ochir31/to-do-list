import Link from "next/link";
import { getUser } from "../lib/dal";
import { redirect } from "next/navigation";
import { logout } from "../actions/auth";
import { NameForm, PasswordForm } from "./ProfileForms";

const sectionStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #f0f0f0",
  borderRadius: 12,
  padding: 24,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: "#0a0a0a",
  marginBottom: 4,
};

const sectionHelperStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#a3a3a3",
  marginBottom: 16,
};

export default async function ProfilePage() {
  // Тактик [Authorize]: page render хийхээс өмнө DAL-аар session шалгана.
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 16px 64px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 22,
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "#525252",
            padding: "6px 12px 6px 8px",
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Буцах
        </Link>
        <form action={logout}>
          <button
            type="submit"
            style={{
              padding: "8px 14px",
              background: "#fff",
              color: "#525252",
              border: "1px solid #e5e5e5",
              borderRadius: 8,
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Гарах
          </button>
        </form>
      </div>

      <h1 style={{ fontSize: 22, fontWeight: 600, color: "#0a0a0a", letterSpacing: "-0.02em", marginBottom: 4 }}>
        Профайл
      </h1>
      <p style={{ fontSize: 13, color: "#a3a3a3", marginBottom: 24 }}>
        Хувийн мэдээллээ хянаж, нууц үгээ шинэчилнэ үү.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Бүртгэлийн мэдээлэл</div>
          <div style={sectionHelperStyle}>
            Зөвхөн уншигдах талбарууд. Username болон эрхийн шатлалыг өөрчлөх боломжгүй.
          </div>
          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "10px 16px",
              fontSize: 14,
              color: "#0a0a0a",
              fontFamily: "var(--font-dm-mono), monospace",
            }}
          >
            <dt style={{ color: "#a3a3a3" }}>ID</dt>
            <dd>{user.id}</dd>
            <dt style={{ color: "#a3a3a3" }}>Username</dt>
            <dd>{user.username}</dd>
            <dt style={{ color: "#a3a3a3" }}>Эрх</dt>
            <dd>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: user.role === "admin" ? "#0a0a0a" : "#e5e5e5",
                  color: user.role === "admin" ? "#fff" : "#525252",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {user.role === "admin" ? "Админ" : "Хэрэглэгч"}
              </span>
            </dd>
          </dl>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Дэлгэрэнгүй нэр</div>
          <div style={sectionHelperStyle}>Бусад хэрэглэгчид болон даалгаваруудад харагдах нэр.</div>
          <NameForm defaultName={user.name} />
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Нууц үг солих</div>
          <div style={sectionHelperStyle}>
            Аюулгүй байдлын үүднээс одоогийн нууц үгээ оруулна уу.
          </div>
          <PasswordForm />
        </div>
      </div>
    </div>
  );
}
