import http from 'http'
import AWS from 'aws-sdk'

export default function putSrcToS3Promise (src, key, credentials) {
  AWS.config.update(credentials)
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
