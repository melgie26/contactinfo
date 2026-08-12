"use client";

import { FormEvent, useMemo, useState } from "react";
import { profile } from "./profile";

function prettyContext(value: string) {
  return value.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Home() {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [firstName, setFirstName] = useState("");
  const context = useMemo(() => {
    if (typeof window === "undefined") return { event: "", source: "" };
    const params = new URLSearchParams(window.location.search);
    return { event: params.get("event") || "", source: params.get("source") || "" };
  }, []);

  function saveContact() {
    const link = document.createElement("a");
    link.href = profile.vcard;
    link.download = `${profile.firstName}-${profile.lastName}.vcf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setFirstName(String(data.givenName || data.fullName || "").trim().split(" ")[0]);
    setStatus("sending");

    if (!profile.formEndpoint || profile.formEndpoint.includes("PASTE_")) {
      setStatus("success");
      return;
    }

    try {
      await fetch(profile.formEndpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          ...data,
          event: context.event,
          source: context.source || "direct",
          pageUrl: window.location.href,
          referrer: document.referrer,
        }),
      });
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const smsBody = encodeURIComponent(`Hi ${profile.firstName} — this is ${firstName || "[your name]"}. We just connected.`);
  const contextLabel = context.event ? prettyContext(context.event) : "";

  return (
    <main>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className="card" aria-label={`${profile.name} digital business card`}>
        <div className="identity">
          <div className="portrait-wrap">
            {profile.headshot ? <img className="portrait" src={profile.headshot} alt={`${profile.name} headshot`} /> : <div className="monogram" aria-hidden="true">ME</div>}
            <span className="available" title="Open to connecting" />
          </div>
          <p className="eyebrow">Digital introduction</p>
          <h1>{profile.name}</h1>
          <p className="role">{profile.title}<span> · </span>{profile.organization}</p>
          {contextLabel && <p className="context">We connected at <strong>{contextLabel}</strong></p>}

          <button className="primary save" type="button" onClick={saveContact}>
            <span className="button-icon">+</span> Save Matt’s contact
          </button>

          <nav className="links" aria-label="Matt's professional links">
            <a href={`tel:${profile.phone}`}>Call</a>
            <a href={`mailto:${profile.email}`}>Email</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={profile.website} target="_blank" rel="noreferrer">Website</a>
          </nav>
        </div>

        <div className="exchange">
          {status === "success" ? (
            <div className="success" role="status" aria-live="polite">
              <div className="check">✓</div>
              <p className="eyebrow">You’re all set</p>
              <h2>Thanks{firstName ? `, ${firstName}` : ""}.</h2>
              <p>Your details are on their way to Matt. Looking forward to staying connected.</p>
              <button className="secondary" type="button" onClick={saveContact}>Save Matt’s contact</button>
              <button className="text-button" type="button" onClick={() => setStatus("idle")}>Send another</button>
            </div>
          ) : (
            <>
              <p className="eyebrow">The other half of the handshake</p>
              <h2>Let’s stay connected.</h2>
              <p className="intro">Send me your name and mobile—everything else is optional.</p>
              <a className="primary sms-primary" href={`sms:${profile.phone}?&body=${smsBody}`}><span>Text Matt now</span><span>↗</span></a>
              <div className="divider form-divider"><span>or share your details below</span></div>

              <form onSubmit={submit} autoComplete="on">
                <div className="field">
                  <label htmlFor="fullName">Your name</label>
                  <input id="fullName" name="fullName" type="text" autoComplete="name" placeholder="First and last name" required />
                </div>
                <div className="field">
                  <label htmlFor="phone">Mobile number</label>
                  <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(555) 555-1234" required />
                </div>
                <div className="field">
                  <label htmlFor="email">Email <span>Optional</span></label>
                  <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
                </div>
                <div className="field">
                  <label htmlFor="notes">Note <span>Optional</span></label>
                  <textarea id="notes" name="notes" rows={3} placeholder="A quick reminder of where we met" />
                </div>

                <button className="optional-toggle" type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
                  <span>{expanded ? "Hide" : "Add"} organization or title</span><span>{expanded ? "−" : "+"}</span>
                </button>

                <div className={`optional-fields ${expanded ? "open" : ""}`} aria-hidden={!expanded}>
                  <div className="split">
                    <div className="field">
                      <label htmlFor="organization">Organization <span>Optional</span></label>
                      <input id="organization" name="organization" type="text" autoComplete="organization" placeholder="Company or local" tabIndex={expanded ? 0 : -1} />
                    </div>
                    <div className="field">
                      <label htmlFor="title">Title <span>Optional</span></label>
                      <input id="title" name="title" type="text" autoComplete="organization-title" placeholder="Your role" tabIndex={expanded ? 0 : -1} />
                    </div>
                  </div>
                </div>

                {status === "error" && <p className="error" role="alert">That didn’t go through. Please try again or text Matt instead.</p>}
                <button className="primary" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send my contact"}<span>→</span></button>
              </form>
              <p className="privacy">Your details go directly to Matt and are never shared. Include an email to receive one brief acknowledgment.</p>
            </>
          )}
        </div>
      </section>
      <footer>Made for real-world connections.</footer>
    </main>
  );
}
