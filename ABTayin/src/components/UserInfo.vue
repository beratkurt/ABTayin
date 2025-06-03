
 <template>
  <p class="d-none" v-if="user">Sicil: {{ user.sicil }}</p>
  <p v-else>Kullanıcı bilgisi yükleniyor...</p>
  <div>
    <h4>Personel Bilgisi</h4>
    <ul class="list-group">
      <li class="list-group-item satir">
        <div class="row">
          <div class="col-3 fw-bold">Kurum Sicili</div>
          <div class="col-1 fw-bold">:</div>
          <div class="col-4 ">{{ user.sicil }}</div>
        </div>
      </li>
      <li class="list-group-item satir">
        <div class="row">
          <div class="col-3 fw-bold">Adı</div>
          <div class="col-1 fw-bold">:</div>
          <div class="col-4">{{ user.ad }}</div>
        </div>
      </li>
      <li class="list-group-item satir">
        <div class="row">
          <div class="col-3 fw-bold">Soyadı</div>
          <div class="col-1 fw-bold">:</div>
          <div class="col-4">{{ user.soyad }}</div>
        </div>
      </li>
      <li class="list-group-item satir">
        <div class="row">
          <div class="col-3 fw-bold">Ünvanı</div>
          <div class="col-1 fw-bold">:</div>
          <div class="col-4">{{ user.unvan }}</div>
        </div>
      </li>
      <li class="list-group-item satir">
        <div class="row">
          <div class="col-3 fw-bold">Tayin Puanı</div>
          <div class="col-1 fw-bold">:</div>
          <div class="col-4">{{ user.puan }}</div>
        </div>
      </li>
      <li class="list-group-item satir">
        <div class="row">
          <div class="col-3 fw-bold">Meslek Yılı</div>
          <div class="col-1 fw-bold">:</div>
          <div class="col-4">{{ user.yil }}</div>
        </div>
      </li>
      <li class="list-group-item satir">
        <div class="row">
          <div class="col-3 fw-bold">Bulunduğu İl</div>
          <div class="col-1 fw-bold">:</div>
          <div class="col-4">{{ getIlAdi(user.il) }}</div>
        </div>
      </li>
      <li class="list-group-item satir">
        <div class="row">
          <div class="col-3 fw-bold">Bulunduğu Kurum</div>
          <div class="col-1 fw-bold">:</div>
          <div class="col-4">{{ user.kurum }}</div>
        </div>
      </li>

      <!-- Tayin Listesi başlığı -->
      <li class="list-group-item satir">
        <div class="row">
          <div class="col-12 fw-bold">Tayin Listesi</div>
        </div>
      </li>
      <li
        v-for="(tayin, index) in user.tayinIstegi || []"
        :key="tayin.id"
        class="list-group-item satir"
      >
        <div class="row">
          <div class="col-3"></div>
          <div class="col-1"></div>
          <div class="col-4">{{ index + 1 }}. {{ tayin.isim }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>


  
  <script setup>
  import iller from '/public/data/il.json';
 

  const getIlAdi = (ilId) => {
    const il = iller.find(item => Number(item.id) === Number(ilId));
    return il ? il.name : 'Bilinmiyor';
    };

  defineProps(['user']);
  </script>
<style scoped>
  .satir{
    height: 2em!important;
    max-width: 1000px;
  }  
</style>
  