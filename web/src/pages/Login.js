import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, isAdmin, isStudent, token, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in — redirect based on role
  if (!loading && token) {
    if (isAdmin) return <Navigate to="/dashboard" replace />;
    if (isStudent) return <Navigate to="/mobile" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const userData = await login(email, password);
      const role = userData?.user_metadata?.role || userData?.role;
      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/mobile");
      }
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d1117; }
        .login-input:focus { outline: none; border-color: #6ee7f7 !important; box-shadow: 0 0 0 3px rgba(110,231,247,0.1); }
        .login-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#0d1117",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif", padding: 24,
        position: "relative", overflow: "hidden",
      }}>
        {/* Background glows */}
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(110,231,247,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "20%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(167,139,250,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          width: "100%", maxWidth: 420,
          background: "linear-gradient(135deg, #1a1f2e 0%, #141824 100%)",
          border: "1px solid #2a2f42", borderRadius: 20,
          padding: "40px 36px",
          animation: "fadeUp 0.4s ease forwards",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
            <a href="/" style={{ textDecoration: "none" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: "linear-gradient(135deg, #6ee7f7, #a78bfa)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, fontWeight: 800, color: "#0d1117",
                cursor: "pointer", transition: "opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                title="Back to Home"
              >A</div>
            </a>
            <div>
              <div style={{ color: "#f1f5f9", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18 }}>AI Study</div>
              <div style={{ color: "#4b5563", fontSize: 12 }}>Platform Login</div>
            </div>
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif", color: "#f1f5f9",
            fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8,
          }}>Welcome back</h1>
          <p style={{ color: "#4b5563", fontSize: 14, marginBottom: 32 }}>
            Sign in to continue to AI Study
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#9ca3af", fontSize: 13, display: "block", marginBottom: 8, fontWeight: 500 }}>
                Email
              </label>
              <input
                className="login-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "#0d1117", border: "1px solid #2a2f42",
                  borderRadius: 10, color: "#f1f5f9", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ color: "#9ca3af", fontSize: 13, display: "block", marginBottom: 8, fontWeight: 500 }}>
                Password
              </label>
              <input
                className="login-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "#0d1117", border: "1px solid #2a2f42",
                  borderRadius: 10, color: "#f1f5f9", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                }}
              />
            </div>

            {error && (
              <div style={{
                background: "#2a1a1a", border: "1px solid #f8717133",
                borderRadius: 10, padding: "12px 16px", marginBottom: 20,
                color: "#f87171", fontSize: 13,
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="login-btn"
              disabled={submitting}
              style={{
                width: "100%", padding: "13px",
                background: "linear-gradient(135deg, #6ee7f7, #a78bfa)",
                border: "none", borderRadius: 10,
                color: "#0d1117", fontWeight: 700, fontSize: 15,
                fontFamily: "'DM Sans', sans-serif",
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
                transition: "all 0.2s",
              }}
            >
              {submitting ? "Signing in..." : "Sign in →"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
