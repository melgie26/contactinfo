// Paste the deployed Google Apps Script Web App URL here when it is ready.
const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbyKBTHHK58H3yPIZufwN8xLG2jG85322Aw3Wt06a5EyKN60zDx_meSOhUse7z7fj-w9/exec";
const params = new URLSearchParams(location.search);
const eventName = params.get("event") || "";
const source = params.get("source") || "direct";
const pretty = value => value.replace(/[-_]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());

if (eventName) {
  const context = document.querySelector("#context");
  context.innerHTML = `We connected at <strong>${pretty(eventName).replace(/[<>&]/g, "")}</strong>`;
  context.hidden = false;
}

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

const form = document.querySelector("#contact-form");
const error = document.querySelector("#error");
const submit = document.querySelector("#submit");
form.addEventListener("submit", async event => {
  event.preventDefault();
  error.hidden = true;
  if (FORM_ENDPOINT.includes("PASTE_")) {
    error.textContent = "The contact exchange is being connected. Please text Matt instead for now.";
    error.hidden = false;
    return;
  }
  const data = Object.fromEntries(new FormData(form).entries());
  submit.disabled = true; submit.textContent = "Sending…";
  try {
    await fetch(FORM_ENDPOINT, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ ...data, event: eventName, source, pageUrl: location.href, referrer: document.referrer }) });
    document.querySelector("#form-view").hidden = true;
    document.querySelector("#success-view").hidden = false;
    const first = String(data.fullName).trim().split(" ")[0];
    document.querySelector("#thanks").textContent = `Thanks${first ? `, ${first}` : ""}.`;
    form.reset();
  } catch (_) {
    error.textContent = "That didn’t go through. Please try again or text Matt instead."; error.hidden = false;
  } finally { submit.disabled = false; submit.innerHTML = "Text this info to Matt <span>→</span>"; }
});

document.querySelector("#send-another").addEventListener("click", () => {
  document.querySelector("#success-view").hidden = true; document.querySelector("#form-view").hidden = false;
});
document.querySelector("#sms").href = `sms:+14036194908?&body=${encodeURIComponent("Hi Matt — this is [your name]. We just connected.")}`;
