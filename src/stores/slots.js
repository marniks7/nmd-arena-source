import {defineStore} from 'pinia'

export const useSlotsStore = defineStore('slots', {
    state: () => ({
        slots: [
            {id: 1, cards: [],},
            {id: 2, cards: [],},
            {id: 3, cards: [],},
            {id: 4, cards: [],},
            {id: 5, cards: [],},
        ],
    }),
    getters: {
        getSlots: (state) => state.slots,
    },
    // could also be defined as
    // state: () => ({ count: 0 })
    actions: {
        addCardToSlot(slot, card) {
            if (!slot.cards) {
                slot.cards = [];
            }
            slot.cards.push(card)
        },
        addCard(card) {
            if (card.passive) {
                let passiveSlot = this.slots[4];
                passiveSlot.cards.splice(0, passiveSlot.cards.length)
                passiveSlot.cards.push(card)
                return
            }
            let done = false
            for (const slot of this.slots) {
                if (slot.cards.length === 0) {
                    slot.cards.push(card)
                    done = true
                    break
                }
            }
            if (!done) {
                this.slots[0].cards.push(card)
                done = true
            }
        }
    },
})