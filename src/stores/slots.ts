import {defineStore} from 'pinia'
import {v4} from 'uuid';
import {BATTLEFIELD_INDEX, CARD_INDEX} from "@/stores/cards";

const initialRow = {
    id: v4(),
    role: null,
    roleOption: "",
    slots: [
        {id: 1, cards: [], label_not_selected: 'Empty slot'},
        {id: 2, cards: [], label_not_selected: 'Empty slot'},
        {id: 3, cards: [], label_not_selected: '1st boss', label: '1st boss', labelSmall: '1st boss'},
        {id: 4, cards: [], label_not_selected: '2nd boss', label: '2nd boss', labelSmall: '2nd'},
        {id: 5, cards: [], label_not_selected: 'Passive'},
    ]
};
const initialState = {
    id: v4(),
    map: null,
    battlefieldEffect: null,
    items: [JSON.parse(JSON.stringify(initialRow))],
};

export const useSlotsSaved = defineStore('slotsSaved', {
    state: () => ({
        items: []
    }),
    persist: true,
    actions: {
        update() {
            for (const item of this.$state.items) {
                let battlefieldEffect = item.battlefieldEffect;

                if (battlefieldEffect && battlefieldEffect.id) {
                    const id = battlefieldEffect.id
                    let battlefieldEffectData = BATTLEFIELD_INDEX.get(id);
                    if (battlefieldEffectData) {
                        battlefieldEffect.image = battlefieldEffectData.image
                        battlefieldEffect.originalImage = battlefieldEffectData.originalImage
                        battlefieldEffect.title = battlefieldEffectData.title
                    } else {
                        // TODO unclear what todo in that case
                        battlefieldEffect.image = null
                        battlefieldEffect.originalImage = null
                        console.error('Cannot find battlefield effect data for id:' + id)
                    }

                }
                for (const cardsItem of item.items) {
                    for (const slot of cardsItem.slots) {
                        for (const card of slot.cards) {
                            const id = card.id
                            const cardData = CARD_INDEX.get(id);
                            if (cardData) {
                                card.title = cardData.title
                                card.image = cardData.image
                                card.originalImage = cardData.originalImage
                            } else {
                                card.image = null
                                card.originalImage = null
                                // TODO unclear what todo in that case
                                console.error('Cannot find card data for id:' + id)
                            }

                        }
                    }
                }

            }
        },

    }
})

function isSame(savedElement) {
    const slotsStore = useSlotsStore();
    return (savedElement.map === slotsStore.map
            || (slotsStore.map == null && savedElement.map === null))
        && (savedElement.battlefieldEffect === slotsStore.battlefieldEffect
            || (slotsStore.battlefieldEffect === null && savedElement.battlefieldEffect === null));
}

export const useSlotsStore = defineStore('slots', {
    state: () => ({...initialState}),
    // could also be defined as
    actions: {
        addCardToSlot(slot, card: Card) {
            if (!slot.cards) {
                slot.cards = [];
            }
            slot.cards.push(card)
        },
        addNewRow() {
            let copiedObject = JSON.parse(JSON.stringify(initialRow));
            copiedObject.id = v4()
            this.items.push(copiedObject)
        },
        removeRow(itemId: string) {
            let index = -1

            this.items.some((savedElement, i) => {
                if (savedElement.id === itemId) {
                    index = i
                    return true
                }
            })
            if (index !== -1) {
                this.items.splice(index, 1)
                this.items.splice(index + 1, 0, element);
            }

        },
        moveUp(itemId: string) {
            let index = -1
            let elementToMove = undefined
            this.items.some((savedElement, i) => {
                if (savedElement.id === itemId) {
                    index = i
                    elementToMove = savedElement
                    return true
                }
            })
            if (index !== -1 && index > 0 && index < this.items.length) {
                this.items.splice(index, 1)
                this.items.splice(index - 1, 0, elementToMove);
            }
        },
        moveDown(itemId: string) {
            let index = -1
            let elementToMove = undefined
            this.items.some((savedElement, i) => {
                if (savedElement.id === itemId) {
                    index = i
                    elementToMove = savedElement
                    return true
                }
            })
            if (index !== -1 && index >= 0 && index < this.items.length - 1) {
                this.items.splice(index, 1)
                this.items.splice(index + 1, 0, elementToMove);
            }
        },
        clearCards() {
            for (const currentItem of this.items) {
                for (const slot of currentItem.slots) {
                    slot.cards = []
                }
            }
        },
        clearAll() {
            Object.assign(this, initialState);
        },
        saveCards() {
            const savedStore = useSlotsSaved()
            let isUpdate = false
            let index = -1
            savedStore.items.some((savedElement, i) => {
                if (savedElement.id === this.$state.id) {
                    isUpdate = isSame(savedElement);
                    index = i
                    return true
                }
            })

            let copiedObject = JSON.parse(JSON.stringify(this.$state));

            if (isUpdate) {
                savedStore.items.splice(index, 1, copiedObject);
            } else {
                copiedObject.id = v4()
                this.$state.id = copiedObject.id
                savedStore.items.push(copiedObject)
            }

        },
        removeSaved() {
            const savedStore = useSlotsSaved()
            savedStore.items = savedStore.items.filter(item => item.id === this.id);
        },
        loadCards() {
            const savedStore = useSlotsSaved()
            for (const savedElement of savedStore.items) {
                if (isSame(savedElement)) {
                    let copiedObject = JSON.parse(JSON.stringify(savedElement));
                    Object.assign(this, copiedObject);
                    break
                }
            }
        },
        addCard(card) {
            if (card.passive) {
                for (const currentItem of this.items) {
                    let passiveSlot = currentItem.slots[4];
                    if (passiveSlot.cards.length === 0) {
                        passiveSlot.cards.push(card)
                        return
                    }
                }
                const onlyOne = this.items.length === 1
                let firstPassiveSlot = this.items[0].slots[4];
                if (onlyOne) {
                    firstPassiveSlot.cards.splice(0, firstPassiveSlot.cards.length)
                }

                firstPassiveSlot.cards.push(card)
                return
            }
            for (const currentItem of this.items) {
                let firstBossSlot = currentItem.slots[2];
                if (firstBossSlot.cards.length === 0) {
                    firstBossSlot.cards.push(card)
                    return
                }
                let secondBossSlot = currentItem.slots[3];
                if (secondBossSlot.cards.length === 0) {
                    secondBossSlot.cards.push(card)
                    return
                }
                for (const slot of currentItem.slots) {
                    if (slot.cards.length === 0) {
                        slot.cards.push(card)
                        return
                    }
                }
            }

            this.items[0].slots[0].cards.push(card)

        }
    }
})