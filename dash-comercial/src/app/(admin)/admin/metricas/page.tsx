import { MetricsEditor } from "@/components/metrics/MetricsEditor";

export default function MetricsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-rajdhani text-2xl font-bold tracking-wide text-white">
          Métricas Mensais
        </h1>
        <p className="text-sm text-muted-foreground">
          Calls e conversão por closer. Alterações são gravadas ao salvar.
        </p>
      </header>

      <MetricsEditor />
    </div>
  );
}
