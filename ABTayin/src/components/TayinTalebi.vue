<template>
    <div class="container">
      <h4 class="mb-4">Tayin Talebi Formu</h4>  
      <form>
        <!-- Kullanıcı Bilgileri -->
        <div class="user-info-section mb-4">
          <div class="mb-3 row align-items-center">
            <div class="col-3"><label class="form-label fw-bold mb-0">Ad</label></div>
            <div class="col-1 text-center fw-bold">:</div>
            <div class="col-8"><input type="text" class="form-control formk" :value="user.ad" readonly /></div>
          </div>          
          <div class="mb-3 row align-items-center">
            <div class="col-3"><label class="form-label fw-bold mb-0">Soyad</label></div>
            <div class="col-1 text-center fw-bold">:</div>
            <div class="col-8"><input type="text" class="form-control formk" :value="user.soyad" readonly /></div>
          </div>          
          <div class="mb-3 row align-items-center">
            <div class="col-3"><label class="form-label fw-bold mb-0">Unvan</label></div>
            <div class="col-1 text-center fw-bold">:</div>
            <div class="col-8"><input type="text" class="form-control formk" :value="user.unvan" readonly /></div>
          </div>          
          <div class="mb-3 row align-items-center">
            <div class="col-3"><label class="form-label fw-bold mb-0">Sicil No</label></div>
            <div class="col-1 text-center fw-bold">:</div>
            <div class="col-8"><input type="text" class="form-control formk" :value="user.sicil" readonly /></div>
          </div>
        </div>
        <h4 class="mb-3">Tayin Talebi Seçimi</h4>
        <hr class="mb-4">
        
        <!-- İl Seçimi -->
        <div class="mb-3">
          <label class="form-label">İl Seçin</label>
          <select class="form-select" v-model="selectedIl" @change="onIlChange">
            <option value="" disabled selected>İl seçin</option>
            <option v-for="il in ilData" :key="il.il" :value="il.il">{{ il.il }}</option>
          </select>
        </div>
  
        <!-- İlçe Seçimi -->
        <div class="mb-3" v-if="ilceler.length">
          <label class="form-label">İlçe Seçin</label>
          <select class="form-select" v-model="selectedIlce" @change="onIlceChange">
            <option value="" disabled>İl seçin</option>
            <option v-for="ilce in ilceler" :key="ilce.ilce" :value="ilce.ilce">{{ ilce.ilce }}</option>
          </select>
        </div>
  
        <!-- Adliye Seçimi -->
        <div class="mb-3" v-if="adliyeler.length">
          <label class="form-label">Adliye Seçin (En fazla 5 tercih)</label>
          <select class="form-select" v-model="selectedAdliye" :disabled="secilenAdliyeler.length >= 5">
            <option value="" disabled selected>Adliye seçin</option>
            <option v-for="adliye in adliyeler" 
                    :key="adliye" 
                    :value="adliye"
                    :disabled="secilenAdliyeler.some(secili => secili.adliye === adliye)">
              {{ adliye }}
            </option>
          </select>
          <button class="btn btn-secondary mt-2" 
                  @click.prevent="adliyeEkle" 
                  :disabled="!selectedAdliye || secilenAdliyeler.length >= 5">
            Adliye Ekle
          </button>
        </div>

        <!-- Seçilen Adliyeler Listesi -->
        <div v-if="secilenAdliyeler.length" class="mb-3">
          <h5>Seçilen Adliyeler ({{ secilenAdliyeler.length }}/5)</h5>
          <div v-for="(secim, index) in secilenAdliyeler" :key="index" class="d-flex align-items-center mb-2">
            <span>{{ index + 1 }}. {{ secim.il }} - {{ secim.ilce }} - {{ secim.adliye }}</span>
            <button class="btn btn-danger btn-sm ms-2" @click.prevent="adliyeSil(index)">Sil</button>
          </div>
        </div>

        <button class="btn btn-primary mt-3" 
                @click.prevent="tayinTalepleriniKaydet" 
                :disabled="secilenAdliyeler.length === 0">
          Tayin Taleplerini Kaydet
        </button>
      </form>
    </div>
  </template>

<script setup>
import { ref, computed } from 'vue';
import ilData from '../assets/il-ilce-adliye.json';

const props = defineProps({
  user: Object
});

const selectedIl = ref('');
const selectedIlce = ref('');
const selectedAdliye = ref('');
const ilceler = ref([]);
const adliyeler = ref([]);
const secilenAdliyeler = ref([]);

const groupedIlData = computed(() => {
  return ilData.map(ilItem => ({
    il: ilItem.il,
    ilceler: ilItem.ilceler.map(ilceItem => ({
      ilce: ilceItem.ilce,
      adliyeler: ilceItem.adliyeler
    }))
  }));
});

function onIlChange() {
  selectedIlce.value = '';
  selectedAdliye.value = '';
  const foundIl = groupedIlData.value.find(item => item.il === selectedIl.value);
  ilceler.value = foundIl ? foundIl.ilceler : [];
  adliyeler.value = [];
  }

function onIlceChange() {
  selectedAdliye.value = '';
  const foundIlce = ilceler.value.find(item => item.ilce === selectedIlce.value);
  adliyeler.value = foundIlce ? foundIlce.adliyeler : [];
  }

function adliyeEkle() {
  if (secilenAdliyeler.value.length >= 5) {
    alert("En fazla 5 adliye seçebilirsiniz!");
    return;
    }

  if (!selectedAdliye.value) return;
  const yeniSecim = {
    il: selectedIl.value,
    ilce: selectedIlce.value,
    adliye: selectedAdliye.value
    };

  secilenAdliyeler.value.push(yeniSecim);
  selectedAdliye.value = ''; // Seçimi sıfırla
  }

function adliyeSil(index) {
  secilenAdliyeler.value.splice(index, 1);
  }

function tayinTalepleriniKaydet() {
  if (secilenAdliyeler.value.length === 0) {
    alert("Lütfen en az bir adliye seçin!");
    return;
    }

  // Seçilen adliyeleri user.json formatına dönüştür
  const formattedTalepler = secilenAdliyeler.value.map((secim, index) => ({
    id: index + 1,
    isim: `${secim.adliye}`
    }));

  // user.json güncelle
  emit('updateTayinTalepleri', formattedTalepler);
  
  alert("Tayin talepleriniz başarıyla kaydedildi!");
  // Formu sıfırla
  selectedIl.value = '';
  selectedIlce.value = '';
  selectedAdliye.value = '';
  secilenAdliyeler.value = [];
  ilceler.value = [];
  adliyeler.value = [];
  }

const emit = defineEmits(['updateTayinTalepleri']);
</script>

<style scoped>
  .formk {
    height: 38px;
    width: 100%;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    background-color: #f8f9fa;
    }
  .user-info-section {
    background-color: #ffffff;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  .form-select {
    height: 38px;
    }
  hr {
    opacity: 0.15;
    }
</style>
