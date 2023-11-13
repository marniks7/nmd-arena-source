import {defineStore} from 'pinia'


let initialState = {
    map: null,
    battlefieldEffect: null,
    items: [{
        id: 1,
        role: null,
        roleOption: null,
        slots: [
            {id: 1, cards: [], label_not_selected: 'Empty slot'},
            {id: 2, cards: [], label_not_selected: 'Empty slot'},
            {id: 3, cards: [], label_not_selected: '1st boss', label: '1st boss'},
            {id: 4, cards: [], label_not_selected: '2nd boss', label: '2nd boss'},
            {id: 5, cards: [], label_not_selected: 'Passive'},
        ]
    }],
    count: 1
};
export const useSlotsStore = defineStore('slots', {
    state: () => ({...initialState}),
    // could also be defined as
    actions: {
        addCardToSlot(slot, card) {
            if (!slot.cards) {
                slot.cards = [];
            }
            slot.cards.push(card)
        },
        addNewRow() {
            this.count = this.count + 1
            this.items.push({
                id: this.count,
                role: null,
                roleOption: null,
                slots: [
                    {id: 1, cards: [], label_not_selected: 'Empty slot'},
                    {id: 2, cards: [], label_not_selected: 'Empty slot'},
                    {id: 3, cards: [], label_not_selected: '1st boss', label: '1st boss'},
                    {id: 4, cards: [], label_not_selected: '2nd boss', label: '2nd boss'},
                    {id: 5, cards: [], label_not_selected: 'Passive'},
                ]
            })
        },
        removeRow() {
            if (!confirm("Do you really want to remove row?")) {
                return
            }
            this.items.splice(this.items.length - 1, this.items.length)
            this.count = this.count - 1

        },
        clearCards() {
            if (!confirm("Do you really want to clear cards?")) {
                return
            }
            for (const currentItem of this.items) {
                for (const slot of currentItem.slots) {
                    slot.cards = []
                }
            }
        },
        clearAll() {
            if (!confirm("Do you really want to clear everything?")) {
                return
            }
            Object.assign(this, initialState);
        },
        addCard(card) {
            if (card.passive) {
                let changed = false
                for (const currentItem of this.items) {
                    let passiveSlot = currentItem.slots[4];
                    if (passiveSlot.cards.length === 0) {
                        passiveSlot.cards.push(card)
                        changed = true
                        break
                    }
                }
                if (!changed) {
                    const onlyOne = this.items.length === 1
                    let firstPassiveSlot = this.items[0].slots[4];
                    if (onlyOne) {
                        firstPassiveSlot.cards.splice(0, firstPassiveSlot.cards.length)
                    }

                    firstPassiveSlot.cards.push(card)
                    changed = true
                }
                return
            }
            let done = false
            for (const currentItem of this.items) {
                for (const slot of currentItem.slots) {
                    if (slot.cards.length === 0) {
                        slot.cards.push(card)
                        done = true
                        return
                    }
                }

            }

            if (!done) {
                this.items[0].slots[0].cards.push(card)
                done = true
            }

        }
    },
    persist: true,
})