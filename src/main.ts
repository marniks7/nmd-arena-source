import './assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createPinia } from 'pinia'
// import eventBus from './Plugins/event-bus';
const customDarkTheme = {
    dark: true,
    colors: {
        background: "#15202b",
        surface: "#15202b",
        primary: "#3f51b5",
        secondary: "#03dac6",
        error: "#ff5722",
    },
};

const customLightTheme = {
    dark: false,
    colors: {
        background: "#eee",
        surface: "#15202b",
        primary: "#3f51b5",
        secondary: "#00ccff",
        error: "#ffcc00",
    },
};
const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'customDarkTheme',
        themes: {
            customDarkTheme,
            customLightTheme
        },
    },
})

const pinia = createPinia()
const app = createApp(App)
app.use(router)
// app.use(eventBus);
app.use(pinia);
app.use(vuetify).mount('#app')
