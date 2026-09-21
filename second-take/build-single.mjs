// Folds the built app into one self-contained HTML file.
// Run it with: npm run build:single
// The result opens by double-clicking it - no server, no install, no internet.
import { readFileSync, writeFileSync } from 'node:fs'

const css = readFileSync('dist/assets/app.css', 'utf8')
const js = readFileSync('dist/assets/app.js', 'utf8')

// A literal </script> anywhere in the bundle would end the tag early.
const safeJs = js.replace(/<\/script/gi, '<\\/script')

const page = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta name="description" content="Second Take - practical reentry coaching, built for people preparing for release." />
<title>Second Take</title>
<style>
${css}
</style>
</head>
<body>
<div id="root"></div>
<script>
${safeJs}
</script>
</body>
</html>
`

writeFileSync('Second-Take-Demo.html', page)
console.log(`Second-Take-Demo.html written (${(page.length / 1024).toFixed(0)} KB)`)
