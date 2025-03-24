const createTicket = require("./utils/createTicket");
const updateTicket = require("./utils/updateTicket");
const addNoteToTicket = require("./utils/addNote");
const convertTxtToJson = require("./utils/readTxtToJson");

const { ipcMain } = require("electron");

const operacaoTicket = async (modelo, loja) => {
    try {
        // Criar chamado
        const ticket_id = await createTicket();
        
        if (ticket_id) {

            ipcMain.emit("enviar-log", null, `Aguardando 70 segundos antes da atualização do chamado #SR-${ticket_id}`);
            setTimeout(async () => {

                // **Converter TXT para JSON antes de adicionar a nota**
                convertTxtToJson();

                // **Adicionar a nota do JSON ao chamado**
                await addNoteToTicket(ticket_id);

                // Atualizar chamado (se necessário)
                await updateTicket(ticket_id, modelo, loja);

            }, 70000); // Aguarda 65 segundos antes de rodar as atualizações
        }

        return true;

    } catch (error) {
        ipcMain.emit("enviar-log", null, `Erro no fluxo principal: ${error.message}`);
    }
};

module.exports = { operacaoTicket }