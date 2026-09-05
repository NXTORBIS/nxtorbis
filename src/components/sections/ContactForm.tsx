"use client";

import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { company, contactServiceOptions, cta } from "@/content/site";
import { cx } from "@/lib/cx";
import { hasBackend, submitContact, type SubmitResult } from "@/lib/contact";
import { Button } from "@/components/ui/Button";
import { GlassSelect } from "@/components/ui/GlassSelect";
import { ArrowUpRight, Check } from "@/components/ui/Icons";
import styles from "./ContactForm.module.css";

type Values = { name: string; email: string; service: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "submitting" | "sent" | "mailto" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (!v.service) e.service = "Please choose the service you are interested in.";
  if (v.message.trim().length < 20) e.message = "Tell us a little more — at least a couple of sentences.";
  return e;
}

export function ContactForm() {
  const id = useId();
  const params = useSearchParams();
  const presetService = params.get("service");
  const intent = params.get("intent");
  const product = params.get("product");

  const context = useMemo(() => {
    if (product) return product;
    if (intent === "quote") return "Quote request";
    if (intent === "product") return "Product enquiry";
    return undefined;
  }, [intent, product]);

  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    service: presetService && (contactServiceOptions as readonly string[]).includes(presetService) ? presetService : product ? "Other" : "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<SubmitResult | null>(null);

  useEffect(() => {
    if (presetService && (contactServiceOptions as readonly string[]).includes(presetService)) {
      setValues((v) => ({ ...v, service: presetService }));
    }
  }, [presetService]);

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (touched[k]) setErrors(validate(next));
  };

  const blur = (k: keyof Values) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(values));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ name: true, email: true, service: true, message: true });
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    setStatus("submitting");
    const res = await submitContact({ ...values, context });
    setResult(res);
    if (res.kind === "sent") setStatus("sent");
    else if (res.kind === "mailto") {
      setStatus("mailto");
      window.location.href = res.href;
    } else setStatus("error");
  };

  const disabled = status === "submitting" || status === "sent";

  if (status === "sent") {
    return (
      <div className={cx("glass", "glass--l3", "glass--panel", styles.success)} role="status" aria-live="polite">
        <span className={styles.successIcon}>
          <Check size={20} />
        </span>
        <h3 className="t-h3">Thank you — your message has been sent.</h3>
        <p className="t-body">We will read it carefully and reply to {values.email}.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate aria-describedby={`${id}-note`}>
      {context && (
        <p className={cx("glass", "glass--l1", "glass--pill", styles.context)}>
          <span className="num">CONTEXT</span>
          <span>{context}</span>
        </p>
      )}

      <div className={styles.row}>
        <Field id={`${id}-name`} label="Full name" error={touched.name ? errors.name : undefined}>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={set("name")}
            onBlur={blur("name")}
            disabled={disabled}
            aria-invalid={Boolean(touched.name && errors.name) || undefined}
            aria-describedby={touched.name && errors.name ? `${id}-name-error` : undefined}
            className={styles.input}
            placeholder="Your name"
          />
        </Field>
        <Field id={`${id}-email`} label="Email address" error={touched.email ? errors.email : undefined}>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={values.email}
            onChange={set("email")}
            onBlur={blur("email")}
            disabled={disabled}
            aria-invalid={Boolean(touched.email && errors.email) || undefined}
            aria-describedby={touched.email && errors.email ? `${id}-email-error` : undefined}
            className={styles.input}
            placeholder="you@company.com"
          />
        </Field>
      </div>

      <Field id={`${id}-service`} label="Service" error={touched.service ? errors.service : undefined}>
        <GlassSelect
          id={`${id}-service`}
          name="service"
          value={values.service}
          options={contactServiceOptions}
          placeholder="Choose the service you are interested in"
          onChange={(v) => {
            const next = { ...values, service: v };
            setValues(next);
            if (touched.service) setErrors(validate(next));
          }}
          onBlur={blur("service")}
          disabled={disabled}
          invalid={Boolean(touched.service && errors.service)}
          describedBy={touched.service && errors.service ? `${id}-service-error` : undefined}
        />
      </Field>

      <Field id={`${id}-message`} label="Message" error={touched.message ? errors.message : undefined} hint="What are you building, for whom, and what does success look like?">
        <textarea
          id={`${id}-message`}
          name="message"
          rows={6}
          required
          value={values.message}
          onChange={set("message")}
          onBlur={blur("message")}
          disabled={disabled}
          aria-invalid={Boolean(touched.message && errors.message) || undefined}
          aria-describedby={touched.message && errors.message ? `${id}-message-error` : undefined}
          className={cx(styles.input, styles.textarea)}
          placeholder="Tell us about your project"
        />
      </Field>

      <div className={styles.foot}>
        <Button type="submit" variant="primary" size="lg" arrow intensity="major" magnetic fillFrom="left" loading={status === "submitting"} loadingLabel="Sending…" disabled={disabled}>
          {cta.conversation.label}
        </Button>
        <p id={`${id}-note`} className="t-xs">
          {hasBackend
            ? "We reply by email, usually within a few working days."
            : "Submitting opens a pre-filled message in your email app, addressed to " + company.email + "."}
        </p>
      </div>

      {status === "mailto" && result?.kind === "mailto" && (
        <div className={cx("glass", "glass--l2", "glass--panel", styles.notice)} role="status" aria-live="polite">
          <p className="t-sm">
            Your email app should have opened with the message ready to send. If it did not,{" "}
            <a href={result.href} className={styles.noticeLink}>
              open the pre-filled email <ArrowUpRight size={14} />
            </a>{" "}
            or write to <a href={`mailto:${company.email}`} className={styles.noticeLink}>{company.email}</a>.
          </p>
        </div>
      )}

      {status === "error" && result?.kind === "error" && (
        <div className={cx("glass", "glass--l2", "glass--panel", styles.notice, styles.noticeError)} role="alert">
          <p className="t-sm">
            {result.message}{" "}
            <a href={`mailto:${company.email}`} className={styles.noticeLink}>
              {company.email}
            </a>
          </p>
        </div>
      )}
    </form>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cx(styles.field, error && styles.fieldError)}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className={styles.hint}>{hint}</p>
      ) : null}
    </div>
  );
}
