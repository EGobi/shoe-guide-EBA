const fs = require('fs');

module.exports = ({ url, dest, ...options }) => new Promise((resolve) => {
  const request = url.trim().startsWith("https") ? require("https") : require("http");

  request.get(url, options, (res) => {
    res.pipe(fs.createWriteStream(dest)).once("close", () => resolve());
    })
});
