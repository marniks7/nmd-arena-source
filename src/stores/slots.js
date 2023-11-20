import {defineStore} from 'pinia'
import {v4} from 'uuid';

let initialState = {
    id: v4(),
    map: null,
    battlefieldEffect: null,
    items: [{
        id: 1,
        role: null,
        roleOption: "",
        slots: [
            {id: 1, cards: [], label_not_selected: 'Empty slot'},
            {id: 2, cards: [], label_not_selected: 'Empty slot'},
            {id: 3, cards: [], label_not_selected: '1st boss', label: '1st boss', labelSmall: '1st boss'},
            {id: 4, cards: [], label_not_selected: '2nd boss', label: '2nd boss', labelSmall: '2nd'},
            {id: 5, cards: [], label_not_selected: 'Passive'},
        ]
    }],
    count: 1,
};

export const useSlotsSaved = defineStore('slotsSaved', {
    state: () => ({
        items: []
    }),
    persist: true,
})

function isSame(savedElement) {
    const slotsStore = useSlotsStore();
    console.log("saved-" + savedElement.map + "vs" + slotsStore.map + "-saved-" + savedElement.battlefieldEffect + "vs" + slotsStore.battlefieldEffect)
    return (savedElement.map === slotsStore.map
            || (slotsStore.map == null && savedElement.map === null))
        && (savedElement.battlefieldEffect === slotsStore.battlefieldEffect
            || (slotsStore.battlefieldEffect === null && savedElement.battlefieldEffect === null));
}

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
                roleOption: "",
                slots: [
                    {id: 1, cards: [], label_not_selected: 'Empty slot'},
                    {id: 2, cards: [], label_not_selected: 'Empty slot'},
                    {id: 3, cards: [], label_not_selected: '1st boss', label: '1st boss', labelSmall: '1st boss'},
                    {id: 4, cards: [], label_not_selected: '2nd boss', label: '2nd boss', labelSmall: '2nd'},
                    {id: 5, cards: [], label_not_selected: 'Passive'},
                ]
            })
        },
        removeRow() {
            this.items.splice(this.items.length - 1, this.items.length)
            this.count = this.count - 1

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