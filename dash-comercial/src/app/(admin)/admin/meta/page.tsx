import { GoalForm } from "@/components/goals/GoalForm";

export default function GoalPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-rajdhani text-2xl font-bold tracking-wide text-white">
          Meta do Mês
        </h1>
        <p className="text-sm text-muted-foreground">
          Define o alvo exibido no dashboard TV.
        </p>
      </header>

      <GoalForm />
    </div>
  );
}
