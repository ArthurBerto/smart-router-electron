const axios = require("axios");
const CONFIG = require("../config");

const { ipcMain } = require("electron");

async function createTicket() {
    try {
        const ticketData = {
            "subject": "A",
            "description": "Ticket aberto para configuração de contigência 4g via script",
            "email": "william.suyama@araujo.com.br",
            "priority": 1,
            "group_id": 182196,
            "status": 2,
            "source": 2,
            "type": "Service Request",
            "custom_fields": {
                "categoria": "TI"
            }
        };

        const response = await axios.post(CONFIG.API_URL, ticketData, {
            auth: { username: CONFIG.API_KEY, password: "X" },
            headers: { "Content-Type": "application/json" }
        });

        if (response.status === 201) {
            const ticket_id = response.data.ticket.id;
            ipcMain.emit("enviar-log", null, `Chamado criado no Araujo Service! ID: ${ticket_id}`);
            return ticket_id;
        } else {
            console.log(`Erro inesperado ao criar chamado: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.log(`Erro ao criar o chamado: ${error.message}`);
        return null;
    }
}

module.exports = createTicket;