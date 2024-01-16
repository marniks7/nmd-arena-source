<template>
  <v-row no-gutters flex-nowrap>
    <v-col>
      <v-select label="Role"
                v-model="slt.role"
                density="compact"
                hide-details
                bg-color="undefined"
                base-color="background"
                variant="plain"
                class="child-sm-p-1"
                :items="['Runner', 'Carry', 'Versatile', 'Master of Fish', 'Support']"
                menu-icon=""
                single-line
      >
        <template #selection="{ item }">
          <span class="child-sm-p-1 text-caption text-sm-h4 text-primary"> {{ item.title }}</span>
        </template>
        <template #item="{ item, props }">
          <v-list-item v-bind="props">
            <template #title>
              <span>{{ item.title }}</span>
            </template>
          </v-list-item>
        </template>
      </v-select>
      <v-select v-model="slt.roleOption"
                density="compact"
                hide-details="true"
                bg-color="undefined"
                base-color="background"
                variant="plain"
                class="child-sm-p-1"
                :items="['', 'Option1', 'Option2', 'Option3']"
                menu-icon=""
                single-line
      >
        <template #selection="{ item }">
          <span class="text-caption text-sm-h6 text-secondary"> {{ item.title }}</span>
        </template>
        <template #item="{ item, props }">
          <v-list-item v-bind="props">
            <template #title>
              <span>{{ item.title }}</span>
            </template>
          </v-list-item>
        </template>
      </v-select>
      <v-menu max-width="200">
        <template v-slot:activator="{ props }">
          <v-btn
              variant="plain"
              v-bind="props"
              density="compact"
              :prepend-icon="mdiDotsGrid"
          >
          </v-btn>
        </template>
        <v-list>
          <v-list-item
              :key="1"
              :value="1"
          >
            <v-list-item-title class="mr-1" @click="store.moveUp(slt.id)">Move up</v-list-item-title>
          </v-list-item>
          <v-list-item
              :key="2"
              :value="2"
          >
            <v-list-item-title class="mr-1" @click="store.moveDown(slt.id)">Move down</v-list-item-title>
          </v-list-item>
          <v-dialog width="auto">
            <template v-slot:activator="{ props }">
              <v-list-item
                  :key="3"
                  :value="3"
              >
                <v-list-item-title class="mr-1" v-bind="props">Remove row</v-list-item-title>
              </v-list-item>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card>
                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn
                      text="Confirm remove row"
                      color="primary"
                      @click="isActive.value = false; store.removeRow(slt.id);"
                  />
                  <v-btn
                      text="Cancel"
                      color="secondary"
                      @click="isActive.value = false"
                  />
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
          <v-list-item
              :key="4"
              :value="4"
          >
            <v-list-item-title class="mr-1" @click="store.showSlotsDescription(slt.id)">Show description field</v-list-item-title>
          </v-list-item>
          <v-list-item
              :key="5"
              :value="5"
          >
            <v-list-item-title class="mr-1" @click="store.hideSlotsDescription(slt.id)">Hide description field</v-list-item-title>
          </v-list-item>
        </v-list>

      </v-menu>
    </v-col>
    <v-col
        v-for="slot in slt.slots"
        :key="slot.id"
        @drop="dropCard($event, slot)"
        @dragover.prevent
        :class="{ 'empty-slot': slot.cards.length === 0, 'non-empty-slot': slot.cards.length > 0}"
    >
      <div v-if="slot.cards.length > 0">
        <div v-for="(card, index) in slot.cards" :key="index">
          <v-img :src="card.originalImage" :alt="card.title" @dragstart="startDrag(card, slot, $event)"
                 @dragend="endDrag(card, slot, $event)"
                 @click="removeCard(card, slot, $event)"
                 draggable="true">
            <template data-html2canvas-ignore #sources>
              <source data-html2canvas-ignore :srcset="card.image">
            </template>
          </v-img>
        </div>
        <div class="text-center">
          <span v-if="display.mobile"
                class="text-lg-h5 text-caption text-info truncated-text">{{ slot.labelSmall }}</span>
          <span v-else-if="!display.mobile"
                class="text-lg-h5 text-caption text-info truncated-text">{{ slot.label }}</span>
        </div>
      </div>
      <div class="text-center" v-else>

        <span class="text-lg-h5 text-subtitle-2 text-info">{{ slot.label_not_selected }}</span>
      </div>

    </v-col>
  </v-row>
  <v-row no-gutters flex-nowrap v-if="slt.isSlotsDescription">
    <v-col>
      <v-textarea rows="1"
                  v-model="slt.slotsDescription"
                  auto-grow
                  label="Slots description"
                  density="compact"
                  hide-details
                  single-line
                  variant="plain"
                  bg-color="undefined"
                  base-color="background"
                  class="pa-1 shrink text-sm-subtitle-2 text-caption text-info"></v-textarea>
    </v-col>
  </v-row>
</template>

<script setup>
import {useSlotsStore} from "@/stores/slots.ts";
import {useDisplay} from 'vuetify'
import {ref} from "vue";
import {mdiDotsGrid} from '@mdi/js'

const store = useSlotsStore()

const display = ref(useDisplay())
</script>
<script>
export default {
  props: {
    slt: {
      type: Object
    },
  },
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
    },
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

.truncated-text {
  white-space: nowrap;
  text-overflow: ellipsis;
}

@media screen and (max-width: 960px) {
  .child-sm-p-1 ::v-deep(.v-field) {
    --v-field-padding-start: 4px;
  }
}

</style>
