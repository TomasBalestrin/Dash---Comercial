import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm flex flex-col gap-6 rounded-card border border-border-card bg-bg-card p-8">
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="font-rajdhani text-3xl font-bold tracking-wide text-white">
          Dash Comercial
        </h1>
        <p className="text-sm text-muted-foreground">Entre para continuar</p>
      </div>
      <LoginForm />
    </div>
  );
}
