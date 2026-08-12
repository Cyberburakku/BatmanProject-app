// Serves the password-protected /answers page — lists every row saved from the form.

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function isAuthorized(request, env) {
  const header = request.headers.get("Authorization") || "";
  if (!header.startsWith("Basic ")) return false;
  const decoded = atob(header.slice(6));
  const password = decoded.slice(decoded.indexOf(":") + 1);
  return password === env.ANSWERS_PASSWORD;
}

function askForPassword() {
  return new Response("Password required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Answers"' },
  });
}

export async function onRequestGet({ request, env }) {
  if (!env.ANSWERS_PASSWORD || !isAuthorized(request, env)) {
    return askForPassword();
  }

  const { results } = await env.DB.prepare(
    "SELECT id, name, email, message, created_at FROM answers ORDER BY id DESC"
  ).all();

  const rows = results
    .map(
      (r) => `
    <tr>
      <td>${r.id}</td>
      <td>${escapeHtml(r.name)}</td>
      <td>${escapeHtml(r.email)}</td>
      <td>${escapeHtml(r.message)}</td>
      <td>${escapeHtml(r.created_at)}</td>
    </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Answers</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap');
  * { box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #0A0E1A; color: #FFFFFF; padding: 40px; margin: 0; }
  h1 { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.05em; color: #00A3FF; font-size: 32px; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.15); font-size: 14px; }
  th { color: #FF6B00; text-transform: uppercase; font-size: 12px; letter-spacing: 0.08em; }
  tr:hover { background: rgba(255,255,255,0.03); }
</style>
</head>
<body>
  <h1>Submitted Answers</h1>
  <table>
    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Message</th><th>Submitted</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="5">No answers yet.</td></tr>'}</tbody>
  </table>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}
