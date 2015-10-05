import config from './config.js'
import getImageSrc from './src/getImageSrc'
import putSrcToS3 from './src/putSrcToS3'

async () => {
  let src = 'http://magiccards.info/al/en/232.html'
  let key = 'al/en/black lotus.jpg'
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
  let blackLotusSrc = await getImageSrc(src)
  let result = await putSrcToS3(blackLotusSrc, key, config.credentials)
  console.log(result)
}().catch(console.log)

