"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn(email, password);

      // Redirect based on role or callback URL
      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (result.role === "admin" || result.role === "superadmin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Emel atau kata laluan tidak sah.");
      } else if (code === "auth/too-many-requests") {
        setError("Terlalu banyak percubaan. Sila cuba sebentar lagi.");
      } else {
        setError(err?.message || "Ralat semasa log masuk. Sila cuba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0a0a0f 0%, #0d1117 30%, #0a1628 60%, #0f0a20 100%)",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Animated background orbs */}
      <div style={{
        position: "absolute", top: "-10%", left: "-5%", width: "400px", height: "400px",
        borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,150,0.08) 0%, transparent 70%)",
        animation: "float 8s ease-in-out infinite", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", right: "-5%", width: "500px", height: "500px",
        borderRadius: "50%", background: "radial-gradient(circle, rgba(80,120,255,0.06) 0%, transparent 70%)",
        animation: "float 10s ease-in-out infinite reverse", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%", width: "300px", height: "300px",
        borderRadius: "50%", background: "radial-gradient(circle, rgba(160,80,255,0.05) 0%, transparent 70%)",
        transform: "translate(-50%, -50%)", animation: "pulse 6s ease-in-out infinite", pointerEvents: "none",
      }} />

      <div style={{
        width: "100%",
        maxWidth: "440px",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "12px",
              marginBottom: "8px",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "linear-gradient(135deg, #00c896 0%, #5078ff 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", fontWeight: 800, color: "#fff",
                boxShadow: "0 4px 20px rgba(0,200,150,0.3)",
              }}>AA</div>
              <span style={{
                fontSize: "22px", fontWeight: 700, color: "#fff",
                letterSpacing: "-0.5px",
              }}>AI GROUP</span>
            </div>
          </Link>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 }}>
            Log masuk ke akaun anda
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "36px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}>
          <h1 style={{
            fontSize: "24px", fontWeight: 700, color: "#fff",
            margin: "0 0 24px 0", textAlign: "center",
          }}>
            Selamat Kembali 👋
          </h1>

          {error && (
            <div style={{
              background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)",
              borderRadius: "12px", padding: "12px 16px", marginBottom: "20px",
              color: "#ff6b6b", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block", color: "rgba(255,255,255,0.7)",
                fontSize: "13px", fontWeight: 500, marginBottom: "8px",
              }}>Alamat Emel</label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                  fontSize: "16px", opacity: 0.5,
                }}>📧</span>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: "100%", padding: "14px 14px 14px 44px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px", color: "#fff", fontSize: "14px",
                    outline: "none", transition: "all 0.3s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(0,200,150,0.5)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(0,200,150,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block", color: "rgba(255,255,255,0.7)",
                fontSize: "13px", fontWeight: 500, marginBottom: "8px",
              }}>Kata Laluan</label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                  fontSize: "16px", opacity: 0.5,
                }}>🔒</span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata laluan"
                  required
                  style={{
                    width: "100%", padding: "14px 48px 14px 44px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px", color: "#fff", fontSize: "14px",
                    outline: "none", transition: "all 0.3s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(0,200,150,0.5)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(0,200,150,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "16px", opacity: 0.5, padding: 0,
                  }}
                >{showPassword ? "🙈" : "👁️"}</button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px",
                background: loading
                  ? "rgba(255,255,255,0.1)"
                  : "linear-gradient(135deg, #00c896 0%, #00a87a 100%)",
                border: "none", borderRadius: "12px",
                color: "#fff", fontSize: "15px", fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                boxShadow: loading ? "none" : "0 4px 16px rgba(0,200,150,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff", borderRadius: "50%",
                    animation: "spin 0.8s linear infinite", display: "inline-block",
                  }} />
                  Sedang log masuk...
                </>
              ) : (
                <>🚀 Log Masuk</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: "16px",
            margin: "24px 0",
          }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>ATAU</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Register link */}
          <p style={{
            textAlign: "center", color: "rgba(255,255,255,0.5)",
            fontSize: "14px", margin: 0,
          }}>
            Belum ada akaun?{" "}
            <Link href="/register" style={{
              color: "#00c896", textDecoration: "none", fontWeight: 600,
              transition: "color 0.2s",
            }}>
              Daftar Sekarang
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: "center", color: "rgba(255,255,255,0.25)",
          fontSize: "12px", marginTop: "24px",
        }}>
          © 2026 AA AI GROUP. Semua hak terpelihara.
        </p>
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); } 50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
        color: "rgba(255,255,255,0.5)",
        fontSize: "14px",
      }}>
        Pemuatan...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
