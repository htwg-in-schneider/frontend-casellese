import './assets/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'

const pinia = createPinia()

const auth0 = createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        redirect_uri: window.location.origin + window.location.pathname
    }
})

const app = createApp(App)

// Click-Outside Direktive für Dropdowns
app.directive('click-outside', {
    mounted(el, binding) {
        el._clickOutside = (event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event);
            }
        };
        document.addEventListener('click', el._clickOutside);
    },
    unmounted(el) {
        document.removeEventListener('click', el._clickOutside);
    }
})

app.use(router)
    .use(pinia)
    .use(auth0)
    .mount('#app')

console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)
