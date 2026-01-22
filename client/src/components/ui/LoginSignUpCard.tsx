import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";

// API URL (env theke nile valo, ekhon hardcode korlam testing er jonno)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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

interface LoginSignUpCardProps {
  open: boolean;
  onClose: () => void;
}

const LoginSignUpCard = ({ open, onClose }: LoginSignUpCardProps) => {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(tab === "login" ? loginSchema : signUpSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (tab === "login") {
        // --- LOGIN REQUEST ---
        const response = await axios.post(`${BASE_URL}/auth/login`, {
          emailOrUser: data.emailOrUser,
          password: data.password
        });
        // Save Token
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        toast.success(`Welcome back, ${response.data.user.fullname}!`);
        onClose(); // Close modal
      } else {
        // --- SIGNUP REQUEST ---
        const response = await axios.post(`${BASE_URL}/auth/register`, {
          fullname: data.fullname,
          username: data.username,
          email: data.email,
          password: data.password
        });
        // Save Token (Auto login after signup)
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Account created successfully!");
        onClose(); // Close modal
      }
      reset();
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || "Something went wrong!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />

        <Dialog.Content
          className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-[400px] -translate-x-1/2 -translate-y-1/2 
          bg-[#1F1D47] p-6 md:p-8 rounded-2xl shadow-xl border border-white/10"
        >
          <Dialog.Close className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl">
            ✕
          </Dialog.Close>

          <Dialog.Title className="text-white text-2xl font-semibold text-center mb-6">
            {tab === "login" ? "Login" : "Create an Account"}
          </Dialog.Title>
          <Dialog.Description className="hidden">
            {tab === "login" ? "Login to your account" : "Create a new account"}
          </Dialog.Description>

          {/* TAB SWITCH */}
          <div className="flex mb-6 bg-white/10 rounded-xl p-1">
            <button
              type="button"
              onClick={() => { setTab("login"); reset(); }}
              className={`flex-1 py-2 rounded-xl transition ${
                tab === "login" ? "bg-pink-600 text-white" : "text-gray-300"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => { setTab("signup"); reset(); }}
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
                    className="w-full px-4 py-3 bg-[#2A284D] rounded-xl text-white outline-none focus:ring-2 focus:ring-pink-500 transition"
                  />
                  {errors.emailOrUser && (
                    <p className="text-red-400 text-sm mt-1">{errors.emailOrUser.message as string}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-[#2A284D] rounded-xl text-white outline-none focus:ring-2 focus:ring-pink-500 transition"
                  />
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password.message as string}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <input
                    {...register("username")}
                    placeholder="Username"
                    className="w-full px-4 py-3 bg-[#2A284D] rounded-xl text-white outline-none focus:ring-2 focus:ring-pink-500 transition"
                  />
                  {errors.username && (
                    <p className="text-red-400 text-sm mt-1">{errors.username.message as string}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("fullname")}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-[#2A284D] rounded-xl text-white outline-none focus:ring-2 focus:ring-pink-500 transition"
                  />
                  {errors.fullname && (
                    <p className="text-red-400 text-sm mt-1">{errors.fullname.message as string}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("email")}
                    placeholder="Email"
                    type="email"
                    className="w-full px-4 py-3 bg-[#2A284D] rounded-xl text-white outline-none focus:ring-2 focus:ring-pink-500 transition"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message as string}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-[#2A284D] rounded-xl text-white outline-none focus:ring-2 focus:ring-pink-500 transition"
                  />
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password.message as string}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("confirm")}
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full px-4 py-3 bg-[#2A284D] rounded-xl text-white outline-none focus:ring-2 focus:ring-pink-500 transition"
                  />
                  {errors.confirm && (
                    <p className="text-red-400 text-sm mt-1">{errors.confirm.message as string}</p>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 disabled:cursor-not-allowed text-white py-3 rounded-xl mt-4 font-semibold transition-all shadow-lg shadow-pink-500/30"
            >
              {loading ? "Processing..." : (tab === "login" ? "Login" : "Sign Up")}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LoginSignUpCard;