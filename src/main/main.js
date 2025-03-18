import { app, BrowserWindow } from 'electron';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: join(__dirname, '../../assets/icone.png'),
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile(join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(createWindow);