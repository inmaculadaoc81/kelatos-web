Kelatos Informática

Sitio web corporativo de Kelatos Informática.

Servicios principales:
- Recuperación de datos.
- Servicio técnico de ordenadores.
- Desarrollo de software a medida.
- Automatización e integración de sistemas.

Web: https://kelatos.com/
Teléfono: +34 918 29 46 60
WhatsApp: +34 649 97 01 28

BLOG (/blog):
- Los artículos los crea y aprueba el agente SEO de Kelatos (organización kelatos_informatica) y se leen en vivo de
  https://db.affirmatechnology.com/kelatos-api/publico/blog?org=kelatos_informatica (solo lectura, sin claves).
- api/blog.js + lib/blog.js generan /blog y /blog/<slug> en el servidor; copian de index.html la cabecera, el pie, WhatsApp y cookies.
- api/sitemap.js genera /sitemap.xml (home, privacidad y, si hay artículos, el blog y cada artículo). El sitemap.xml estático se retiró.
- Mientras no haya artículos, /blog sale con noindex y fuera del sitemap. En index.html NO hay enlace Blog todavía: añadirlo al menú
  (cabecera y menú móvil) y al pie cuando se publique el primer artículo.
- Estilos en assets/blog.css.
