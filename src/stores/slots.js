import {defineStore} from 'pinia'

export const useSlotsStore = defineStore('slots', {
    state: () => ({
        role: null,
        roleOption: null,
        map: null,
        battlefieldEffect: null,
        slots: [
            {id: 1, cards: [], label_not_selected: 'Empty slot'},
            {id: 2, cards: [], label_not_selected: 'Empty slot'},
            {id: 3, cards: [], label_not_selected: '1st boss', label: '1st boss'},
            {id: 4, cards: [], label_not_selected: '2nd boss', label: '2nd boss'},
            {id: 5, cards: [], label_not_selected: 'Passive'},
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
    persist: true,
})