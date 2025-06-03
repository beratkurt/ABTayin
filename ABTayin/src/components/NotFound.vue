<template>
  <div class="container not-found-container">
    <NavBar />
    <div class="content">
      <h1>404</h1>
      <h2>Sayfa Bulunamadı</h2>
      <p>Aradığınız sayfa mevcut değil veya erişim yetkiniz bulunmuyor.</p>
      <router-link to="/" class="home-link"><i class="fas fa-home"></i> Anasayfaya Dön </router-link>
    </div>
  </div>
</template>

<script setup>
import NavBar from './NavBar.vue';
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  }

.content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 50px); 
  padding-top: 0;
  }

h1 {
  font-size: 6rem;
  color: #dc3545;
  margin-bottom: 0;
  }

h2 {
  color: #343a40;
  margin-bottom: 1rem;
  }

p {
  color: #f80606;
  margin-bottom: 2rem;
  font-weight: bold;
  }

.home-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4a9aeb;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
  }
  
.home-link:hover {
  background-color: #0056b3;
  }

</style> 