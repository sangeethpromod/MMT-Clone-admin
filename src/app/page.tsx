"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice/authSlice";
import { RootState, AppDispatch } from "../redux/store";
import Image from "next/image";
import loginBg from "@/assets/Login/login-bg.jpg";
import Inputfield from "@/components/ui/inputfield";
import Button from "@/components/ui/button";
import { showErrorAlert } from "../utils/swal";
// import Logo from "@/assets/Login/Logo.svg";

function LoginV2() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    if (error) {
      showErrorAlert('Login Failed', error);
    }
  }, [error]);

  const handleLogin = () => {
    dispatch(login({ email, password }));
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      style={{ background: "radial-gradient(circle, #ffffff, #902b2b1f)" }}
    >
      <div className="w-[95%] h-[90%] bg-white rounded-sm flex">
        {/* Left Section - Login Form */}
        <div className="w-1/2 flex flex-col items-center justify-center px-8">
         {/* <Image src={Logo} alt="ZyraOne Logo" width={40} height={40} /> */}
          
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-1">
              <h1 className="font-semibold text-2xl text-[#000000]">
                Login to your account
              </h1>
              <p className="font-normal text-sm text-[#71717A]">
                Enter Offbear Admin credentials to access your account
              </p>
            </div>

            <div className="h-px w-full bg-[#e4e4e4]" />

            <div className="space-y-4">
              <Inputfield
                label="Email Address"
                width="w-full"
                placeholder="Enter your email address"
                type="email"
                variant="primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Inputfield
                label="Password"
                width="w-full"
                placeholder="Enter your password"
                variant="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="text-left">
                <button 
                  onClick={() => router.push('/forgot-password')}
                  className="text-sm text-gray-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <Button 
                label={isLoading ? "Logging in..." : "Login"} 
                width="w-full" 
                className="mt-2"
                onClick={handleLogin}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Right Section - Background Image */}
        <div className="w-1/2 p-2 relative flex items-center justify-center">
          <div className="relative w-full h-full rounded-xs overflow-hidden">
            <Image
              src={loginBg}
              alt="Login background"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginV2;
