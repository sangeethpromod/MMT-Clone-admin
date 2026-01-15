"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { requestPasswordReset, resetPassword, resetState } from "../../redux/slices/passwordSlice/passwordSlice";
import { RootState, AppDispatch } from "../../redux/store";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/inputfield";
import { showSuccessAlert, showErrorAlert } from "../../utils/swal";

type Step = "email" | "otp" | "password";

export default function ForgotPassword() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error,resetSuccess } = useSelector((state: RootState) => state.password);

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpCode, setOtpCode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");


  useEffect(() => {
    if (resetSuccess) {
      showSuccessAlert('Success', 'Password reset successfully! Please login with your new password.');
      router.push('/');
      dispatch(resetState());
    }
  }, [resetSuccess, router, dispatch]);

  useEffect(() => {
    if (error) {
      showErrorAlert('Error', error);
      dispatch(resetState());
    }
  }, [error, dispatch]);

  const handleEmailSubmit = async () => {
    if (email.trim()) {
      const result = await dispatch(requestPasswordReset(email));
      if (requestPasswordReset.fulfilled.match(result)) {
        setStep("otp");
      }
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const clone = [...otp];
    clone[index] = value;
    setOtp(clone);

    // Combine all digits into a single code
    const code = clone.join('');
    setOtpCode(code);

    // Move cursor to next box
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handlePasswordReset = async () => {
    if (newPass !== confirmPass) {
      showErrorAlert('Error', 'Passwords do not match');
      return;
    }

    if (newPass.length < 6) {
      showErrorAlert('Error', 'Password must be at least 6 characters long');
      return;
    }

    dispatch(resetPassword({ email, code: otpCode, newPassword: newPass }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      {/* EMAIL STEP */}
      {step === "email" && (
        <>
          <h1 className="text-[22px] font-semibold text-black mb-6">
            Password Reset
          </h1>
          <div className="w-full max-w-xs">
            <InputField
              label="Email ID"
              width="w-full"
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              label={isLoading ? "Sending..." : "Send OTP"}
              variant="primary"
              width="w-full"
              className="mt-4"
              onClick={handleEmailSubmit}
              disabled={!email.trim() || isLoading}
            />
          </div>
        </>
      )}

      {/* OTP STEP */}
      {step === "otp" && (
        <>
          <h1 className="text-[22px] font-semibold text-black mb-1">
            Enter your one-time password
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            We sent a code to {email}
          </p>

          {/* OTP Boxes */}
          <div className="flex gap-2 mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, i)}
                className="
                  w-12 h-14 border border-gray-300 rounded-lg 
                  text-center text-xl text-black 
                  focus:outline-none focus:border-black
                "
              />
            ))}
          </div>

          <div className="flex gap-4 items-center">
            <Button
              label="Verify Code"
              variant="primary"
              onClick={() => setStep("password")}
              disabled={otpCode.length !== 6 || isLoading}
            />
            <button 
              onClick={() => {
                setStep("email");
                setOtp(Array(6).fill(""));
                setOtpCode("");
              }}
              className="text-sm text-gray-600 hover:underline"
            >
              Change Email
            </button>
          </div>

          <p className="text-gray-500 text-sm mt-4">
            Didn’t get the email? Check your spam folder.
          </p>
          <button 
            onClick={() => dispatch(requestPasswordReset(email))}
            disabled={isLoading}
            className="text-sm text-blue-600 underline disabled:opacity-50"
          >
            Try again
          </button>
        </>
      )}

      {/* PASSWORD STEP */}
      {step === "password" && (
        <>
          <h1 className="text-[22px] font-semibold text-black mb-1">
            Reset your password
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Enter your new password below
          </p>

          <div className="w-full max-w-xs flex flex-col gap-3">
            <InputField
              label="New Password"
              placeholder="Enter new password"
              variant="password"
              value={newPass}
              width="w-full"
              onChange={(e) => setNewPass(e.target.value)}
            />

            <InputField
              label="Confirm Password"
              placeholder="Confirm password"
              variant="password"
              width="w-full"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />

            <Button
              label={isLoading ? "Resetting..." : "Change password"}
              variant="primary"
              width="w-full"
              onClick={handlePasswordReset}
              disabled={isLoading || !newPass || !confirmPass}
            />
          </div>
        </>
      )}
    </div>
  );
}
