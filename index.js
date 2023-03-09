const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const replaceTemplate = require('./modules/replace-template');

// READING ALL THE FILES AT STARTING
const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
);
const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8'
);
const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url);

    // OVERVIEW Page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        });

        const cardsHtml = dataObj
            .map((el) => replaceTemplate(tempCard, el))
            .join('');

        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

        // PRODUCT Page
    } else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        });
        const id = Number(query.substring(3));
        const product = dataObj[id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

        // NOT FOUND Page
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
        });
        res.end('<h1>Wrong Request!</h1>');
    }
});

// Listening at port 8000

server.listen('8000', '127.0.0.1', (err) => {
    if (!err) {
        console.log('Listening on port 8000...');
    }
});
