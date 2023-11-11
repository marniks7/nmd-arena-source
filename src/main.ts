import './assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import type {ThemeDefinition} from 'vuetify'
import {createVuetify,} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {createPinia} from 'pinia'

const customDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        background: "#15202b",
        surface: "#15202b",
        primary: "#3f51b5",
        secondary: "#03dac6",
        error: "#ff5722",
    },
};

const customLightTheme: ThemeDefinition = {
    colors: {
        background: "#eee",
        surface: "#15202b",
        primary: "#3f51b5",
        secondary: "#00ccff",
        error: "#ffcc00",
    },
};

/*https://coolors.co/3d5a80-98c1d9-e0fbfc-ee6c4d-293241*/
const ravenNestTheme: ThemeDefinition = {
    colors: {
        background: "#3D5A80",
        surface: "#15202b",
        primary: "#EE6C4D",
        secondary: "#03dac6",
        error: "#ff5722",
    },
};
/*https://coolors.co/50514f-b4adea-fdfff7-59ffa0-ffed65*/
const darkPrisonTheme: ThemeDefinition = {
    colors: {
        background: "#50514F",
        surface: "#15202b",
        primary: "#59FFA0",
        secondary: "#03dac6",
        error: "#ff5722",
    },
};
/*https://coolors.co/30362f-625834-a59132-fffbdb-da7422*/
const ablazeCaveTheme: ThemeDefinition = {
    colors: {
        background: "#DA7422",
        surface: "#15202b",
        primary: "#30362F",
        secondary: "#03dac6",
        error: "#ff5722",
    },
};
const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
        themes: {
            darkPrisonTheme,
            ablazeCaveTheme,
            ravenNestTheme
        },
    },
})


const pinia = createPinia()
const app = createApp(App)
app.use(router)
// app.use(eventBus);
app.use(pinia);
app.use(vuetify).mount('#app')
