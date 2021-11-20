const unirest = require("unirest");
const bingSearchCredenciais = require("../credenciais/bing-search.json");
const imageDownloader = require("image-downloader");
const fs = require("fs")

async function robo() {
    /*console.log("Início do robô de imagens do Bing");*/
    console.log("Ainda sem API! Tente outro!");
    let imagesUrl = [];
    let totalResultados = 1000;
    const content = {
        sentencas: [{
            texto: "gato_branco",
            termoBusca: `"white cat"`,
            pasta: "solid_color",
        },]
    };
    
    await retornaLinksTodasSentencas(content);
    await baixarTodasImagens(content);
    
    async function retornaLinksTodasSentencas(content) {
        return new Promise(async (resolve) => {
            for (const sentenca of content.sentencas) {
                sentenca.imagens = await retornaTodasUrlsImagens(sentenca.termoBusca);
            }
            resolve();
        });
    }
    
    async function retornaTodasUrlsImagens(termoBusca) {
        return new Promise(async (resolve, reject) => {
            try {
                for (let i = 0; i < totalResultados; i = i + 150) {
                    await pesquisaBingERetornaLinksImagens(termoBusca, i);
                }
                console.log("imagesUrl: ", imagesUrl);
                resolve(imagesUrl);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }
    
    async function pesquisaBingERetornaLinksImagens(termoBusca, cursor) {
        return new Promise(async (resolve, reject) => {
            try {
                let req = unirest("GET", "https://api.bing.microsoft.com/v7.0/images/search");
                req.query({
                    q: termoBusca,
                    count: 150,
                    imageType: "Photo",
                    offset: cursor
                });
                req.headers({
                    "Ocp-Apim-Subscription-Key": bingSearchCredenciais.apiKey,
                });
                
                await req.end(function (res) {
                    if (res.error) throw new Error(res.error);
                    if (totalResultados > res.body.totalEstimatedMatches) {
                        totalResultados = res.body.totalEstimatedMatches;
                        console.log("Total estimado de imagens: ", totalResultados);
                    }
                    imagesUrl = imagesUrl.concat(res.body.value.map((item) => {
                        return item.contentUrl;
                    }));
                    console.log("imagesUrl: ", imagesUrl);
                    resolve(imagesUrl);
                });
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }
    
    async function baixarTodasImagens(content) {
        content.imagensBaixadas = []
        for (let sentenceIndex = 0; sentenceIndex < content.sentencas.length; sentenceIndex++) {
            const imagens = content.sentencas[sentenceIndex].imagens;
            for (let imageIndex = 0; imageIndex < imagens.length; imageIndex++) {
                const imageUrl = imagens[imageIndex];
                try {
                    if (content.imagensBaixadas.includes(imageUrl)) {
                        throw new Error("Imagem já baixada!");
                    }
                    
                    await download(imageUrl, imageIndex + "-" + content.sentencas[sentenceIndex].texto + "-bing.png", content.sentencas[sentenceIndex].pasta);
                    
                    content.imagensBaixadas.push(imageUrl);
                    console.log("[" + sentenceIndex + "] [" + imageIndex + "]> baixou imagem com sucesso: " + imageUrl);
                } catch (error) {
                    console.log("[" + sentenceIndex + "] [" + imageIndex + "]> erro ao baixar imagem: " + imageUrl, error);
                }
            }
        }
    }
    
    async function download(url, fileName, pasta) {
        const dir = "./content/" + pasta;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        return imageDownloader.image({
            url, url, dest: "./content/" + pasta + "/" + fileName,
        });
    }
}

module.exports = robo;
