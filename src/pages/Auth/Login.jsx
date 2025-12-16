import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import useAuth from "../../hooks/UseAuth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import SocialLogin from "./SocialLogin";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";

export default function Login() {
  const { signInUser, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    try {
      await signInUser(data.email, data.password);
      toast.success("Login successful");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-2xl border border-gray-800 bg-black p-8 shadow-2xl"
      >
        <h2 className="mb-2 text-3xl font-semibold text-white">Sign In</h2>
        <p className="mb-8 text-sm text-gray-400">
          Welcome back to Elite Decor
        </p>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-white">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-gray-700 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-white"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-white">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-700 bg-black px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-white"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white py-3 text-sm font-medium text-black transition hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <a href="/register" className="text-white hover:underline">
            Register
          </a>
        </p>

        <SocialLogin />
      </motion.div>
    </div>
  );
}
