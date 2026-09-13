const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

class FileHandler {
    constructor() {
        this.baseDir = path.join(__dirname, '../../..', 'static');
    }

    async getFile(key) {
        const filePath = path.join(this.baseDir, key);
        return fs.readFile(filePath);
    }

    async deleteFile(key) {
        try {
            const filePath = path.join(this.baseDir, key);
            await fs.unlink(filePath);
        } catch (err) { console.log(err) }
    }

    async saveFile(data) {
        const key = crypto.randomUUID();
        const filePath = path.join(this.baseDir, key);
        const dir = path.dirname(filePath);

        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(filePath, data);

        return key;
    }
}

module.exports = new FileHandler();