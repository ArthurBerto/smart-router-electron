const fs = require('fs')
const path = require('path')

const caminhoTxt = path.join(__dirname, '../../tickets/utils/dados/routerLog.txt')

const escreverTxt = (mensagem) => {
    const dataHora = new Date().toLocaleString();
    const formato = `[${dataHora}] ${mensagem}`

    if (mensagem === "INÍCIO DA CONFIGURAÇÃO") {
        fs.appendFile(caminhoTxt, `${formato}\r\n`, { flag: 'w+' }, err => {})
        return
    }

    fs.appendFile(caminhoTxt, `${formato}\r\n`, { flag: 'a+' }, err => {})
}

module.exports = { escreverTxt }