<template>
    <NavBar /><br><br>
  <div class="container">  
    <div class="row" style="margin-top: 8em;">
      <div class="col-3">
        <!-- Sidebar emit alıp işledik -->
        <SidebarMenu @SayfaDegistir="changeComponent" />
      </div>
      <div class="col-9">
        <!-- Dinamik değişen bileşen -->
        <component 
          v-if="user" 
          :is="currentView" 
          :user="user" 
          @updateTayinTalepleri="updateUserTayinTalepleri"
        />
        <p v-else>Kullanıcı yükleniyor...</p>
      </div>
    </div>
  </div> 
</template>

<script setup>
import { ref, onMounted, markRaw, shallowRef } from 'vue';
import NavBar from '../components/NavBar.vue';
import SidebarMenu from '../components/SidebarMenu.vue';
import UserInfo from '../components/UserInfo.vue';
import TayinTalebi from '../components/TayinTalebi.vue';
import { useRouter } from 'vue-router';

const currentView = shallowRef(markRaw(UserInfo));
const user = shallowRef(null);
const router = useRouter();

// Sidebar'dan gelen bileşen adını işliyoruz
function changeComponent(viewName) {
  const componentsMap = {
    UserInfo,
    TayinTalebi
  };
  currentView.value = componentsMap[viewName];
}

async function updateUserTayinTalepleri(yeniTalepler) {
  try {
    // Backend API'ye tayin taleplerini gönder
    const response = await fetch('http://localhost:3001/api/tayin-talepleri', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sicil: user.value.sicil,
        yeniTalepler
      })
    });

    if (!response.ok) {
      throw new Error('API yanıt vermedi');
    }

    // Kullanıcı verilerini güncelle
    user.value = {
      ...user.value,
      tayinIstegi: yeniTalepler
    };

    // Session storage'ı güncelle
    sessionStorage.setItem('user', JSON.stringify(user.value));

    alert('Tayin talepleriniz başarıyla kaydedildi!');
  } catch (error) {
    console.error('Tayin talepleri güncellenirken bir hata oluştu:', error);
    alert('Tayin talepleri güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
  }
}

// Sayfa yüklendiğinde localStorage'dan sicil al, JSON'dan eşleştir
onMounted(async () => {
  const sessionData = sessionStorage.getItem('user');
  if (sessionData) {
    try {
      const sessionUser = JSON.parse(sessionData);
      
      // Admin kontrolü
      if (sessionUser.isAdmin) {
        router.push('/admin');
        return;
      }

      // Kullanıcı verilerini güncelle
      const res = await fetch('/data/user.json');
      const users = await res.json();
      const currentUser = users.find(u => u.sicil === sessionUser.sicil);

      if (currentUser) {
        user.value = {
          ad: currentUser.ad,
          soyad: currentUser.soyad,
          unvan: currentUser.unvan,
          sicil: currentUser.sicil,
          puan: currentUser.puan,
          yil: currentUser.yil,
          il: currentUser.il,
          kurum: currentUser.kurum,
          isAdmin: currentUser.isAdmin || false,
          tayinIstegi: currentUser.tayinIstegi || []
        };

        // Session'daki kullanıcı bilgilerini güncelle
        sessionStorage.setItem('user', JSON.stringify(user.value));
      } else {
        alert('Kullanıcı bilgileri bulunamadı!');
        router.push('/giris');
      }
    } catch (error) {
      console.error('Kullanıcı verisi yüklenirken hata:', error);
      router.push('/giris');
    }
  } else {
    alert('Giriş yapılmamış!');
    router.push('/giris');
  }
});
</script>
