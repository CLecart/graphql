"use client";
import { loginForm } from "@/app/api/login";
import React, { useState } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Must contain at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      setIsLoading(false);
    } else {
      setErrors({});
      try {
        const res = await loginForm(formData);
        if (res) {
          console.log("Login successful");
          router.push("/profile");
        } else {
          setErrors({ email: "Email ou mot de passe incorrect" });
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrors({ email: "Une erreur s'est produite" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side - Illustration or image */}
      <div className="hidden md:flex bg-primary/10 items-center justify-center p-8">
        <div className="max-w-md">
          <div className="text-4xl font-bold mb-4 text-primary">
            Zone01 GraphQL Profile
          </div>
          <p className="text-lg text-muted-foreground">
            Access your student profile with detailed statistics and
            visualizations of your academic journey.
          </p>

          {/* Abstract SVG decoration */}
          <div className="mt-12 opacity-80">
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="w-64 h-64"
            >
              <path
                fill="var(--color-primary)"
                d="M46.5,-64.2C59.9,-55.1,69.9,-41.5,76.2,-25.9C82.4,-10.2,84.9,7.3,80.2,22.9C75.5,38.5,63.5,52.1,48.9,60.7C34.2,69.3,17.1,73,0.1,72.9C-17,72.8,-33.9,68.9,-48.4,60.1C-62.8,51.3,-74.8,37.6,-79.4,21.8C-83.9,6,-81,-11.9,-73.2,-26.9C-65.5,-41.8,-52.9,-53.7,-39.2,-62.8C-25.5,-71.8,-12.8,-77.9,1.9,-80.4C16.5,-82.9,33.1,-73.3,46.5,-64.2Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex flex-col justify-center p-8">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to access your Zone01 profile
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email or Username
              </label>
              <input
                id="email"
                type="text"
                name="email"
                placeholder="Enter your email or username"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground mt-4">
            Powered by GraphQL & Next.js
          </div>
        </div>
      </div>
    </div>
  );
}
