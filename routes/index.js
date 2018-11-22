const router = require('koa-router')()
const search = require('../controllers/search');

router.get('/', async (ctx, next) => {
  await ctx.render('index')
});

router.get('/search', search);

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
});

module.exports = router;
