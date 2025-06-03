import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const kurumSicil = ref('')
  const sifre = ref('')
  const isLoggedIn = ref(false)

  function login(sicil, password) {
    if (sicil === 'ab123456' && password === '1234') {
      kurumSicil.value = sicil
      sifre.value = password
      isLoggedIn.value = true
    } else {
      alert('Giriş bilgileri hatalı')
    }
  }

  function logout() {
    kurumSicil.value = ''
    sifre.value = ''
    isLoggedIn.value = false
  }

  return {
    kurumSicil,
    sifre,
    isLoggedIn,
    login,
    logout
  }
})
