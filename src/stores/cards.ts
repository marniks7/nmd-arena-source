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
    title: ''
})


export const CARD_INDEX = new Map<string, Card>()
export const BATTLEFIELD_INDEX = new Map<string, BattlefieldEffect>()

function extractInfoFromFilename(filename) {
    let name = filename.split('/').pop().replace(/\.\w+$/, '');

    const dashIndex = name.indexOf('-');
    let clearName: string
    if (dashIndex !== -1) {
        clearName = name.substring(0, dashIndex);
    } else {
        clearName = name
    }

    let id = clearName.replace('-', '').replace('_', '').replace(' ', '').toLowerCase();
    const ids = [name,
        name.replace('_', ' '),
        name.replace('_', ''),
        name.replace(' ', ''),
        clearName,
        clearName.replace('_', ' '),
        clearName.replace('_', ''),
        clearName.replace(' ', ''),
        id,
    ]
    const title = clearName.replace('_', ' ')
    return {id, ids, title};
}

const battlefieldEffectImages = Object.values(import.meta.glob('@/assets/battlefieldeffects/*.{png,jpg,jpeg,webp,JPG,PNG,JPEG,WEBP}', {
    eager: true,
    query: {w: "10;20;30", as: "srcset", format: 'webp'}
}))

const battlefieldEffectImagesOriginal = Object.values(import.meta.glob('@/assets/battlefieldeffects/*.{png,jpg,jpeg,webp,JPG,PNG,JPEG,WEBP}', {
    eager: true,
}))
battlefieldEffectImages.forEach((value, index) => {
        const originalName = battlefieldEffectImagesOriginal[index].default;
        const originalImageURL = new URL(originalName, import.meta.url).href;
        const image = value.default
        let {id, ids, title} = extractInfoFromFilename(originalName);
        let bfe: BattlefieldEffect = {
            image: image,
            originalImage: originalImageURL,
            title: title,
            id: id
        };
        BATTLEFIELD_EFFECTS.push(bfe)
        for (const id of ids) {
            BATTLEFIELD_INDEX.set(id, bfe)
            BATTLEFIELD_INDEX.set(id.toLowerCase(), bfe)
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
    let {id, ids, title} = extractInfoFromFilename(originalName);
    let card: Card = {
        image: image,
        originalImage: originalImageURL,
        passive: true,
        title: title,
        id: id
    };
    CARDS_LIBRARY.push(card);
    for (const id of ids) {
        CARD_INDEX.set(id, card)
        CARD_INDEX.set(id.toLowerCase(), card)
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
    let {id, ids, title} = extractInfoFromFilename(originalName);
    let card: Card = {
        image: image,
        originalImage: originalImageURL,
        passive: false,
        title: title,
        id: id
    };
    CARDS_LIBRARY.push(card);
    for (const id of ids) {
        CARD_INDEX.set(id, card)
        CARD_INDEX.set(id.toLowerCase(), card)
    }
})