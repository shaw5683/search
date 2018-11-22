const router = require('koa-router')()
const https = require('https');

router.get('/', async (ctx, next) => {
  await ctx.render('index')
})

router.get('/string', async (ctx, next) => {
  let data = '';
	ctx.body = await new Promise((res, rej) => {
	  https.get('https://www.google.com/', (resp) => {

			// A chunk of data has been recieved.
			resp.on('data', (chunk) => {
				data += chunk;
			});

			// The whole response has been received. Print out the result.
			resp.on('end', () => {
				console.log(data);
				res(data);
			});

		}).on("error", (err) => {
			console.log("Error: " + err.message);
			rej('error');
		});
	})
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
