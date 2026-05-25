"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("That doesn't look like a valid email."),
});

type FormValues = z.infer<typeof schema>;

type Status = "idle" | "submitting" | "success" | "error";

const DUPLICATE_VIOLATION = "23505";

export function WaitlistForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  async function onSubmit({ email }: FormValues) {
    setStatus("submitting");
    setErrorMessage(null);

    let error: { code?: string } | null = null;
    try {
      const supabase = createClient();
      const result = await supabase
        .from("waitlist")
        .insert({ email: email.trim().toLowerCase() });
      error = result.error;
    } catch (e) {
      console.log("Error submitting waitlist form:", e);
      console.error(e);
      setStatus("error");
      setErrorMessage("Waitlist isn't configured yet. Try again later.");
      return;
    }

    if (error) {
      if (error.code === DUPLICATE_VIOLATION) {
        setStatus("success");
        reset();
        return;
      }
      setStatus("error");
      setErrorMessage(
        "Something went wrong on our end. Try again in a moment.",
      );
      return;
    }

    setStatus("success");
    reset();
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-lg border border-hairline bg-card p-xl"
      >
        <p className="font-display text-h2 text-ink">You are on the list.</p>
        <p className="mt-sm text-body text-ink-muted">
          We will send one short note when Iqama is ready. Nothing before that.
          Jazak Allah khayr.
        </p>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-md"
    >
      <div className="flex flex-col gap-xs">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          disabled={submitting}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="text-caption text-accent" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full hover:cursor-pointer sm:w-auto"
      >
        <ArrowRight />
        {submitting ? "Joining…" : "Join the waitlist"}
      </Button>

      {status === "error" && errorMessage && (
        <p className="text-caption text-accent" role="alert" aria-live="polite">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
