const winston = require("winston");
const path = require("path");

const logFilePath = path.join(__dirname, "app.log");

const logger = winston.createLogger({
    level: "info",  // Nível padrão de log
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} - ${level.toUpperCase()} - ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),  // Exibe logs no terminal
        new winston.transports.File({
            filename: logFilePath,
            options: { flags: 'w' }  // 🔹 Sobrescreve o arquivo a cada execução
        })
    ]
});

module.exports = logger