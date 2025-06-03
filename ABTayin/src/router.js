import { createRouter, createWebHistory } from "vue-router";

// Geçerli rotalar listesi (güvenlik için)
const validPaths = ['/', '/giris', '/user', '/admin', '/login'];

const routes = [
{
    path: "/",
    name: "anasayfa",
    component:() =>import("./views/HomePage.vue")
},
{
    path: "/giris",
    name: "giris",
    component:() =>import("./views/LoginPage.vue")
},
{
    path: "/login",
    redirect: "/giris"
},
{
    path: "/user",
    name: "user",
    meta: { requiresAuth: true }, //user aktif sayfa kontrolü
    component:() =>import("./views/UserPage.vue")
},
{
    path: "/admin",
    name: "admin",
    meta: { requiresAuth: true, requiresAdmin: true }, // Admin kontrolü
    component:() =>import("./views/AdminPage.vue")
},
{
    // Catch-all 404 
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("./components/NotFound.vue")
}
];

const router = createRouter({
    routes,
    history: createWebHistory()
});

// Oturum kontrolü için yardımcı fonksiyon
const validateSession = () => {
    const sessionStartTime = sessionStorage.getItem('sessionStartTime');
    const userData = sessionStorage.getItem('user');
    
    if (!sessionStartTime || !userData) {
        sessionStorage.clear();
        return false;
    }

    try {
        const currentTime = new Date().getTime();
        const sessionAge = currentTime - parseInt(sessionStartTime);
        
        if (sessionAge > 7200000) { // 2 saat
            sessionStorage.clear();
            return false;
        }

        const user = JSON.parse(userData);
        if (!user || !user.sicil) {
            sessionStorage.clear();
            return false;
        }

        return true;
    } catch (error) {
        console.error('Oturum doğrulama hatası:', error);
        sessionStorage.clear();
        return false;
    }
};

//user aktif sayfa kontrolü
router.beforeEach((to, from, next) => {
    const userData = sessionStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const isLoggedIn = !!user;

    // Korumalı sayfa kontrolü
    if (to.meta.requiresAuth) {
        if (!isLoggedIn) {
            next('/giris');
            return;
        }

        // Admin sayfası kontrolü
        if (to.meta.requiresAdmin && !user.isAdmin) {
            next('/user');
            return;
        }
    }

    // Giriş sayfası kontrolü
    if (to.path === '/giris' || to.path === '/login') {
        if (isLoggedIn) {
            next(user.isAdmin ? '/admin' : '/user');
            return;
        }
    }

    // URL manipülasyonu kontrolü
    const requestedPath = to.path.toLowerCase();
    if (!validPaths.includes(requestedPath) && requestedPath !== '/404') {
        next('/404');
        return;
    }

    next();
});

export default router;

