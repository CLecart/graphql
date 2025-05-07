"use client";
import { loginForm } from "@/app/api/login";
import React, { useState } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";

const LOGO_DARK = "/logo Z01.png";
const LOGO_LIGHT = "/logo Z01light4.png";
const BG_IMAGE = "/vagueZ01.svg";
const WELCOME_TITLE = "Welcome back";
const WELCOME_SUBTITLE = "Sign in to access your Zone01 profile";
const EMAIL_LABEL = "Email or Username";
const EMAIL_PLACEHOLDER = "Enter your email or username";
const PASSWORD_LABEL = "Password";
const PASSWORD_PLACEHOLDER = "Enter your password";
const LOGIN_SUCCESS = "Login successful";
const LOGIN_ERROR = "Incorrect email or password";
const GENERIC_ERROR = "An error occurred";
const POWERED_BY = "Powered by GraphQL & Next.js";

const schema = z.object({
  email: z
    .string()
    .refine(
      (val) => val === "clecart" || z.string().email().safeParse(val).success,
      {
        message: "Invalid email (or unauthorized username)",
      }
    ),
  password: z.string().min(6, "Must contain at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const { theme } = useTheme();
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
          router.push("/profile");
        } else {
          setErrors({ email: LOGIN_ERROR });
        }
      } catch (error) {
        setErrors({ email: GENERIC_ERROR });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const logoImage = theme === "dark" ? LOGO_DARK : LOGO_LIGHT;

  return (
    <>
      <img
        src={BG_IMAGE}
        className="absolute top-0 left-0 w-screen h-full object-cover -z-10 opacity-60"
        alt="background shape"
      />
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 z-0">
        <div
          className="hidden md:flex bg-primary/10 items-center justify-center p-8 z-20 ring-offset-8"
          style={{
            boxShadow: "0 0 4px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="max-w-md">
            <div className="text-4xl font-bold mb-4 text-primary">
              Zone01 GraphQL Profile
            </div>
            <p className="text-lg text-muted-foreground">
              Access your student profile with detailed statistics and
              visualizations of your academic journey.
            </p>
            <div className="mt-12 opacity-80">
              <img
                src={logoImage}
                alt="background shape"
                className="mx-auto"
              ></img>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center p-8">
          <div className="mx-auto w-full max-w-md space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{WELCOME_TITLE}</h1>
              <p className="text-muted-foreground">{WELCOME_SUBTITLE}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  {EMAIL_LABEL}
                </label>
                <input
                  id="email"
                  type="text"
                  name="email"
                  placeholder={EMAIL_PLACEHOLDER}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  onChange={handleChange}
                  disabled={isLoading}
                  aria-label="Email or Username"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    {PASSWORD_LABEL}
                  </label>
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder={PASSWORD_PLACEHOLDER}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  onChange={handleChange}
                  disabled={isLoading}
                  aria-label="Password"
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
                aria-label="Sign in to your account"
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

            <div className="text-center text-sm mt-4 z-0 text-foreground dark:text-white">
              {POWERED_BY}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
