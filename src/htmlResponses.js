const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const client2 = fs.readFileSync(`${__dirname}/../client/client2.html`);
const client3 = fs.readFileSync(`${__dirname}/../client/client3.html`);

const getPage2 = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(client2);
  response.end();
};
const getPage3 = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(client3);
  response.end();
};

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' }); // allows written status code and JSON of headers to send back
  response.write(index);
  response.end();
};

module.exports.getIndex = getIndex;
module.exports.getPage2 = getPage2;
module.exports.getPage3 = getPage3;
