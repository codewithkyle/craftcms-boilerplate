const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const fs = require("fs");
const { PurgeCSS } = require('purgecss');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const server = http.createServer(app);
const ips = ["localhost", "::1", "127.0.0.1"];

app.post('/purge', async (req, res) => {
	if (ips.includes(req.ip)){
		const { css, html } = req.body;
		const purgeCSSResult = await new PurgeCSS().purge({
			content: [html],
			css: [css],
			safelist: {
				greedy: [/(.*\\.[\d\w]+)/],
			},
		});
		if (purgeCSSResult?.[0]?.css){
			return res.status(200).send(purgeCSSResult[0].css);
		} else {
			console.log(purgeCSSResult);
			return res.status(500).send("Failed to purge.");
		}
	} else {
		return res.status(401);
	}
});

server.listen(8080, "localhost");
server.on('listening', function() {
    console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});

