<template>
  <v-container>
    <v-row>
      <v-col
          cols="2"
          v-for="slot in store.slots"
          :key="slot.id"
          @drop="dropCard($event, slot)"
          @dragover.prevent
          :class="{ 'empty-slot': slot.cards.length === 0, 'non-empty-slot': slot.cards.length > 0, 'd-lg-flex justify-center align-center': 1 === 1 }"
      >
        <div v-if="slot.cards.length > 0">
          <div v-for="(card, index) in slot.cards" :key="index">
            <v-img :src="card.image"
                   @dragstart="startDrag(card, slot, $event)"
                   @dragend="endDrag(card, slot, $event)"
                   @click="removeCard(card, slot, $event)"
                   draggable="true"/>
          </div>
          <div>
            <span>{{ slot.label }}</span>
          </div>
        </div>
        <div v-else>
          {{ slot.label_not_selected }}
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useSlotsStore } from '@/stores/slots'

// access the `store` variable anywhere in the component ✨
const store = useSlotsStore()
</script>
<script>
export default {
  methods: {
    dropCard(event, slot) {
      event.preventDefault();

      // Retrieve the card data from the drag event
      const cardData = event.dataTransfer.getData('text/plain');
      const card = JSON.parse(cardData);

      if (!slot.cards) {
        slot.cards = [];
      }

      slot.cards.push(card);
    },
    startDrag(card, slot, event) {
      // Set the currently dragged card
      event.dataTransfer.setData('text/plain', JSON.stringify(card));
      event.dataTransfer.dropEffect = "move"
    },
    endDrag(card, slot, event) {
      // Clear the currently dragged card
      slot.cards.splice(slot.cards.indexOf(card), 1);
    },
    removeCard(card, slot, event) {
      slot.cards.splice(slot.cards.indexOf(card), 1);
    }
  },
};
</script>

<style scoped>
.slot {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  cursor: pointer;
}

.empty-slot {
  border: 1px solid #ccc;
}

.non-empty-slot {
}

</style>
