import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import useAuth from "../../hooks/UseAuth";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Register() {
  const { registerUser, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      await registerUser(data.email, data.password);
      reset();
      console.log("User registered successfully");
    } catch (error) {
      console.error("Registration failed", error);
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
        <h2 className="mb-2 text-3xl font-semibold text-white">
          Create Account
        </h2>
        <p className="mb-8 text-sm text-gray-400">
          Join Elite Decor for a premium experience
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-white">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Name"
              className="w-full rounded-xl border border-gray-700 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-white"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white">
              Profile Image
            </label>

            <input
              type="file"
              accept="image/*"
              className="w-full cursor-pointer rounded-xl border border-gray-700 bg-black px-4 py-3 text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black hover:file:bg-gray-200"
              {...register("image", {
                required: "Profile image is required",
              })}
            />

            {errors.image && (
              <p className="mt-1 text-xs text-red-400">
                {errors.image.message}
              </p>
            )}
          </div>

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

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white py-3 text-sm font-medium text-black transition hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-white hover:underline">
            Sign in
          </a>
        </p>
      </motion.div>
    </div>
  );
}
