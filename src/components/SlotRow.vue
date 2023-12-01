<template>
  <!--  <v-container fluid="true">-->
  <v-row no-gutters flex-nowrap>
    <v-col>
      <select v-model="slt.role" class="child-sm-p-1 text-caption text-sm-h4 text-primary">
        <option disabled hidden class="text-caption text-sm-h4 text-primary">Choose role</option>
        <option>Runner</option>
        <option>Carry</option>
        <option>Versatile</option>
        <option>Master of Fish</option>
        <option>Support</option>
      </select>
        <select v-model="slt.roleOption" class="text-caption text-sm-h6 text-secondary" >
          <option></option>
          <option>Option1</option>
          <option>Option2</option>
          <option>Option3</option>
        </select>
      <v-menu max-width="200">
        <template v-slot:activator="{ props }">
          <v-btn
              variant="plain"
              v-bind="props"
              density="compact"
              prepend-icon="mdi-dots-grid"
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
          <v-img :src="card.image"
                 @dragstart="startDrag(card, slot, $event)"
                 @dragend="endDrag(card, slot, $event)"
                 @click="removeCard(card, slot, $event)"
                 draggable="true"/>
        </div>
        <div class="text-center">
          <span v-if="this.$vuetify.display.mobile"
                class="text-lg-h5 text-caption text-info truncated-text">{{ slot.labelSmall }}</span>
          <span v-else-if="!this.$vuetify.display.mobile"
                class="text-lg-h5 text-caption text-info truncated-text">{{ slot.label }}</span>
        </div>
      </div>
      <div class="text-center" v-else>

        <span class="text-lg-h5 text-subtitle-2 text-info">{{ slot.label_not_selected }}</span>
      </div>

    </v-col>
  </v-row>
  <!--  </v-container>-->
</template>

<script setup>
import {useSlotsStore} from "@/stores/slots";

const store = useSlotsStore()
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
