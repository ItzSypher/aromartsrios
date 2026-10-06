"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle } from "@phosphor-icons/react";
import { whatsappLink } from "@/lib/site";

export const segments = [
  "Loja / varejo",
  "Hotel ou pousada",
  "Clínica ou consultório",
  "Academia ou spa",
  "Concessionária",
  "Escritório",
  "Showroom ou evento",
  "Outro",
];

const areas = ["Até 30 m²", "30 a 120 m²", "120 a 500 m²", "Acima de 500 m²", "Não sei"];

type Errors = Partial<Record<"nome" | "empresa" | "segmento" | "cidade" | "telefone", string>>;

const field =
  "w-full rounded-full border border-line bg-bg px-5 py-3.5 text-[16px] text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/15 aria-[invalid=true]:border-danger";

/**
 * Pedido de orçamento corporativo. Sem backend: valida e abre o WhatsApp
 * comercial com a mensagem pronta (canal que a empresa já atende hoje).
 */
export function LeadForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const [fragrancia, setFragrancia] = useState("");

  useEffect(() => {
    const onPick = (e: Event) => setFragrancia((e as CustomEvent<string>).detail);
    window.addEventListener("aromart:fragrancia", onPick);
    return () => window.removeEventListener("aromart:fragrancia", onPick);
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const next: Errors = {};
    if (!data.nome?.trim()) next.nome = "Informe seu nome.";
    if (!data.empresa?.trim()) next.empresa = "Informe o nome da empresa.";
    if (!data.segmento) next.segmento = "Escolha o segmento.";
    if (!data.cidade?.trim()) next.cidade = "Informe a cidade.";
    if ((data.telefone ?? "").replace(/\D/g, "").length < 10) next.telefone = "Informe um telefone com DDD.";
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`lead-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    const text = [
      "Olá! Quero um orçamento de aromatização para minha empresa.",
      "",
      `Nome: ${data.nome}`,
      `Empresa: ${data.empresa}`,
      `Segmento: ${data.segmento}`,
      `Cidade: ${data.cidade}`,
      `Área aproximada: ${data.area || "Não informada"}`,
      data.fragrancia ? `Fragrância de interesse: ${data.fragrancia}` : "",
      `Telefone: ${data.telefone}`,
      data.mensagem ? `\n${data.mensagem}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const url = whatsappLink(text);
    setSentUrl(url);
    window.open(url, "_blank", "noopener");
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`lead-${k}-erro`} className="px-5 text-sm text-danger">
        {errors[k]}
      </p>
    ) : null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sentUrl ? (
        <motion.div
          key="ok"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-start gap-4 py-10"
          role="status"
        >
          <CheckCircle size={44} weight="light" className="text-sage-deep" />
          <h3 className="text-2xl font-semibold tracking-tight">Pedido pronto no WhatsApp</h3>
          <p className="max-w-[44ch] text-muted">
            Abrimos a conversa com seus dados preenchidos. Só falta tocar em enviar. Se a janela não abriu,{" "}
            <a href={sentUrl} target="_blank" rel="noopener" className="font-medium text-ink underline underline-offset-4">
              abra aqui
            </a>
            .
          </p>
          <button onClick={() => setSentUrl(null)} className="text-sm text-muted underline underline-offset-4">
            Editar dados
          </button>
        </motion.div>
      ) : (
        <motion.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0 }} className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["nome", "Seu nome", "text", "name"],
              ["empresa", "Empresa", "text", "organization"],
            ] as const
          ).map(([name, label, type, auto]) => (
            <div key={name} className="grid gap-2">
              <label htmlFor={`lead-${name}`} className="px-1 text-sm font-medium">
                {label}
              </label>
              <input
                id={`lead-${name}`}
                name={name}
                type={type}
                autoComplete={auto}
                aria-invalid={!!errors[name]}
                aria-describedby={errors[name] ? `lead-${name}-erro` : undefined}
                className={field}
              />
              {err(name)}
            </div>
          ))}

          <div className="grid gap-2">
            <label htmlFor="lead-segmento" className="px-1 text-sm font-medium">
              Segmento
            </label>
            <select id="lead-segmento" name="segmento" defaultValue="" aria-invalid={!!errors.segmento} className={`${field} appearance-none`}>
              <option value="" disabled>
                Escolha
              </option>
              {segments.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            {err("segmento")}
          </div>

          <div className="grid gap-2">
            <label htmlFor="lead-cidade" className="px-1 text-sm font-medium">
              Cidade
            </label>
            <input id="lead-cidade" name="cidade" autoComplete="address-level2" aria-invalid={!!errors.cidade} className={field} />
            {err("cidade")}
          </div>

          <div className="grid gap-2">
            <label htmlFor="lead-telefone" className="px-1 text-sm font-medium">
              WhatsApp com DDD
            </label>
            <input id="lead-telefone" name="telefone" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.telefone} className={field} />
            {err("telefone")}
          </div>

          <div className="grid gap-2">
            <label htmlFor="lead-area" className="px-1 text-sm font-medium">
              Área do ambiente
            </label>
            <select id="lead-area" name="area" defaultValue="" className={`${field} appearance-none`}>
              <option value="">Não sei</option>
              {areas.slice(0, -1).map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <label htmlFor="lead-fragrancia" className="px-1 text-sm font-medium">
              Fragrância de interesse <span className="font-normal text-muted">(opcional)</span>
            </label>
            <input
              id="lead-fragrancia"
              name="fragrancia"
              value={fragrancia}
              onChange={(e) => setFragrancia(e.target.value)}
              placeholder="Ainda não sei, quero sugestões"
              className={field}
            />
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <label htmlFor="lead-mensagem" className="px-1 text-sm font-medium">
              Conte sobre o espaço <span className="font-normal text-muted">(opcional)</span>
            </label>
            <textarea
              id="lead-mensagem"
              name="mensagem"
              rows={3}
              className={`${field} rounded-[var(--radius-media)] py-3`}
            />
          </div>

          <button
            type="submit"
            className="rounded-full bg-primary py-4 text-sm font-medium text-primary-ink transition hover:opacity-90 active:scale-[0.98] sm:col-span-2"
          >
            Pedir orçamento pelo WhatsApp
          </button>
          <p className="text-xs text-muted sm:col-span-2">Seus dados vão só na mensagem para a nossa equipe comercial.</p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
