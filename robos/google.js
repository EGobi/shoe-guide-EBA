const imageDownloader = require("image-downloader");
const fs = require("fs");
const google = require("googleapis").google;
const customSearch = google.customsearch("v1");
const googleSearchCredenciais = require("../credenciais/google-search.json");

async function robo() {
	console.log("Início do robô de imagens do Google");
	const content = {
        sentencas: [
            {
                texto: "gato_branco",
                termoBusca: `"white cat"`,
                pasta: "solid_color",
            },
            {
                termo: "gato_preto",
                termoBusca: `"black cat"`,
                pasta: "solid_color",
            }
        ]
    }

	await retornaTodasImagensDeTodasSentencas(content);
    await baixarTodasImagens(content);
    
    async function retornaTodasImagensDeTodasSentencas(content) {
        for (const sentenca of content.sentencas) {
            sentenca.imagens = await pesquisaGoogleERetornaLinksImagens(sentenca.termoBusca);
        }
    }
    
    async function pesquisaGoogleERetornaLinksImagens(termoBusca) {
        try {
            let imagesUrl = [];
            for (let i = 1; i < 10; i = i + 10) {
                const response = await customSearch.cse.list({
                    auth: googleSearchCredenciais.apiKey,
                    cx: googleSearchCredenciais.searchEngineId,
                    q: termoBusca,
                    searchType: "image",
                    start: i,
                });
                imagesUrl = imagesUrl.concat(response.data.items.map((item) => {
                    return item.link;
                }));
            }
            console.log(imagesUrl);
            return imagesUrl;
        } catch (error) {
            console.log(error);
        }
    }
    
    async function baixarTodasImagens(content) {
        content.imagensBaixadas = [];
        for (let sentenceIndex = 0; sentenceIndex < content.sentencas.length; sentenceIndex++) {
            const imagens = content.sentencas[sentenceIndex].imagens;
            for (let imageIndex = 0; imageIndex < imagens.length; imageIndex++) {
                const imageUrl = imagens[imageIndex];
                try {
                    if (content.imagensBaixadas.includes(imageUrl)) {
                        throw new Error("Imagem já foi baixada!");
                    }
                    await download(imageUrl, imageIndex + "-" + content.sentencas[sentenceIndex].texto + "-google.png", content.sentencas[sentenceIndex].pasta);
                    content.imagensBaixadas.push(imageUrl);
                    console.log("[" + sentenceIndex + "] [" + imageIndex + "] > baixou imagem com sucesso: " + imageUrl);
                } catch (error) {
                    console.log("[" + sentenceIndex + "] [" + imageIndex + "] > erro ao baixar imagem: " + imageUrl, error);
                }
            }
        }
    }
    
    async function download(url, fileName, pasta) {
        const dir = "./content/" + pasta;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        return imageDownloader.image({url, url, dest: "./content/" + pasta + "/" + fileName});
    }
}

module.exports = robo;
