import AWS from 'aws-sdk'
import http from 'http'
import cheerio from 'cheerio'
import config from './config.js'

function getBlackLotusSrcPromise () {
  return new Promise((resolve, reject) => {
    http.get('http://magiccards.info/al/en/232.html', res => {
      let html = null
      res.on('data', (chunk) => html += chunk)
      res.on('end', () => {
        html = html.toString()
        let $ = cheerio.load(html)
        let $img = $('table').eq(3).find('img').eq(0)
        resolve($img.attr('src'))
      })
    })
  })
}

function putSrcToS3Promise (src, key) {
  AWS.config.update(config.credentials)
  let s3 = new AWS.S3()

  return new Promise((resolve, reject) => {
    http.get(src, res => {
      s3.upload({
        Bucket: 'nukr-images',
        Key: key,
        ContentType: 'jpg',
        Body: res
      }, (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
    })
  })
}

async () => {
  let blackLotusSrc = await getBlackLotusSrcPromise()
  let result = await putSrcToS3Promise(blackLotusSrc, 'mtg/black_lotus.jpg')
  console.log(result)
}()

