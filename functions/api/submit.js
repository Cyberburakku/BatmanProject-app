// Runs on Cloudflare whenever the form on index.html is submitted (POST /api/submit).
export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const name = (form.get("name") || "").toString().trim();
  const email = (form.get("email") || "").toString().trim();
  const message = (form.get("message") || "").toString().trim();

  if (!name || !email || !message) {
    return new Response("Please fill in every field.", { status: 400 });
  }

  await env.DB.prepare(
    "INSERT INTO answers (name, email, message, created_at) VALUES (?, ?, ?, ?)"
  )
    .bind(name, email, message, new Date().toISOString())
    .run();

  // Send them back to the homepage with a flag that shows the "thanks" banner.
  return Response.redirect(new URL("/?submitted=1", request.url), 303);
}
