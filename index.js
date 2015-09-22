import AWS from 'aws-sdk'
import http from 'http'
import config from './config.js'

AWS.config.update(config.credentials)

let s3 = new AWS.S3()

http.get('http://magiccards.info/scans/en/al/232.jpg', res => {
  s3.upload({
    Bucket: 'nukr-images',
    Key: 'mtg/black_lotus.jpg',
    ContentType: 'jpg',
    Body: res
  }, (err, data) => {
    console.log(err, data)
  })
})
