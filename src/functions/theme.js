import {useSlotsStore} from '@/stores/slots'


export function toggleTheme(theme) {
    theme.global.name.value = figureTheme()
}

export function figureTheme() {
    const store = useSlotsStore()
    const selectedMap = store.map
    if (selectedMap === 'Dark Prison. Hard' || selectedMap === 'Dark Prison. Dangerous') {
        return "darkPrisonTheme"
    } else if (selectedMap === 'Ablaze Cave. Hard' || selectedMap === 'Ablaze Cave. Dangerous') {
        return "ablazeCaveTheme"
    } else if (selectedMap === 'Raven Nest. Hard' || selectedMap === 'Raven Nest. Dangerous') {
        return "ravenNestTheme"
    } else {
        return 'dark'
    }
}