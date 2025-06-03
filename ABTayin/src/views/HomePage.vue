<template>
    <NavBar />
    <div class="container bg-light">
	<div class="row">
	<div class="d-flex justify-content-center align-items-center vh-90" style="margin-top: 400px;">
		<div class="card p-5 shadow" style="min-width:500px; min-height:400px;">
             <h5>AYEP Yetenek Gelişim Programı Projesi</h5>	
			<div class="bakanlik text-center">
			<img src="../../public/img/bakanlik-bina.jpg" alt="Bakanlik" >
			</div>
            <div class="mt-3 text-center">
                <router-link class="routlink" to="giris">Personel Tayin İşlemleri</router-link>
            </div>
			
		</div>	
	   </div>
	  </div>
  </div>  

   
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
</script>
<style scoped>
.homepage{
    margin-top: 100px;
}
.bakanlik img{
    max-width: 500px;
    max-height: 500px;
}
.routlink {   
  color: rgb(116, 116, 117);
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
}
.routlink:hover{
   color: rgb(8, 141, 230);
   text-shadow: yellowgreen 1px 1px 1px;
}

</style>