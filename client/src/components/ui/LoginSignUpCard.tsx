import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

/* ---------------------- ZOD SCHEMAS ----------------------- */
const loginSchema = z.object({
  emailOrUser: z.string().min(3, "Enter a valid username or email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullname: z.string().min(3, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be 6+ chars"),
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

/* ---------------------- COMPONENT ----------------------- */

const LoginSignUpCard = ({ open, onClose }) => {
  const [tab, setTab] = useState<"login" | "signup">("login");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(tab === "login" ? loginSchema : signUpSchema),
  });

  const onSubmit = (data: any) => {
    if (tab === "login") {
      toast.success("Logged in successfully!");
    } else {
      toast.success("Account created successfully!");
    }
    reset();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

        <Dialog.Content
          className="fixed top-1/2 left-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 
          bg-[#1F1D47] p-8 rounded-2xl shadow-xl border border-white/10"
        >
          <Dialog.Close className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl">
            ✕
          </Dialog.Close>

          <Dialog.Title className="text-white text-2xl font-semibold text-center mb-6">
            {tab === "login" ? "Login" : "Create an Account"}
          </Dialog.Title>

          {/* TAB SWITCH */}
          <div className="flex mb-6 bg-white/10 rounded-xl p-1">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 py-2 rounded-xl transition ${
                tab === "login" ? "bg-pink-600 text-white" : "text-gray-300"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setTab("signup")}
              className={`flex-1 py-2 rounded-xl transition ${
                tab === "signup" ? "bg-pink-600 text-white" : "text-gray-300"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {tab === "login" ? (
              <>
                <div>
                  <input
                    {...register("emailOrUser")}
                    placeholder="Username or Email"
                    className="w-full px-4 py-3 bg-[#2A284D] rounded-xl text-white outline-none"
                  />
                  {errors.emailOrUser && (
                    <p className="text-red-400 text-sm mt-1">{errors.emailOrUser.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-[#2A284D] rounded-xl text-white outline-none"
                  />
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <input
                    {...register("username")}
                    placeholder="Username"
                    className="w-full px-4 py-3 bg-[#2A284D] rounded-xl text-white outline-none"
                  />
                  {errors.username && (
                    <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("fullname")}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-[#2A284D] rounded-xl text-white outline-none"
                  />
                  {errors.fullname && (
                    <p className="text-red-400 text-sm mt-1">{errors.fullname.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("email")}
                    placeholder="Email"
                    type="email"
                    className="w-full px-4 py-3 bg-[#2A284D] rounded-xl text-white outline-none"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-[#2A284D] rounded-xl text-white outline-none"
                  />
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("confirm")}
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full px-4 py-3 bg-[#2A284D] rounded-xl text-white outline-none"
                  />
                  {errors.confirm && (
                    <p className="text-red-400 text-sm mt-1">{errors.confirm.message}</p>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl mt-4 font-semibold"
            >
              {tab === "login" ? "Login" : "Sign Up"}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LoginSignUpCard;
