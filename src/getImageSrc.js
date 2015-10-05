import http from 'http'
import cheerio from 'cheerio'

function getHTML (src) {
  return new Promise((resolve, reject) => {
    http.get(src, res => {
      let html = ''
      res.on('data', (chunk) => html += chunk)
      res.on('end', () => {
        resolve(html)
      })
    })
  })
}

export default async function getImageSrcPromise (src) {
  let html = await getHTML(src)
  let $ = cheerio.load(html)
  let $img = $('table').eq(3).find('img')
  return $img.attr('src')
}

