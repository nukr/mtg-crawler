import http from 'http'
import cheerio from 'cheerio'

var setPageCount = 0

function gatherSrcFromPage (html) {
  let $ = cheerio.load(html)
  if (setPageCount === 0) {
    if (!$('.last').hasClass()) {
      let selArrLen = $('.larger').length
      let maxPageUrl = $('.larger').eq(selArrLen - 1).attr('href')
      let urlArray = maxPageUrl.split('/')
      setPageCount = urlArray[urlArray.length - 2]
      console.log(setPageCount)
    }
    var lastPageElement = $('.wp-pagenavi')
  }

  let imgArray = []
  let imgOnPageCount = $('.spoiler-set-card').length
  console.log(imgOnPageCount)
  for (var i = 0, n = imgOnPageCount; i < n; i++) {
    let $img = $('.spoiler-set-card').eq(i).find('img')
    let $imgSrc = $img.attr('src')
    imgArray.push($imgSrc)
  }
  return imgArray
}

function gatherSpoilerSrcArray (url) {
  return new Promise((resolve, reject) => {
    http.get('http://www.magicspoiler.com/battle-for-zendikar/', res => {
      let html = ''
      res.on('data', (chunk) => html += chunk)
      res.on('end', () => {
        let srcArray = gatherSrcFromPage(html)
        resolve(srcArray)
      })
    })
  })
}

gatherSpoilerSrcArray('http://www.magicspoiler.com/battle-for-zendikar/')

async () => {

}
