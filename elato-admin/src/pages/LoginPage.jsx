import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import useAuthStore from "../store/useAuthStore";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) { setError("Both fields required."); return; }
    setError("");
    setLoading(true);
    try {
      const { data } = await login(email, password);
      setAuth(data.access_token, data.admin);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#EBD8B7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "#FBF5E8",
          borderRadius: "4px",
          padding: "40px 36px",
          boxShadow: "0 8px 40px rgba(26,14,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "1.5rem",
              fontWeight: 500,
              letterSpacing: "0.14em",
              color: "#1A0E00",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}
          >
            Elatō Celebré
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.68rem",
              color: "#9E7519",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Admin Panel
          </p>
          <div
            style={{
              width: "28px",
              height: "1px",
              background: "#9E7519",
              margin: "12px auto 0",
              opacity: 0.6,
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@elato.in"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#8B2500" }}>
              {error}
            </p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            size="lg"
            style={{ width: "100%", marginTop: "8px" }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </div>
      </div>
    </div>
  );
}