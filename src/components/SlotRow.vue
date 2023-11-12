<template>
  <v-container fluid="true">
    <v-row no-gutters>
      <v-col>
        <v-select label="Role"
                  density="compact"
                  bg-color="undefined"
                  hide-details="true"
                  base-color="background"
                  :items="['Runner', 'Carry', 'Versatile', 'Master of Fish']"
        >
          <template #selection="{ item }">
            <span class="text-h3 text-primary"> {{ item.title }}</span>
          </template>
          <template #item="{ item, props }">
            <v-list-item v-bind="props">
              <template #title>
                <span>{{ item.title }}</span>
              </template>
            </v-list-item>
          </template>
        </v-select>
        <v-select label="Option"
                  density="compact"
                  hide-details="true"
                  bg-color="undefined"
                  base-color="background"
                  :items="['', 'Option1', 'Option2', 'Option3']"
        >
          <template #selection="{ item }">
            <span class="text-h5 text-secondary"> {{ item.title }}</span>
          </template>
          <template #item="{ item, props }">
            <v-list-item v-bind="props">
              <template #title>
                <span>{{ item.title }}</span>
              </template>
            </v-list-item>
          </template>
        </v-select>
      </v-col>
      <v-col
          cols="2"
          v-for="slot in store.slots"
          :key="slot.id"
          @drop="dropCard($event, slot)"
          @dragover.prevent
          :class="{ 'empty-slot': slot.cards.length === 0, 'non-empty-slot': slot.cards.length > 0}"
      >
        <div v-if="slot.cards.length > 0">
          <div v-for="(card, index) in slot.cards" :key="index">
            <v-img :src="card.image"
                   @dragstart="startDrag(card, slot, $event)"
                   @dragend="endDrag(card, slot, $event)"
                   @click="removeCard(card, slot, $event)"
                   draggable="true"/>
          </div>
          <div class="text-center">
            <span class="text-h5 text-info">{{ slot.label }}</span>
          </div>
        </div>
        <div class="text-center" v-else>
          <span class="text-h5 text-info">{{ slot.label_not_selected }}</span>
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
  text-align: center;
}

.non-empty-slot {
}

</style>
