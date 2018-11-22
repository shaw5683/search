const https = require('https');
const cheerio = require('cheerio');

const getContent = function (data) {
	const $ = cheerio.load(data);
	return $('#rso .srg').html();
};

const getSearchRes = function () {
	return new Promise((res, rej) => {
		https.get(`https://www.google.com/search?q=${ctx.query.str}&start=${ctx.query.pageIndex || 1}0`, (resp) => {
			let data = '';

			// A chunk of data has been recieved.
			resp.on('data', (chunk) => {
				data += chunk;
			});

			// The whole response has been received. Print out the result.
			resp.on('end', () => {
				res(getContent(data));
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
		ctx.body = await getSearchRes();
	} catch (e) {
		ctx.body = 'something wrong';
	}
};

module.exports = search;
