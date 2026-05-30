"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [referredBy, setReferredBy] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get("ref");
      if (refCode) {
        setReferredBy(refCode.trim());
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate
    if (fullName.trim().length < 2) {
      setError("Nama mestilah sekurang-kurangnya 2 aksara.");
      return;
    }
    if (password.length < 8) {
      setError("Kata laluan mestilah sekurang-kurangnya 8 aksara.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Kata laluan tidak sepadan.");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, fullName.trim(), referredBy.trim() || undefined);
      router.push("/dashboard");
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/email-already-in-use") {
        setError("Emel ini sudah didaftarkan. Sila gunakan emel lain atau log masuk.");
      } else if (code === "auth/weak-password") {
        setError("Kata laluan terlalu lemah. Gunakan minimum 8 aksara.");
      } else if (code === "auth/invalid-email") {
        setError("Format emel tidak sah.");
      } else {
        setError(err?.message || "Ralat semasa pendaftaran. Sila cuba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!password) return { level: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (password.length >= 12) score++;

    if (score <= 1) return { level: score, label: "Lemah", color: "#ff4444" };
    if (score <= 2) return { level: score, label: "Sederhana", color: "#ffaa00" };
    if (score <= 3) return { level: score, label: "Baik", color: "#00c896" };
    return { level: score, label: "Sangat Kuat", color: "#00e5ff" };
  };

  const strength = passwordStrength();

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
        position: "absolute", top: "-10%", right: "-5%", width: "450px", height: "450px",
        borderRadius: "50%", background: "radial-gradient(circle, rgba(80,120,255,0.08) 0%, transparent 70%)",
        animation: "float 9s ease-in-out infinite", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", left: "-5%", width: "400px", height: "400px",
        borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,150,0.06) 0%, transparent 70%)",
        animation: "float 11s ease-in-out infinite reverse", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "40%", right: "30%", width: "250px", height: "250px",
        borderRadius: "50%", background: "radial-gradient(circle, rgba(200,80,255,0.05) 0%, transparent 70%)",
        animation: "pulse 7s ease-in-out infinite", pointerEvents: "none",
      }} />

      <div style={{
        width: "100%",
        maxWidth: "440px",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "12px",
              marginBottom: "8px",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "linear-gradient(135deg, #5078ff 0%, #a050ff 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", fontWeight: 800, color: "#fff",
                boxShadow: "0 4px 20px rgba(80,120,255,0.3)",
              }}>AA</div>
              <span style={{
                fontSize: "22px", fontWeight: 700, color: "#fff",
                letterSpacing: "-0.5px",
              }}>AI GROUP</span>
            </div>
          </Link>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 }}>
            Daftar akaun baru untuk akses ekosistem AI premium
          </p>
        </div>

        {/* Register Card */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "32px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}>
          <h1 style={{
            fontSize: "24px", fontWeight: 700, color: "#fff",
            margin: "0 0 24px 0", textAlign: "center",
          }}>
            Cipta Akaun Anda ✨
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
            {/* Full Name */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{
                display: "block", color: "rgba(255,255,255,0.7)",
                fontSize: "13px", fontWeight: 500, marginBottom: "8px",
              }}>Nama Penuh</label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                  fontSize: "16px", opacity: 0.5,
                }}>👤</span>
                <input
                  id="register-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ahmad Danish"
                  required
                  style={{
                    width: "100%", padding: "13px 14px 13px 44px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px", color: "#fff", fontSize: "14px",
                    outline: "none", transition: "all 0.3s", boxSizing: "border-box",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(80,120,255,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(80,120,255,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: "18px" }}>
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
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: "100%", padding: "13px 14px 13px 44px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px", color: "#fff", fontSize: "14px",
                    outline: "none", transition: "all 0.3s", boxSizing: "border-box",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(80,120,255,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(80,120,255,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "18px" }}>
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
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 aksara"
                  required
                  minLength={8}
                  style={{
                    width: "100%", padding: "13px 48px 13px 44px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px", color: "#fff", fontSize: "14px",
                    outline: "none", transition: "all 0.3s", boxSizing: "border-box",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(80,120,255,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(80,120,255,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
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
              {/* Password strength indicator */}
              {password && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{
                    display: "flex", gap: "4px", marginBottom: "4px",
                  }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} style={{
                        flex: 1, height: "3px", borderRadius: "2px",
                        background: i <= strength.level ? strength.color : "rgba(255,255,255,0.1)",
                        transition: "all 0.3s",
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: "11px", color: strength.color }}>{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block", color: "rgba(255,255,255,0.7)",
                fontSize: "13px", fontWeight: 500, marginBottom: "8px",
              }}>Sahkan Kata Laluan</label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                  fontSize: "16px", opacity: 0.5,
                }}>🔐</span>
                <input
                  id="register-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Masukkan semula kata laluan"
                  required
                  style={{
                    width: "100%", padding: "13px 44px 13px 44px",
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${confirmPassword && confirmPassword !== password ? "rgba(255,80,80,0.4)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "12px", color: "#fff", fontSize: "14px",
                    outline: "none", transition: "all 0.3s", boxSizing: "border-box",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(80,120,255,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(80,120,255,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = confirmPassword && confirmPassword !== password ? "rgba(255,80,80,0.4)" : "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                />
                {confirmPassword && (
                  <span style={{
                    position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                    fontSize: "16px",
                  }}>
                    {confirmPassword === password ? "✅" : "❌"}
                  </span>
                )}
              </div>
            </div>

            {/* Referral Code (Optional) */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{
                display: "block", color: "rgba(255,255,255,0.7)",
                fontSize: "13px", fontWeight: 500, marginBottom: "8px",
              }}>Kod Rujukan (Pilihan)</label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                  fontSize: "16px", opacity: 0.5,
                }}>🎁</span>
                <input
                  id="register-ref"
                  type="text"
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                  placeholder="Contoh: AA-DANISH-99"
                  style={{
                    width: "100%", padding: "13px 14px 13px 44px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px", color: "#fff", fontSize: "14px",
                    outline: "none", transition: "all 0.3s", boxSizing: "border-box",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(80,120,255,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(80,120,255,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px",
                background: loading
                  ? "rgba(255,255,255,0.1)"
                  : "linear-gradient(135deg, #5078ff 0%, #a050ff 100%)",
                border: "none", borderRadius: "12px",
                color: "#fff", fontSize: "15px", fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                boxShadow: loading ? "none" : "0 4px 16px rgba(80,120,255,0.3)",
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
                  Mendaftar...
                </>
              ) : (
                <>✨ Daftar Sekarang</>
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

          {/* Login link */}
          <p style={{
            textAlign: "center", color: "rgba(255,255,255,0.5)",
            fontSize: "14px", margin: 0,
          }}>
            Sudah ada akaun?{" "}
            <Link href="/login" style={{
              color: "#5078ff", textDecoration: "none", fontWeight: 600,
              transition: "color 0.2s",
            }}>
              Log Masuk
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
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
}
