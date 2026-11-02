// /sitemap.xml: la home, la política de privacidad y, si hay artículos publicados, el blog y cada artículo
// (vercel.json reescribe /sitemap.xml -> /api/sitemap).
const blog = require("../lib/blog.js");

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  try {
    res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=86400");
    return res.status(200).send(blog.renderSitemap(await blog.listaArticulos()));
  } catch (e) {
    console.error("sitemap:", e && e.message);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(blog.renderSitemap([])); // sin la lista, al menos la home y la política de privacidad
  }
};
