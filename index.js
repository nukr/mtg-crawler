import AWS from 'aws-sdk'
import http from 'http'
import cheerio from 'cheerio'
import config from './config.example.js'

function getBlackLotusSrcPromise () {
  return new Promise((resolve, reject) => {
    http.get('http://magiccards.info/al/en/232.html', res => {
      let html = ''
      res.on('data', (chunk) => html += chunk)
      res.on('end', () => {
        let $ = cheerio.load(html)
        let $img = $('table').eq(3).find('img')
        resolve($img.attr('src'))
      })
    })
  })
}

function putSrcToS3Promise (src, key) {
  AWS.config.update(config.credentials)
  let s3 = new AWS.S3()
  console.log(s3)

  return new Promise((resolve, reject) => {
    http.get(src, res => {
      s3.upload({
        Bucket: 'nukr-images',
        Key: key,
        ContentType: 'jpg',
        ACL: 'public-read',
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
}().catch(console.log)

