const real = require("nodemailer");
// Los formularios de contacto se envían desde el servidor de Kelatos (el SMTP guardado en Vercel falla con EAUTH). Si el servidor no responde, se usa el SMTP de Vercel como antes.
const SITIO = "kelatos";
const RELAY_URL = process.env.WEB_CONTACTO_URL || "https://db.affirmatechnology.com/kelatos-api/webhooks/web-contacto";

async function viaKelatos(msg) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 15000);
  try {
    const r = await fetch(RELAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sitio: SITIO, asunto: msg.subject, texto: msg.text, responder_a: msg.replyTo }),
      signal: ctl.signal,
    });
    const j = await r.json().catch(() => ({}));
    return r.ok && j.ok === true;
  } catch (e) {
    return false;
  } finally {
    clearTimeout(t);
  }
}



module.exports.createTransport = function (opts) {
  let tr = null;
  return {
    async verify() { return true; },
    async sendMail(msg) {
      if (await viaKelatos(msg)) return { accepted: [msg.replyTo], via: "kelatos" };
      tr = tr || real.createTransport(opts);
      return tr.sendMail(msg);
    },
  };
};
