import http from 'http'
import cheerio from 'cheerio'

let setSrcArray = []

async function findCurrentSets () {
  console.log('finding sets')
  var setsObject = {}
  let url = 'http://www.magicspoiler.com'
  let html = await getPageHtml(url)
  let $ = cheerio.load(html)
  let sets = $('.menu-item > a')
  for (var i = 0, n = sets.length; i < n; i++) {
    let setTitle = sets.eq(i).attr('title')
    let replacedTitle = setTitle.replace(/ /g, '_')
    let filterColon = replacedTitle.replace(/:/g, '')
    console.log(filterColon)
    setsObject[filterColon] = setTitle
  }
  console.log(setsObject)
  return setsObject
}

function collectSrcOnPage (html, srcArray) {
  let $ = cheerio.load(html)
  let imgOnPageCount = $('.spoiler-set-card').length

  console.log('total images on page: ' + imgOnPageCount)
  for (var i = 0, n = imgOnPageCount; i < n; i++) {
    let $img = $('.spoiler-set-card').eq(i).find('img')
    let $imgSrc = $img.attr('src')
    setSrcArray.push($imgSrc)
  }
}

function getNextPage (html) {
  let $ = cheerio.load(html)
  let nextPage = $('.current + a')
  if (nextPage.hasClass('larger')) {
    console.log('has larger')
    return getSetSrc(nextPage.attr('href'))
  }
  console.log(setSrcArray)
  return 'recursion over'
}

function getPageHtml (url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let html = ''
      res.on('data', (chunk) => html += chunk)
      res.on('end', () => {
        resolve(html)
      })
    })
  })
}

async function getSetSrc (url) {
  let setSrcArray = []
  let html = await getPageHtml(url)
  collectSrcOnPage(html, setSrcArray)
  getNextPage(html)
}

findCurrentSets()

export {
  getPageHtml
}
