"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ArrowLeft, Wallet, ShieldCheck, QrCode, CreditCard, Sparkles, CheckCircle2 } from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("prod");
  const { products, placeOrder, submitPaymentReceipt, currentUser } = useApp() as any;

  const product = (productId && products.length > 0) ? products.find((p: any) => p.id === productId) : null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer"); // default to bank_transfer for manual payment flow
  const [selectedBank, setSelectedBank] = useState("maybank2u");
  const [manualRef, setManualRef] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState("details"); // 'details', 'fpx_bank', 'complete'
  const [generatedOrder, setGeneratedOrder] = useState<any>(null);

  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const tierDiscountPercent = currentUser?.membershipTier === "vip" 
    ? 20 
    : currentUser?.membershipTier === "premium" 
      ? 10 
      : (currentUser?.specialDiscount || 0);

  const autoDiscount = product ? product.price * (tierDiscountPercent / 100) : 0;

  if (!product) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", background: "#030303", color: "#fff", padding: "24px"
      }}>
        <h3 className="text-xl font-bold mb-2">Produk Tidak Ditemui</h3>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>
          Sila kembali ke katalog utama dan pilih produk yang sah.
        </p>
        <Link href="/" style={{
          background: "linear-gradient(135deg, #00c896 0%, #5078ff 100%)",
          color: "#fff", padding: "12px 24px", borderRadius: "12px", textDecoration: "none", fontSize: "14px", fontWeight: "bold"
        }}>
          Kembali Ke Katalog
        </Link>
      </div>
    );
  }

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === "AA-AI-VIP" || promoCode.trim().toUpperCase() === "AA-DANISH-99") {
      setDiscount(20); // RM 20 discount
      alert("Kod promo berjaya digunakan! Diskaun RM 20 diberikan.");
    } else {
      alert("Kod promo tidak sah.");
    }
  };

  const finalPrice = Math.max(0, product.price - discount - autoDiscount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Sila isi nama dan e-mel anda.");
      return;
    }

    if (paymentMethod === "fpx") {
      setStep("fpx_bank");
    } else {
      // Manual Transfer / QR Payment
      if (!manualRef) {
        alert("Sila masukkan nombor rujukan bank atau nama akaun pemindah.");
        return;
      }
      setIsProcessing(true);
      try {
        const order = await placeOrder(product.id, "manual_bank_transfer", { name, email });
        if (order) {
          // Immediately submit receipt info/reference
          await submitPaymentReceipt(order.id, manualRef, "Rujukan Transaksi: " + manualRef);
          setGeneratedOrder(order);
          setStep("complete");
        } else {
          alert("Gagal memproses pesanan. Sila cuba lagi.");
        }
      } catch (err) {
        console.error("Manual order error:", err);
        alert("Ralat semasa membuat pesanan.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleFpxPayment = async () => {
    setIsProcessing(true);
    try {
      const order = await placeOrder(product.id, "fpx", { name, email });
      if (order) {
        setGeneratedOrder(order);
        setStep("complete");
      } else {
        alert("Gagal memproses pembayaran FPX.");
      }
    } catch (err) {
      console.error("FPX error:", err);
      alert("Ralat sambungan bank.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #030303 0%, #080c14 50%, #030303 100%)",
      color: "#f1f5f9",
      padding: "40px 24px",
      fontFamily: "Inter, sans-serif"
    }}>
      {/* Background glow effects */}
      <div style={{ position: "absolute", top: "10%", left: "10%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(0,200,150,0.04) 0%, transparent 75%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(80,120,255,0.03) 0%, transparent 75%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        
        {/* Navigation */}
        <div style={{ marginBottom: "32px" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "14px", transition: "color 0.2s" }}>
            <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
          </Link>
          <h1 style={{ fontSize: "32px", fontWeight: 900, marginTop: "12px", background: "linear-gradient(to right, #ffffff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Checkout Sistem Premium
          </h1>
        </div>

        {step === "details" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px" }}>
            
            {/* Main Form Box */}
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px",
              padding: "36px",
              backdropFilter: "blur(12px)"
            }}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                
                {/* Section 1: Customer Details */}
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "16px", color: "#00c896", textTransform: "uppercase" }}>
                    1. Maklumat Hubungan
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "6px" }}>Nama Penuh</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px", color: "#fff", fontSize: "14px", outline: "none" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "6px" }}>Alamat E-mel</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px", color: "#fff", fontSize: "14px", outline: "none" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Payment Method */}
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "16px", color: "#00c896", textTransform: "uppercase" }}>
                    2. Kaedah Pembayaran
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    
                    {/* Bank Transfer Card */}
                    <div
                      onClick={() => setPaymentMethod("bank_transfer")}
                      style={{
                        background: paymentMethod === "bank_transfer" ? "rgba(0, 200, 150, 0.05)" : "rgba(0,0,0,0.2)",
                        border: paymentMethod === "bank_transfer" ? "2px solid #00c896" : "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "16px", padding: "20px", cursor: "pointer", textAlign: "center", transition: "all 0.2s"
                      }}
                    >
                      <Wallet style={{ width: "24px", height: "24px", margin: "0 auto 8px auto", color: paymentMethod === "bank_transfer" ? "#00c896" : "rgba(255,255,255,0.4)" }} />
                      <h4 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 4px 0" }}>Manual Transfer / QR</h4>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Pindahan bank manual atau kod QR</p>
                    </div>

                    {/* FPX Card */}
                    <div
                      onClick={() => setPaymentMethod("fpx")}
                      style={{
                        background: paymentMethod === "fpx" ? "rgba(80, 120, 255, 0.05)" : "rgba(0,0,0,0.2)",
                        border: paymentMethod === "fpx" ? "2px solid #5078ff" : "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "16px", padding: "20px", cursor: "pointer", textAlign: "center", transition: "all 0.2s"
                      }}
                    >
                      <CreditCard style={{ width: "24px", height: "24px", margin: "0 auto 8px auto", color: paymentMethod === "fpx" ? "#5078ff" : "rgba(255,255,255,0.4)" }} />
                      <h4 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 4px 0" }}>FPX Gateway</h4>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Pindahan automatik terus aktif</p>
                    </div>

                  </div>
                </div>

                {/* Section 3: Instruction Details */}
                {paymentMethod === "bank_transfer" && (
                  <div style={{
                    background: "rgba(255,255,255,0.01)",
                    border: "1px dashed rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                  }}>
                    <div>
                      <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#e2e8f0", display: "flex", alignItems: "center", gap: "8px", margin: "0 0 12px 0" }}>
                        <QrCode className="w-4 h-4 text-emerald-400" />
                        Pilihan 1: DuitNow QR (Imbas & Bayar)
                      </h4>
                      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        {/* Glow QR Mockup */}
                        <div style={{
                          width: "100px", height: "100px", background: "#070c14", border: "2px solid rgba(0, 200, 150, 0.3)",
                          borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden"
                        }}>
                          <div style={{ position: "absolute", width: "100%", height: "100%", background: "radial-gradient(circle, rgba(0,200,150,0.1) 0%, transparent 70%)" }} />
                          <QrCode className="w-12 h-12 text-[#00c896]" style={{ filter: "drop-shadow(0 0 8px rgba(0,200,150,0.5))" }} />
                        </div>
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                          1. Imbas kod QR di atas menggunakan aplikasi Bank atau e-Wallet anda.<br />
                          2. Penerima: <strong>AA AI GROUP ENTERPRISE</strong>.<br />
                          3. Sahkan amaun sepadan dengan bil pesanan anda.
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px" }}>
                      <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#e2e8f0", display: "flex", alignItems: "center", gap: "8px", margin: "0 0 8px 0" }}>
                        <Wallet className="w-4 h-4 text-cyan-400" />
                        Pilihan 2: Bank Transfer Manual
                      </h4>
                      <div style={{ background: "rgba(0,0,0,0.3)", padding: "12px 16px", borderRadius: "12px", fontSize: "12px", border: "1px solid rgba(255,255,255,0.05)", lineHeight: 1.6 }}>
                        Nama Bank: <strong>Maybank</strong><br />
                        No Akaun: <strong>1640-5231-9874</strong><br />
                        Nama Akaun: <strong>AA AI GROUP ENTERPRISE</strong>
                      </div>
                    </div>

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px" }}>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>
                        3. Bukti Pembayaran / Rujukan Bank (Ref No)
                      </label>
                      <input
                        type="text"
                        required
                        value={manualRef}
                        onChange={(e) => setManualRef(e.target.value)}
                        placeholder="e.g. MBY9928341 / Nama Pengirim Bank"
                        style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px", color: "#fff", fontSize: "14px", outline: "none" }}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  style={{
                    background: isProcessing
                      ? "rgba(255,255,255,0.1)"
                      : paymentMethod === "fpx"
                        ? "linear-gradient(135deg, #5078ff 0%, #3b82f6 100%)"
                        : "linear-gradient(135deg, #00c896 0%, #059669 100%)",
                    color: "#fff", border: "none", borderRadius: "12px", padding: "16px", fontSize: "15px", fontWeight: 700, cursor: isProcessing ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", transition: "all 0.2s"
                  }}
                >
                  {isProcessing ? "Sila tunggu..." : paymentMethod === "fpx" ? "Teruskan Ke FPX Bank" : "Sahkan & Hantar Bukti Bayaran"}
                </button>

              </form>
            </div>

            {/* Sidebar Order Summary */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "24px",
                padding: "24px",
                backdropFilter: "blur(12px)"
              }}>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>
                  Ringkasan Pesanan
                </h3>
                
                <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px" }}>
                  <span style={{ fontSize: "36px" }}>{product.image || "📦"}</span>
                  <div style={{ textAlign: "left" }}>
                    <h4 style={{ fontSize: "14px", fontWeight: 800, margin: 0 }}>{product.name}</h4>
                    <span style={{ background: "rgba(80,120,255,0.15)", border: "1px solid rgba(80,120,255,0.3)", color: "#93c5fd", fontSize: "9px", fontWeight: "bold", padding: "2px 8px", borderRadius: "99px", display: "inline-block", marginTop: "6px" }}>
                      {product.category?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "16px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>Harga Produk</span>
                    <span>RM {product.price}</span>
                  </div>
                  {autoDiscount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#fbbf24" }}>
                      <span>Rebat Keahlian ({currentUser.membershipTier.toUpperCase()})</span>
                      <span>- RM {autoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#34d399" }}>
                      <span>Diskaun Kod</span>
                      <span>- RM {discount}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "16px", fontSize: "18px", fontWeight: 900 }}>
                  <span>Jumlah Bersih</span>
                  <span className="text-[#00c896]">RM {finalPrice}</span>
                </div>
              </div>

              {/* Promo Code Card */}
              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "20px",
                backdropFilter: "blur(12px)"
              }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>
                  Kod Diskaun / Referral
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Contoh: AA-DANISH-99"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{ flex: 1, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "8px 12px", color: "#fff", fontSize: "13px", outline: "none" }}
                  />
                  <button onClick={applyPromo} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "10px", padding: "8px 16px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}>
                    Guna
                  </button>
                </div>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", display: "block", marginTop: "6px" }}>Tip: Gunakan kod &quot;AA-DANISH-99&quot; untuk rebat RM 20</span>
              </div>

              {/* Guarantee badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", opacity: 0.5 }}>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span style={{ fontSize: "12px" }}>Pintu Pembayaran Disulitkan Selamat</span>
              </div>

            </div>

          </div>
        )}

        {/* FPX Bank Selector step */}
        {step === "fpx_bank" && (
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "40px",
            maxWidth: "600px",
            margin: "0 auto",
            textAlign: "center",
            backdropFilter: "blur(12px)"
          }}>
            <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "8px", color: "#5078ff" }}>Simulasi FPX Gateway</h2>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>Sila pilih perbankan internet anda untuk menyambung simulasi bayaran segera.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
              {[
                { id: "maybank2u", name: "Maybank2u" },
                { id: "cimbclicks", name: "CIMB Clicks" },
                { id: "publicbank", name: "Public Bank" },
                { id: "rhbnow", name: "RHB Now" }
              ].map(bank => (
                <div
                  key={bank.id}
                  onClick={() => setSelectedBank(bank.id)}
                  style={{
                    background: selectedBank === bank.id ? "rgba(80,120,255,0.05)" : "rgba(0,0,0,0.2)",
                    border: selectedBank === bank.id ? "2px solid #5078ff" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px", padding: "16px", cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  <strong>{bank.name}</strong>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => setStep("details")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "12px", padding: "12px 24px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}>
                Kembali
              </button>
              <button onClick={handleFpxPayment} style={{ background: "linear-gradient(135deg, #5078ff 0%, #3b82f6 100%)", border: "none", color: "#fff", borderRadius: "12px", padding: "12px 30px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}>
                Bayar RM {finalPrice} Sekarang
              </button>
            </div>
          </div>
        )}

        {/* Complete/Success step */}
        {step === "complete" && generatedOrder && (
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "48px",
            maxWidth: "600px",
            margin: "0 auto",
            textAlign: "center",
            backdropFilter: "blur(12px)"
          }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>
              {generatedOrder.status === "completed" ? "🎉" : "⏳"}
            </div>
            <h2 style={{ fontSize: "26px", fontWeight: 900, marginBottom: "12px", background: generatedOrder.status === "completed" ? "linear-gradient(to right, #00c896, #3b82f6)" : "linear-gradient(to right, #fbbf24, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {generatedOrder.status === "completed" ? "Pembayaran Berjaya!" : "Rujukan Bukti Dihantar"}
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: "32px" }}>
              {generatedOrder.status === "completed"
                ? `Terima kasih! Pembayaran anda bagi pesanan #${generatedOrder.orderNumber || generatedOrder.id} telah disahkan secara automatik. Akses digital sedia dibuka.`
                : `Bukti rujukan anda bagi pesanan #${generatedOrder.orderNumber || generatedOrder.id} sedang diproses. Pentadbir kami sedang melakukan pemeriksaan manual.`}
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Link href="/" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "12px", padding: "12px 24px", fontSize: "14px", fontWeight: "bold", textDecoration: "none" }}>
                Kembali Ke Utama
              </Link>
              <Link href="/dashboard" style={{ background: "linear-gradient(135deg, #00c896 0%, #5078ff 100%)", color: "#fff", borderRadius: "12px", padding: "12px 24px", fontSize: "14px", fontWeight: "bold", textDecoration: "none" }}>
                Buka Portal Pelanggan
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#030303", color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Memuatkan Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
