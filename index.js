import AWS from 'aws-sdk'
import http from 'http'
import cheerio from 'cheerio'
import config from './config.js'

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
  // TODO getImageName
  /**
   * expect shape like
   * {
   *   'http://magiccards.info/al/en/232.html': 'al/en/black lotus.jpg'
   * }
   *
   */
  // let imageName = getImageName(blackLotusSrc)
  /**
   * expect shape like
   * {
   *   'http://magiccards.info/al/en/232.html': 'al/en/black lotus.jpg',
   *   'http://magiccards.info/al/en/233.html': 'al/en/black vise.jpg'
   * }
   *
   */
  // let imageName = getImageName(srcs)

  // let imageNameKeys = Object.keys(imageName)
  // for (var i = 0, len = imageNameKeys.length; i < len; i++) {
  //   let result = await putSrcToS3Promise(imageNameKeys[i], imageName[imageNameKeys[i]])
  // }
  let blackLotusSrc = await getBlackLotusSrcPromise()
  let result = await putSrcToS3Promise(blackLotusSrc, 'al/en/black lotus.jpg')
  console.log(result)
}().catch(console.log)

