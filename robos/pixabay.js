const imageDownloader = require("image-downloader");
const pixabayApi = require("pixabay-api");
const pixabaySearchCredenciais = require("../credenciais/pixabay-search.json");
const fs = require("fs");
const { exit } = require("process");

async function robo() {
	console.log("Início do robô de imagens do Pixabay");
	let imagesUrl = [];
	let imgPagina = 200;
	let totalResultados = 500;

	const content = {
		sentencas: [
		{
			texto: "teste",
			termoBusca: `"white shoe"`,
			pasta: "teste",
		},
		],
	};


	await retornaLinksTodasSentencas(content);
	await baixarTodasImagens(content);

	async function retornaLinksTodasSentencas(content) {
		return new Promise(async (resolve) => {
			for (const sentenca of content.sentencas) {
				totalResultados = 500;
				console.log("Buscando por: ", sentenca.termoBusca);
				sentenca.imagens = await retornaTodasUrlsImagens(sentenca.termoBusca);
				console.log("Total de resultados: ", totalResultados);
			}
			resolve();
		});
	}

	async function retornaTodasUrlsImagens(termoBusca) {
		return new Promise(async (resolve, reject) => {
			try {
				for (let i = 1; i <= Math.ceil(totalResultados/imgPagina); i++) {
					await pesquisaPixabayERetornaLinksImagens(termoBusca, i);
				}
				resolve(imagesUrl);
			} catch (error) {
				console.log("Erro em retornaTodasUrlsImagens: ", error);
				reject(error);
			}
		});
	}

	async function pesquisaPixabayERetornaLinksImagens(termoBusca, pagina) {
		try {
			await pixabayApi.searchImages(pixabaySearchCredenciais.apiKey, termoBusca, {per_page: imgPagina, page:pagina}).then(
				function (response) {
					if (totalResultados > response.totalHits) { totalResultados = response.totalHits; }
					let j = imgPagina;
					if (response.hits.length < j) { j = response.hits.length; }
					for (let i = 0; i < j; i++) { imagesUrl.push(response.hits[i].largeImageURL); }
				}
			);
			return imagesUrl;
		} catch (error) {
			console.log("Erro em pesquisaPixabayERetornLinksImagens: ", error);
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
						throw new Error("Imagem já baixada");
					}
					await download (imageUrl, imageIndex + "-" + content.sentencas[sentenceIndex].texto + "pixabay.png", content.sentencas[sentenceIndex].pasta);
					content.imagensBaixadas.push(imageUrl);
					console.log("[" + sentenceIndex + "] [" + imageIndex + "] baixou imagem com sucesso: " + imageUrl);
				} catch (error) {
					console.log("[" + sentenceIndex + "] [" + imageIndex + "] erro ao baixar imagem: " + imageUrl);
				}
			}
		}
	}
	
	async function download(url, fileName, pasta) {
		const dir = "./content/" + pasta;
		if (!fs.existsSync(dir)) { fs.mkdirSync(dir); }
		return imageDownloader.image({ url, url, dest: dir + "/" + filename });
	}
}

module.exports = robo;
