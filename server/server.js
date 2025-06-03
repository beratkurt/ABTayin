const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Kullanıcı dosyasının yolu
const userJsonPath = path.join(__dirname, '..', 'ABTayin', 'public', 'data', 'user.json');

// Tayin taleplerini güncelleme endpoint'i
app.put('/api/tayin-talepleri', async (req, res) => {
  try {
    const { sicil, yeniTalepler } = req.body;
    
    // user.json dosyasını oku
    const usersData = await fs.readFile(userJsonPath, 'utf8');
    const users = JSON.parse(usersData);
    
    // Kullanıcıyı bul ve tayin taleplerini güncelle
    const userIndex = users.findIndex(u => u.sicil === sicil);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    // Tayin taleplerini güncelle
    users[userIndex].tayinIstegi = yeniTalepler;
    
    // Dosyaya geri yaz
    await fs.writeFile(userJsonPath, JSON.stringify(users, null, 2), 'utf8');
    
    res.json({ message: 'Tayin talepleri başarıyla güncellendi' });
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Kullanıcı güncelleme endpoint'i
app.put('/api/users', async (req, res) => {
  try {
    const updatedUser = req.body;
    
    // user.json dosyasını oku
    const usersData = await fs.readFile(userJsonPath, 'utf8');
    const users = JSON.parse(usersData);
    
    // Kullanıcıyı bul ve güncelle
    const userIndex = users.findIndex(u => u.sicil === updatedUser.sicil);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    // Kullanıcıyı güncelle (şifre ve admin durumunu koruyarak)
    const existingUser = users[userIndex];
    users[userIndex] = {
      ...updatedUser,
      sifre: existingUser.sifre,
      isAdmin: existingUser.isAdmin
    };
    
    // Dosyaya geri yaz
    await fs.writeFile(userJsonPath, JSON.stringify(users, null, 2), 'utf8');
    
    res.json({ message: 'Kullanıcı başarıyla güncellendi' });
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Kullanıcı silme endpoint'i
app.delete('/api/users/:sicil', async (req, res) => {
  try {
    const { sicil } = req.params;
    
    // user.json dosyasını oku
    const usersData = await fs.readFile(userJsonPath, 'utf8');
    const users = JSON.parse(usersData);
    
    // Admin kullanıcıyı silmeye çalışıyorsa engelle
    const userToDelete = users.find(u => u.sicil === sicil);
    if (userToDelete?.isAdmin) {
      return res.status(403).json({ error: 'Admin kullanıcı silinemez' });
    }
    
    // Kullanıcıyı filtrele
    const updatedUsers = users.filter(u => u.sicil !== sicil);
    
    if (updatedUsers.length === users.length) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    // Dosyaya geri yaz
    await fs.writeFile(userJsonPath, JSON.stringify(updatedUsers, null, 2), 'utf8');
    
    res.json({ message: 'Kullanıcı başarıyla silindi' });
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 