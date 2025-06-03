<template>
  <NavBar /><br><br>
  <div class="container">
    <div class="row" style="margin-top: 8em;">
      <div class="col-12">
        <h2>Admin Paneli</h2>
        
        <!-- Kullanıcı Listesi -->
        <div class="card mt-4">
          <div class="card-header">
            <h4>Kullanıcı Listesi</h4>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Sicil No</th>
                    <th>Ad Soyad</th>
                    <th>Unvan</th>
                    <th>Kurum</th>
                    <th>Tayin Puanı</th>
                    <th>Tayin Talepleri</th>
                    <th>Tayin Geçmişi</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.sicil">
                    <td>{{ user.sicil }}</td>
                    <td>{{ user.ad }} {{ user.soyad }}</td>
                    <td>{{ user.unvan }}</td>
                    <td>{{ user.kurum }}</td>
                    <td>{{ user.puan }}</td>
                    <td>
                      <button 
                        class="btn btn-info btn-sm" 
                        @click="showTayinTalepleri(user)"
                        v-if="user.tayinIstegi?.length"
                      >
                        Talepleri Gör ({{ user.tayinIstegi?.length || 0 }})
                      </button>
                      <span v-else class="text-muted">Talep yok</span>
                    </td>
                    <td>
                      <button 
                        class="btn btn-secondary btn-sm" 
                        @click="showTayinGecmisi(user)"
                        v-if="user.tayinGecmisi?.length"
                      >
                        Geçmişi Gör ({{ user.tayinGecmisi?.length || 0 }})
                      </button>
                      <span v-else class="text-muted">Geçmiş yok</span>
                    </td>
                    <td>
                      <button 
                        class="btn btn-primary btn-sm me-2"
                        @click="editUser(user)"
                      >
                        Düzenle
                      </button>
                      <button 
                        class="btn btn-danger btn-sm"
                        @click="deleteUser(user)"
                        v-if="!user.isAdmin"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Tayin Talepleri Modal -->
        <div class="modal fade" id="tayinTalepleriModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  {{ selectedUser?.ad }} {{ selectedUser?.soyad }} - Tayin Talepleri
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <ol class="list-group list-group-numbered">
                  <li 
                    v-for="talep in selectedUser?.tayinIstegi" 
                    :key="talep.id"
                    class="list-group-item"
                  >
                    {{ talep.isim }}
                  </li>
                </ol>
                <div v-if="!selectedUser?.tayinIstegi?.length" class="text-center py-3">
                  Henüz tayin talebi bulunmuyor.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tayin Geçmişi Modal -->
        <div class="modal fade" id="tayinGecmisiModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  {{ selectedUser?.ad }} {{ selectedUser?.soyad }} - Tayin Geçmişi
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <div class="list-group">
                  <div 
                    v-for="(gecmis, index) in selectedUser?.tayinGecmisi" 
                    :key="index"
                    class="list-group-item"
                  >
                    <div class="d-flex justify-content-between align-items-center">
                      <h6 class="mb-1">{{ formatDate(gecmis.tarih) }}</h6>
                      <span class="badge bg-secondary">{{ gecmis.aciklama }}</span>
                    </div>
                    <p class="mb-1">
                      {{ gecmis.eskiKurum }} → {{ gecmis.yeniKurum }}
                    </p>
                  </div>
                </div>
                <div v-if="!selectedUser?.tayinGecmisi?.length" class="text-center py-3">
                  Tayin geçmişi bulunmuyor.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Kullanıcı Düzenleme Modal -->
        <div class="modal fade" id="editUserModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Kullanıcı Düzenle</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="updateUser">
                  <div class="mb-3">
                    <label class="form-label">Ad</label>
                    <input type="text" class="form-control" v-model="editingUser.ad">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Soyad</label>
                    <input type="text" class="form-control" v-model="editingUser.soyad">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Unvan</label>
                    <input type="text" class="form-control" v-model="editingUser.unvan">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Kurum</label>
                    <input type="text" class="form-control" v-model="editingUser.kurum">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Tayin Puanı</label>
                    <input type="number" class="form-control" v-model="editingUser.puan">
                  </div>
                  <button type="submit" class="btn btn-primary">Kaydet</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import NavBar from '../components/NavBar.vue';
import { Modal } from 'bootstrap';

const users = ref([]);
const selectedUser = ref(null);
const editingUser = ref({});
let tayinTalepleriModal = null;
let tayinGecmisiModal = null;
let editUserModal = null;

onMounted(async () => {
  // Bootstrap modallarını başlat
  tayinTalepleriModal = new Modal(document.getElementById('tayinTalepleriModal'));
  tayinGecmisiModal = new Modal(document.getElementById('tayinGecmisiModal'));
  editUserModal = new Modal(document.getElementById('editUserModal'));
  
  // Kullanıcıları yükle
  await loadUsers();
});

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

async function loadUsers() {
  try {
    const response = await fetch('/data/user.json');
    users.value = await response.json();
  } catch (error) {
    console.error('Kullanıcılar yüklenirken hata:', error);
    alert('Kullanıcılar yüklenirken bir hata oluştu');
  }
}

function showTayinTalepleri(user) {
  selectedUser.value = user;
  tayinTalepleriModal.show();
}

function showTayinGecmisi(user) {
  selectedUser.value = user;
  tayinGecmisiModal.show();
}

function editUser(user) {
  editingUser.value = { ...user };
  editUserModal.show();
}

async function updateUser() {
  try {
    const response = await fetch('http://localhost:3001/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editingUser.value)
    });

    if (!response.ok) {
      throw new Error('Kullanıcı güncellenirken bir hata oluştu');
    }

    // Kullanıcı listesini yenile
    await loadUsers();
    editUserModal.hide();
    alert('Kullanıcı başarıyla güncellendi');
  } catch (error) {
    console.error('Kullanıcı güncellenirken hata:', error);
    alert('Kullanıcı güncellenirken bir hata oluştu');
  }
}

async function deleteUser(user) {
  if (!confirm(`${user.ad} ${user.soyad} kullanıcısını silmek istediğinize emin misiniz?`)) {
    return;
  }

  try {
    const response = await fetch(`http://localhost:3001/api/users/${user.sicil}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Kullanıcı silinirken bir hata oluştu');
    }

    // Kullanıcı listesini yenile
    await loadUsers();
    alert('Kullanıcı başarıyla silindi');
  } catch (error) {
    console.error('Kullanıcı silinirken hata:', error);
    alert('Kullanıcı silinirken bir hata oluştu');
  }
}
</script>

<style scoped>
.table th, .table td {
  vertical-align: middle;
}

.badge {
  font-size: 0.8em;
}
</style> 