import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

export const AuthForm = ({ onClose }) => {
  const { sendOTP, verifyOTP, loading, error } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleOnClose =
    onClose || (() => navigate("/", { replace: true }));

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) return;

    const success = await sendOTP(normalizedEmail);

    if (success) {
      setStep("otp");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = otp.trim();

    if (!normalizedEmail || !normalizedOtp) return;

    const success = await verifyOTP(normalizedEmail, normalizedOtp);

    if (success) {
      handleOnClose();
    }
  };

  const handleBack = () => {
    setStep("email");
    setOtp("");
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-[2000]">
      <div className="bg-surface p-4 sm:p-6 rounded-xl border border-white/20 shadow-2xl shadow-black/20 w-[90%] max-w-96">

        <h2 className="text-lg text-center sm:text-xl font-bold text-text-primary mb-3 sm:mb-4">
          {step === "email" ? "Join" : "Enter OTP"}
        </h2>

        {step === "email" ? (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-3">

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="bg-white/10 backdrop-blur-sm text-text-primary px-4 py-2.5 rounded-lg border border-white/20 outline-none focus:border-brand-primary"
            />

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="bg-brand-primary text-white py-2.5 rounded-lg font-semibold disabled:opacity-60 transition"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">

            <p className="text-sm text-text-secondary">
              OTP sent to
            </p>

            <p className="text-sm font-medium text-text-primary truncate">
              {email}
            </p>

            <input
              type="text"
              inputMode="numeric"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              maxLength={6}
              autoComplete="one-time-code"
              required
              className="bg-bg text-text-primary px-4 py-2.5 rounded-lg border border-brand-light/40 outline-none focus:border-brand-primary tracking-[0.3em]"
            />

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="bg-brand-primary text-white py-2.5 rounded-lg font-semibold disabled:opacity-60 transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="text-text-secondary text-sm hover:text-text-primary transition"
            >
              Change email
            </button>

          </form>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-3">
            {error}
          </p>
        )}

        <button
          onClick={handleOnClose}
          className="text-text-secondary text-sm mt-4 hover:text-text-primary transition"
        >
          Cancel
        </button>

      </div>
    </div>,
    document.body
  );
};