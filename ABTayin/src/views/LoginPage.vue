<template>
  <Navbar />
  <div class="container bg-light cardstart position-absolute top-50 start-50 translate-middle">
    <!-- ----------------- Card alanı -->
    <div class="card p-4 mx-auto shadow cardbody" style="max-width: 400px;">
      <h5 class="mb-3 text-center">Personel Girişi</h5>

      <!-- -------------- Kullanıcı Sicil Girişi-->
      <div class="mb-4 position-relative">
        <i class="fas fa-user position-absolute" style="left: 10px; top: 42px; color: #aaa;"></i>
          <label class="form-label">Kurum Sicil No</label>
            <input
              v-model="sicil"
              @input="validateSicil"
              type="text"
              class="form-control ps-5"
              :class="{ 'is-invalid': sicilError }"
              placeholder="ab******"
              maxlength="8"
            />
        <div v-if="sicilError" class="invalid-feedback">Sicil numarası 8 karakter olmalı ve "ab" ile başlamalıdır.</div>
      </div>

      <!-- --------------- Kullanıcı Şifre Alanı   -->
      <div class="mb-4 position-relative">
        <label class="form-label">Şifre</label>
        <i class="fas fa-lock position-absolute" style="left: 10px; top: 42px; color: #aaa;"></i>
          <input 
            v-model="sifre" 
            @input="validateSifre"
            type="password" 
            class="form-control ps-5"
            :class="{ 'is-invalid': sifreError }"
            placeholder="Şifreniz" 
          />
      <div v-if="sifreError" class="invalid-feedback">
        Şifreniz en az 8 karakter olmalı, büyük harf, küçük harf, rakam ve özel karakter içermelidir.
      </div>
    </div>

    <button @click="KurumLogin" class="btn btn-primary w-100">Giriş Yap</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '../components/NavBar.vue';

//kullanıcı bilgisi filtreleme
  const sicil = ref('');
  const sicilError = ref(null);
  function validateSicil() {
    const value = sicil.value.toLowerCase(); 
    sicilError.value = !(value.startsWith('ab') && value.length === 8);
    }

//şifreleme
  const sifre = ref('');
  const sifreError = ref(false);
  function validateSifre() {
    const value = sifre.value;  
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    sifreError.value = !regex.test(value);
    }

//kontrol ve yönlendirme
  const router = useRouter();
  const KurumLogin = async () => {
    try {
      // Validasyon kontrolleri
      if (sicilError.value || sifreError.value) {
        alert('Lütfen giriş bilgilerini doğru formatta giriniz.');
        return;
      }

      const res = await fetch('/data/user.json');
      const users = await res.json();
      
      // Kullanıcı bilgilerini kontrol et
      const user = users.find(u => u.sicil === sicil.value && u.sifre === sifre.value);

      if (user) {
        // Session'a kullanıcı bilgilerini kaydet
        const sessionUser = {
          sicil: user.sicil,
          ad: user.ad,
          soyad: user.soyad,
          unvan: user.unvan,
          puan: user.puan,
          yil: user.yil,
          il: user.il,
          kurum: user.kurum,
          isAdmin: user.isAdmin || false,
          tayinIstegi: user.tayinIstegi || [],
          tayinGecmisi: user.tayinGecmisi || []
        };

        sessionStorage.setItem('user', JSON.stringify(sessionUser));
        sessionStorage.setItem('sessionStartTime', new Date().getTime().toString());

        // Kullanıcı rolüne göre yönlendirme
        if (sessionUser.isAdmin) {
          router.push('/admin');
        } else {
          router.push('/user');
        }
      } else {
        alert('Giriş bilgileri hatalı');
      }
    } catch (error) {
      console.error('Giriş işlemi sırasında hata:', error);
      alert('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

</script>

<style scoped>
body {
  background-color: #f8f9fa;
}
.cardstart{
  height: 100%;
  width: 100%;
}
.cardbody{
  margin-top: 20em;
}
</style>    
