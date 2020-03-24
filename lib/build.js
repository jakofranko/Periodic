'use strict'

const fs = require('fs')
const libs = fs.readdirSync('./scripts/lib').filter((file) => { return file.indexOf('.js') > 0 && file !== 'build.js' })
const scripts = fs.readdirSync('./scripts').filter((file) => { return file.indexOf('.js') > 0 })
const styles = fs.readdirSync('./links').filter((file) => { return file.indexOf('.css') > 0 })

function cleanup (txt) {
  const lines = txt.split('\n')
  let output = ''
  for (const line of lines) {
    if (line.trim() === '') { continue }
    if (line.trim().substr(0, 2) === '//') { continue }
    if (line.indexOf('/*') > -1 && line.indexOf('*/') > -1) { continue }
    output += line + '\n'
  }
  return output
}

const wrapper = `
<!DOCTYPE html>
<html lang="en">
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>APPNAME</title>
  </head>
  <body>
    <script>
      ${libs.reduce((acc, item) => { return `${acc}// Including Library ${item}\n\n${fs.readFileSync('./scripts/lib/' + item, 'utf8')}\n` }, '')}
      ${scripts.reduce((acc, item) => { return `${acc}// Including Script ${item}\n\n${fs.readFileSync('./scripts/' + item, 'utf8')}\n` }, '')}
      const client = new Client()
      client.install(document.body)
      window.addEventListener('load', () => { 
        client.start()
      })
    </script>
    <style>
    ${styles.reduce((acc, item) => { return `${acc}/* Including Style ${item} */ \n\n${fs.readFileSync('./links/' + item, 'utf8')}\n` }, '')}
    </style>
  </body>
</html>`

fs.writeFileSync('index.html', cleanup(wrapper))

console.log('Done.')