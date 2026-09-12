"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import {
  Building2,
  MapPin,
  Home,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Leaf,
} from "lucide-react";
import { apiClient } from "@/app/lib/apiClient";

type RegisterFormState = {
  name: string;
  location: string;
  address: string;
  contactNum: string;
  email: string;
  password: string;
};

const initialFormState: RegisterFormState = {
  name: "",
  location: "",
  address: "",
  contactNum: "",
  email: "",
  password: "",
};

export default function RegisterComponent() {
  const router = useRouter();
  const [formState, setFormState] = useState<RegisterFormState>(initialFormState);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function updateField<K extends keyof RegisterFormState>(
    field: K,
    value: RegisterFormState[K],
  ) {
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await apiClient.post("/api/manufacturing-companies/register", formState);
      router.push("/login");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left: visual panel */}
      <div className="relative hidden w-1/2 min-h-screen overflow-hidden bg-black lg:block">
        <Image
          src="https://images.unsplash.com/photo-1580120656760-c652daad203c?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Wind turbines across a green landscape"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        {/* Tint + gradient for legibility and brand tone */}
        <div className="absolute inset-0 bg-blue-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          <div className="flex items-center gap-2">
            {/*<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
              <Leaf className="h-5 w-5 text-blue-300" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              CarbonLoop
            </span>*/}
          </div>

          <div className="max-w-md">
            <h1 className="text-3xl font-semibold leading-tight text-white">
              List your captured CO2. Reach the industries that need it.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Register your facility to publish available carbon supply and
              connect with buyers across fuel, materials, and agriculture.
            </p>
          </div>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="flex w-full flex-col justify-center bg-white px-6 py-12 lg:w-1/2">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo mark shown only when the image panel is hidden (small screens) */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-black">
              CarbonLoop
            </span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-black">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-black/60">
            Register your company to start trading captured carbon.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-black"
              >
                Company name
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-black/40" />
                <input
                  id="name"
                  type="text"
                  autoComplete="organization"
                  required
                  placeholder="Chemical Corp"
                  value={formState.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full rounded-lg border border-black/15 bg-white py-2.5 pl-10 pr-3 text-sm text-black placeholder:text-black/35 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="mb-1.5 block text-sm font-medium text-black"
              >
                Location
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-black/40" />
                <input
                  id="location"
                  type="text"
                  autoComplete="address-level2"
                  required
                  placeholder="Mumbai, Maharashtra"
                  value={formState.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="w-full rounded-lg border border-black/15 bg-white py-2.5 pl-10 pr-3 text-sm text-black placeholder:text-black/35 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="mb-1.5 block text-sm font-medium text-black"
              >
                Address
              </label>
              <div className="relative">
                <Home className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-black/40" />
                <input
                  id="address"
                  type="text"
                  autoComplete="street-address"
                  required
                  placeholder="456 Business Park"
                  value={formState.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full rounded-lg border border-black/15 bg-white py-2.5 pl-10 pr-3 text-sm text-black placeholder:text-black/35 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contactNum"
                className="mb-1.5 block text-sm font-medium text-black"
              >
                Contact number
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-black/40" />
                <input
                  id="contactNum"
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="8765432109"
                  value={formState.contactNum}
                  onChange={(e) => updateField("contactNum", e.target.value)}
                  className="w-full rounded-lg border border-black/15 bg-white py-2.5 pl-10 pr-3 text-sm text-black placeholder:text-black/35 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-black"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-black/40" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@chemcorp.com"
                  value={formState.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full rounded-lg border border-black/15 bg-white py-2.5 pl-10 pr-3 text-sm text-black placeholder:text-black/35 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-black"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-black/40" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  value={formState.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="w-full rounded-lg border border-black/15 bg-white py-2.5 pl-10 pr-10 text-sm text-black placeholder:text-black/35 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/70"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-black/60">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
