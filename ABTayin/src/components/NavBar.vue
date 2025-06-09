<template>  
  <div class="container-fluid fixed-top first-area" id="navbar">
   <div class="row">
     <div class="col-2"></div>
     <div class= "col-8 " >
       <div class="container">
         <nav class="navbar">			
		      <div class="col-3" >
				    <img src="../../public/img/logo.png" alt="Logo">        
			    </div>      
			    <div class="col-4" >				
            <div class="row"><h3> Adalet Bakanlığı </h3></div>
            <div class ="row"><h3> Personel Genel Müdürlüğü </h3></div>          
          </div>
          <div class="col-3">
            <div class="row">
              <div class="col-12">
                <span 
                  v-if="user"
                  class="position-absolute" 
                  style="bottom: 10px; right: 250px; color:gray; background-color: none;">
                  {{ user.unvan }} {{ user.ad }} {{ user.soyad }}
                </span>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <!-- Anasayfa butonu -->
                <router-link 
                to="/" 
                class="position-absolute" 
                style="bottom: 40px; right: 300px; color:gray; background-color: none;"
                title="Anasayfa"><i class="fas fa-home"></i>
               </router-link>
               <div v-if="isLoggedIn">
                <!-- Admin/User butonu -->
                <router-link 
                  :to="user?.isAdmin ? '/admin' : '/user'"
                  class="position-absolute" 
                  style="bottom: 40px; right: 270px; color:gray; background-color: none; text-decoration: none;"
                  :title="user?.isAdmin ? 'Admin Paneli' : 'Kullanıcı Paneli'" >
                  <i :class="user?.isAdmin ? 'fas fa-user-shield' : 'fas fa-user'"></i>
                </router-link>
                <!-- Çıkış butonu -->                
                <button 
                  @click="logout" 
                  class="position-absolute btn" 
                  style="bottom: 33px; right: 230px; color: gray; background: none; border: none;"
                  title="Çıkış Yap" >
                <i class="fas fa-sign-out-alt"></i>
                </button>
              </div>              
              </div>          
            </div>
			    </div>	
			    <div class="col-2 text-center">			
            <img src="../../public/img/bayrak.png" style="height:100px; width:170px;" alt="Bayrak">     
			    </div>		
        </nav>
	     </div>	
     </div>	
     <div class="col-2"></div>
   </div>	   
	</div> 
</template>


<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter(); // Vue Router'ı kullanarak sayfalar arası geçiş yapıyoruz
const isLoggedIn = ref(false); // Kullanıcının giriş yapıp yapmadığını kontrol ediyoruz
const user = ref(null); // Kullanıcıların bilgilerini reaktif olarak aldık

// Çıkış yapma fonksiyonu
const logout = () => { 
  sessionStorage.clear();
  isLoggedIn.value = false;
  user.value = null;
  router.push('/giris');
  };

// Sayfa yüklendiğinde kullanıcı bilgilerini alıyoruz
onMounted(() => { 
  const userData = sessionStorage.getItem('user');
  if (userData) {
    try {
      user.value = JSON.parse(userData);
      isLoggedIn.value = true;
    } catch (error) {
      console.error('Kullanıcı verisi parse edilemedi:', error);
      logout();
    }
  }
});

</script>

