import './assets/main.css'

import {createApp} from 'vue'
import router from './router'
import 'vuetify/styles'
import type {ThemeDefinition} from 'vuetify'
import {createVuetify,} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import {figureTheme} from "@/functions/theme";
import {aliases, mdi} from 'vuetify/iconsets/mdi-svg'

/*https://coolors.co/3d5a80-98c1d9-e0fbfc-ee6c4d-293241*/
const ravenNestTheme: ThemeDefinition = {
    colors: {
        background: "#293241",
        surface: "#15202b",
        primary: "#EE6C4D",
        secondary: "#E0FBFC",
        info: "#FDFFF7",
    },
};
/*https://coolors.co/50514f-b4adea-fdfff7-59ffa0-ffed65*/
/*https://www.sessions.edu/color-calculator/*/
const darkPrisonTheme: ThemeDefinition = {
    colors: {
        background: "#50514F",
        surface: "#15202b",
        primary: "#59FFA0",
        secondary: "#ffbd59",
        info: "#FDFFF7",
    },
};
/*https://coolors.co/61988e-e1f2fe-ffc482-a5668b-49392c8*/
const ablazeCaveTheme: ThemeDefinition = {
    colors: {
        background: "#49392C",
        surface: "#15202b",
        primary: "#FFC482",
        secondary: "#E1F2FE",
        info: "#FDFFF7",
    },
};


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(router)
app.use(pinia);
const currentTheme = figureTheme()
const vuetify = createVuetify({
    display: {
        mobileBreakpoint: 'sm'
    },
    components,
    directives,
    theme: {
        defaultTheme: currentTheme,
        themes: {
            darkPrisonTheme,
            ablazeCaveTheme,
            ravenNestTheme
        },
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    }
})
app.use(vuetify).mount('#app')
