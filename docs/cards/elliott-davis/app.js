const ELLIOTT_PHONE = "+17809992176";
const params = new URLSearchParams(location.search);
const eventName = params.get("event") || "";
const pretty = value => value.replace(/[-_]+/g, " ").replace(/\b\w/g, character => character.toUpperCase());
const smsLink = body => `sms:${ELLIOTT_PHONE}?&body=${encodeURIComponent(body)}`;

if (eventName) {
  const context = document.querySelector("#context");
  const strong = document.createElement("strong");
  strong.textContent = pretty(eventName);
  context.append("We connected at ", strong);
  context.hidden = false;
}

document.querySelector("#quick-text").href = smsLink("Hi Elliott — we just connected.");

const toggle = document.querySelector("#optional-toggle");
const optional = document.querySelector("#optional-fields");
toggle.addEventListener("click", () => {
  const open = optional.hidden;
  optional.hidden = !open;
  optional.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.children[0].textContent = `${open ? "Hide" : "Add"} organization or title`;
  toggle.children[1].textContent = open ? "−" : "+";
});

document.querySelector("#contact-form").addEventListener("submit", event => {
  event.preventDefault();
  const details = Object.fromEntries(new FormData(event.currentTarget).entries());
  const lines = [
    `Hi Elliott — this is ${String(details.fullName).trim()}. We just connected${eventName ? ` at ${pretty(eventName)}` : ""}.`,
    "",
    `Mobile: ${String(details.phone).trim()}`,
  ];

  if (details.email) lines.push(`Email: ${String(details.email).trim()}`);
  if (details.organization) lines.push(`Organization: ${String(details.organization).trim()}`);
  if (details.title) lines.push(`Title: ${String(details.title).trim()}`);
  if (details.notes) lines.push("", `Note: ${String(details.notes).trim()}`);

  location.href = smsLink(lines.join("\n"));
});
