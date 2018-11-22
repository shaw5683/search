const https = require('https');
const cheerio = require('cheerio');

const getContent = function (data) {
	console.log(data);
	const $ = cheerio.load(data);
	console.log($('.srg').html());
	return $('.srg').html();
};

const getSearchRes = function (ctx) {
	return new Promise((res, rej) => {
		https.get(`https://www.google.com/search?q=${encodeURIComponent(ctx.query.str)}&start=${ctx.query.pageIndex || 1}0`, (resp) => {
			let data = '';

			// A chunk of data has been recieved.
			resp.on('data', (chunk) => {
				data += chunk;
			});

			// The whole response has been received. Print out the result.
			resp.on('end', () => {
				res(data);
			});

		}).on("error", (err) => {
			console.log("Error: " + err.message);
			rej('error');
		});
	})
};

const search = async (ctx, next) => {
	console.log(ctx.query);
	try {
		ctx.body = await getSearchRes(ctx);
	} catch (e) {
		console.log(e);
		ctx.body = 'something wrong';
	}
};

module.exports = search;
