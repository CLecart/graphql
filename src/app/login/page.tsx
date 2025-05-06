import LoginForm from "@/components/login/login";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function LoginPage() {
  return (
    <>
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <LoginForm />
    </>
  );
}
