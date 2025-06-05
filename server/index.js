const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

// CORS ve JSON middleware
app.use(cors());
app.use(express.json());

// Kullanıcı verilerini okuma fonksiyonu
async function readUserData() {
    const filePath = path.join(__dirname, '../ABTayin/public/data/user.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
}

// Kullanıcı verilerini yazma fonksiyonu
async function writeUserData(users) {
    const filePath = path.join(__dirname, '../ABTayin/public/data/user.json');
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));
}

// Tayin taleplerini güncelleme endpoint'i
app.put('/api/tayin-talepleri', async (req, res) => {
    try {
        const { sicil, yeniTalepler } = req.body;
        
        // Kullanıcı verilerini oku
        const users = await readUserData();
        
        // İlgili kullanıcıyı bul
        const userIndex = users.findIndex(user => user.sicil === sicil);
        
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        // Tayin taleplerini güncelle
        users[userIndex].tayinIstegi = yeniTalepler;

        // Güncellenmiş verileri kaydet
        await writeUserData(users);

        res.json({ message: 'Tayin talepleri başarıyla güncellendi' });
    } catch (error) {
        console.error('Tayin talepleri güncellenirken hata:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Server'ı başlat
app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} adresinde çalışıyor`);
}); 