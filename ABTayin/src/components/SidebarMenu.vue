<template>
    <div class="list-group">      
      <button class="list-group-item text-start" @click="$emit('SayfaDegistir', 'UserInfo')" > Kullanıcı Bilgisi </button>
      <button class="list-group-item text-start" @click="$emit('SayfaDegistir', 'TayinTalebi')" > Tayin Talebi   </button>      
    </div>
</template>
  
  