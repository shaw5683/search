const https = require('https');
const cheerio = require('cheerio');

const getContent = function (data) {
	const $ = cheerio.load(data);
	const result = $('#ires ol').html();
	let total = 0;
	if (result === null) {
		return 'No Result';
	} else {
		total = $('#resultStats').replace(/^Page\s\S+\sof\sabout\s(\S+)\sresults$/gi, '$1').replace(/,/g, '');
	}
	return {
		result,
		total
	};
};

const getSearchRes = function (ctx) {
	return new Promise((res, rej) => {
		https.get(`https://www.google.com/search?q=${encodeURIComponent(ctx.query.str)}&start=${(ctx.query.pageIndex - 1) || ''}0`, (resp) => {
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
		ctx.body = await getSearchRes(ctx);
		ctx.response.type = 'json';
	} catch (e) {
		console.log(e);
		ctx.response.type = 'text';
		ctx.body = 'something wrong';
	}
};

module.exports = search;
