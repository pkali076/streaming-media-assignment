const fs = require('fs'); // pull in the file system module
const path = require('path');

// make new loadFile function for every instance of file necessary to load
// the refactor

// stream function to be called later
const streamFunction = (response, stream) => {
  stream.on('open', () => {
    stream.pipe(response);
  });
  stream.on('error', (streamErr) => {
    response.end(streamErr);
  });
};

const writeFunction = (response, start, end, chunksize, total, fileType) => {
  response.writeHead(206, {
    'Content-Range': `bytes ${start} - ${end}/${total}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunksize,
    'Content-Type': fileType,
  });
};

// loadFile function for loading the data and file type
const loadFile = (request, response, file, fileType) => {
  const fileCheck = path.resolve(__dirname, file);

  fs.stat(fileCheck, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end(err);
    }

    let { range } = request.headers;

    if (!range) {
      range = 'bytes=0-';
    }

    const positions = range.replace(/bytes=/, '').split('-');
    let start = parseInt(positions[0], 10);
    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

    if (start > end) {
      start = end - 1;
    }
    const chunksize = (end - start) + 1;



    writeFunction(response, start, end, chunksize, total, fileType);
    const stream = fs.createReadStream(fileCheck, { start, end });
    streamFunction(response, stream);

    return stream;
  });
};

module.exports.loadFile = loadFile;
