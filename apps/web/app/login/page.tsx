import { LoginForm } from "@/components/auth/login-form";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { FadeIn } from "@/components/motion/motion";

export const metadata = { title: "Sign in — Rewire" };

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <FadeIn>
        <LoginForm />
      </FadeIn>
    </main>
  );
}
