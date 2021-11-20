const fs              = require("fs");
const imageDownloader = require("./image-downloader.js");

module.exports = function() {
    
    this.download = function(url, file, dir) {
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            console.log("[FS] Criado diretório inexistente \"" + dir + "\"");
        }
        
        const request = url.trim().startsWith("https") ? require("https") : require("http")
        
        /*request.get(url, options, (res) => {
            res.pipe(fs.createWriteStream(dir + "/" + file)).once("close", () => resolve());
        });*/
        
        return imageDownloader({
            url, dest: dir + "/" + file
        });
    }
}

