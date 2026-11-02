// Páginas del blog (/blog y /blog/<slug>), generadas en el servidor con los artículos de la API pública de Kelatos.
// vercel.json reescribe /blog -> /api/blog y /blog/<slug> -> /api/blog?slug=<slug>.
const blog = require("../lib/blog.js");

// Vercel guarda la respuesta 5 minutos y, si la API de Kelatos no responde, sigue sirviendo la última copia hasta 1 día.
const CACHE_OK = "public, s-maxage=300, stale-while-revalidate=86400";
const CACHE_CORTA = "public, s-maxage=30, stale-while-revalidate=300";

module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") return res.status(405).send("Método no permitido");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  const slug = typeof req.query.slug === "string" ? req.query.slug.toLowerCase() : "";
  try {
    if (!slug) {
      res.setHeader("Cache-Control", CACHE_OK);
      return res.status(200).send(blog.renderPortada(await blog.listaArticulos()));
    }
    const a = await blog.articulo(slug);
    if (!a) {
      res.setHeader("Cache-Control", CACHE_CORTA);
      return res.status(404).send(blog.renderNoEncontrado());
    }
    // Los «relacionados» son un extra: si la lista falla, el artículo se sirve igual.
    const todos = await blog.listaArticulos().catch(() => []);
    res.setHeader("Cache-Control", CACHE_OK);
    return res.status(200).send(await blog.renderArticulo(a, todos));
  } catch (e) {
    console.error("blog:", e && e.message);
    res.setHeader("Cache-Control", "no-store");
    // Portada: sin la lista, una versión vacía amable; artículo: aviso de reintento.
    if (!slug) return res.status(200).send(blog.renderPortada([]));
    return res.status(503).send("El artículo no está disponible ahora mismo. Inténtalo de nuevo en unos minutos.");
  }
};
