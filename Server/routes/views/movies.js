const router = require('koa-router')()
const mongoose = require('mongoose')
const ObjectID = require('mongodb').ObjectID

// router.get('/movies', async (ctx, next) => {
//   const Movie = mongoose.model('Movie')
//   const movies = await Movie.find({}).sort({
//     'meta.createdAt': -1
//   })
//
//   ctx.body = { success: true, message: '查询成功', movies }
// })

router.get('/movies', async (ctx, next) => {
  let cate = ctx.request.query.cate
  let country = ctx.request.query.country
  let year = ctx.request.query.year
  let rate = ctx.request.query.rate
  let page = parseInt(ctx.request.query.page)
  let pageNum = parseInt(ctx.request.query.pageNum)
  let keywords = parseInt(ctx.request.query.keywords) || ctx.request.query.keywords

  if (!page) { page = 1, pageNum = 9999 }
  if (page && !pageNum) { page = 1, pageNum = 10 }

  let params = {}
  if (country && country.indexOf('all') < 0) {
    params.country = new RegExp(`^.*`+country+`.*$`)
  }
  if (year && year.indexOf('all') < 0) {
    if (year.indexOf('年代') > -1) {
      let gte = parseInt(year.split('年代')[0]), lte = gte + 9
      params.year = { $gte:gte, $lte: lte}
    } else {
      params.year = new RegExp(`^.*`+year+`.*$`)
    }
  }
  if (rate) {
    let gte = rate.split(',')[0], lte = rate.split(',')[1]
    params.rate = { $gte:gte, $lte: lte}
  }

  const Movie = mongoose.model('Movie')
  let movies = []
  console.log('keywords: ',keywords)
  if (keywords) {
    let queryrate = parseFloat(keywords)
    console.log('queryrate: ',queryrate)
    params = {
      $or: [
        { country: new RegExp(`^.*`+keywords+`.*$`) },
        { year: new RegExp(`^.*`+keywords+`.*$`) },
        { summary: new RegExp(`^.*`+keywords+`.*$`) }
      ]
    }
    movies = await Movie.find(params).limit(pageNum).skip((page-1) * pageNum).sort({ 'meta.createdAt': -1 })
  } else {
    movies = await Movie.find(params).limit(pageNum).skip((page-1) * pageNum).sort({
      'meta.createdAt': -1
    })
  }

  ctx.body = { success: true, message: '查询成功', rescode: 20010, data: { movies, legth: movies.length } }
})

router.get('/movies/:id', async (ctx, next) => {
  const Movie = mongoose.model('Movie')
  const id = ctx.params.id
  const movie = await Movie.findOne({id:id}).sort({
    'meta.createdAt': -1
  })

  ctx.body = { success: true, message: '查询成功', rescode: 20020, data: { movie } }
})

router.get('/categories', async (ctx, next) => {
  const Category = mongoose.model('Category')
  const categories = await Category.find({}).sort({
    'meta.createdAt': -1
  })

  ctx.body = { success: true, message: '查询成功', rescode: 20030, data: { categories } }
})

router.get('/category/:id', async (ctx, next) => {
  const Category = mongoose.model('Category')
  const id = ctx.params.id
  const category = await Category.findOne({_id:id})

  let movies = [], moviesid = category.movies
  const Movie = mongoose.model('Movie')
  for (let i=0; i<moviesid.length; i++) {
    let item = moviesid[i]
    let movie = await Movie.findOne({_id:mongoose.Types.ObjectId(item)})
    movies.push(movie)
  }
  if (movies !== '') {
    ctx.body = { success: true, message: '查询成功', rescode: 20020, data: { category, movies, length: movies.length } }
  } else {
    ctx.body = { success: false, message: '查询失败', rescode: 20021, data: { movies } }
  }
})

module.exports = router
