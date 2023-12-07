const battlefieldEffectImages = Object.values(import.meta.glob('@/assets/battlefieldeffects/*.{png,jpg,jpeg,webp,JPG,PNG,JPEG,WEBP}', {
    eager: true,
    query: {w: "10;20;30", as: "srcset", format: 'webp'}
}))

const battlefieldEffectImagesOriginal = Object.values(import.meta.glob('@/assets/battlefieldeffects/*.{png,jpg,jpeg,webp,JPG,PNG,JPEG,WEBP}', {
    eager: true,
}))

export interface BattlefieldEffect {
    id: string;
    title?: string;
    image?: string;
    originalImage?: string;
}
export interface Card {
    id: string;
    title?: string;
    image?: string;
    originalImage?: string;
    passive?: boolean
}
export const BATTLEFIELD_EFFECTS = []
export const CARDS_LIBRARY: Card[] = []

BATTLEFIELD_EFFECTS.push({
    id: '',
    title: ''
})


export const CARD_INDEX = new Map<string, Card>()
export const BATTLEFIELD_INDEX = new Map<string, BattlefieldEffect>()

battlefieldEffectImages.forEach((value, index) => {
        const originalName = battlefieldEffectImagesOriginal[index].default;
        const originalImageURL = new URL(originalName, import.meta.url).href;
        const image = value.default
        let name = originalName.split('/').pop().replace(/\.\w+$/, '');
        const dashIndex = name.lastIndexOf('-');

        if (dashIndex !== -1) {
            name = name.substring(0, dashIndex);
        }
        const title = name.replace('_', ' ')
        const names = [name,
            name.replace('_', ' '),
            name.replace('_', ''),
            name.replace(' ', ''),
        ]
        let bfe: BattlefieldEffect = {
            image: image,
            originalImage: originalImageURL,
            title: title,
            id: name.toLowerCase()
        };
        BATTLEFIELD_EFFECTS.push(bfe)
        for (const name of names) {
            BATTLEFIELD_INDEX.set(name, bfe)
            BATTLEFIELD_INDEX.set(name.toLowerCase(), bfe)
        }
    }
)

const passiveCardImages = Object.values(import.meta.glob('@/assets/cards/passive/*.{png,jpg,jpeg,webp,JPG,PNG,JPEG,WEBP}', {
    eager: true,
    query: {w: "100;200;300;400", as: "srcset", format: 'webp'}
}))

const passiveCardImagesOriginal = Object.values(import.meta.glob('@/assets/cards/passive/*.{png,jpg,jpeg,webp,JPG,PNG,JPEG,WEBP}', {
    eager: true,
}))


passiveCardImages.forEach((value, index) => {
    const originalName = passiveCardImagesOriginal[index].default
    const originalImageURL = new URL(originalName, import.meta.url).href;
    const image = value.default;
    const cardName = originalName.split('/').pop().replace(/\.\w+$/, ''); // Extracts the filename without extension
    const title = cardName.replace('_', ' ')
    const names = [cardName,
        cardName.replace('_', ' '),
        cardName.replace('_', ''),
        cardName.replace(' ', ''),
    ]
    let card: Card = {
        image: image,
        originalImage: originalImageURL,
        passive: true,
        title: title,
        id: cardName.toLowerCase()
    };
    CARDS_LIBRARY.push(card);
    for (const name of names) {
        CARD_INDEX.set(name, card)
        CARD_INDEX.set(name.toLowerCase(), card)
    }
});
const cardImages = Object.values(import.meta.glob('@/assets/cards/*.{png,jpg,jpeg,webp,JPG,PNG,JPEG,WEBP}', {
    eager: true,
    query: {w: "100;200;300;400", as: "srcset", format: 'webp'}
}))

const cardImagesOriginal = Object.values(import.meta.glob('@/assets/cards/*.{png,jpg,jpeg,webp,JPG,PNG,JPEG,WEBP}', {
    eager: true,
}))

cardImages.forEach((value, index) => {
    const originalName = cardImagesOriginal[index].default
    const originalImageURL = new URL(originalName, import.meta.url).href;
    const image = value.default;
    const cardName = originalName.split('/').pop().replace(/\.\w+$/, ''); // Extracts the filename without extension
    const title = cardName.replace('_', ' ')
    const names = [cardName,
        cardName.replace('_', ' '),
        cardName.replace('_', ''),
        cardName.replace(' ', ''),
    ]
    let card: Card = {
        image: image,
        originalImage: originalImageURL,
        passive: false,
        title: title,
        id: cardName.toLowerCase()
    };
    CARDS_LIBRARY.push(card);
    for (const name of names) {
        CARD_INDEX.set(name, card)
        CARD_INDEX.set(name.toLowerCase(), card)
    }
})