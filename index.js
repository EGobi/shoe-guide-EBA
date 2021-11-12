const readLine = require("readline-sync");
const robos = {
	google_image: require("./robos/google.js"),
	bing_image: require("./robos/bing.js"),
	pixabay_image: require("./robos/pixabay.js"),
}

async function start() {
	const opcoes = ["google", "bing", "pixabay"];
	const opcaoSelecionada = readLine.keyInSelect(opcoes, "Escolha uma opção: ");
	switch(opcaoSelecionada) {
		case 0:
			console.log("Google selecionado");
			await robos.google_image();
			break;
		case 1:
			console.log("Bing selecionado");
			await robos.bing_image();
			break;
		case 2:
			console.log("Pixabay selecionado");
			await robos.pixabay_image();
		break;
	}
}

start();
