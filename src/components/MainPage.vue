<template xmlns="http://www.w3.org/1999/html">
  <v-container fluid="true">
    <v-row no-gutters>
      <v-col>
        <v-select label="Map"
                  v-model="selectedMap"
                  density="compact"
                  hide-details="true"
                  bg-color="undefined"
                  base-color="background"
                  :items=maps
                  @update:modelValue="toggleTheme"
        >
          <template #selection="{ item }">
            <span class="text-h2 text-primary"> {{ item.title }}</span>
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
      <v-col align-self="end">
        <v-select label="Battlefield effect"
                  density="compact"
                  hide-details="true"
                  bg-color="undefined"
                  base-color="background"
                  :items="battlefieldEffects"
        >
          <template v-slot:selection="{ item }">
            <div class="d-flex align-center">
              <v-img class="scale mr-1" :src="item.raw.image"/>
              <span class="text-h4 text-secondary">  {{ item.title }}</span>
            </div>
          </template>
          <template v-slot:item=" { item, props }">
            <v-list-item v-bind="props" color="secondary" :prepend-avatar="item.image">
              <template v-slot:prepend>
                <div class="d-flex align-center">
                  <v-img class="scale mr-1" :src="item.raw.image"/>
                </div>
              </template>

            </v-list-item>
          </template>
        </v-select>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <SlotRow/>
      </v-col>
    </v-row>
  </v-container>
  <v-container fluid="true">
    <v-row>
      <v-col
          cols="2"
          v-for="card in libraryCards"
          :key="card.id"
          @click="addCard(store, card)"
          @dragstart="startDrag(card, $event)"
          draggable="true"
          class="gallery-image"
      >
        <v-img :src="card.image"/>
        <div v-if="showTooltip === card.id" class="tooltip">Added to slot</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {useTheme} from "vuetify";
import {ref} from "vue";
import {useSlotsStore} from '@/stores/slots'

// access the `store` variable anywhere in the component ✨
const store = useSlotsStore()
const theme = useTheme();
const maps = ['Dark Prison. Hard', 'Raven Nest. Hard', 'Ablaze Cave. Hard', 'Dark Prison. Dangerous', 'Raven Nest. Dangerous', 'Ablaze Cave. Dangerous']
const selectedMap = ref(null);
const toggleTheme = () => {
  if (selectedMap.value === 'Dark Prison. Hard' || selectedMap.value === 'Dark Prison. Dangerous') {
    theme.global.name.value = "darkPrisonTheme"
  } else if (selectedMap.value === 'Ablaze Cave. Hard' || selectedMap.value === 'Ablaze Cave. Dangerous') {
    theme.global.name.value = "ablazeCaveTheme"
  } else if (selectedMap.value === 'Raven Nest. Hard' || selectedMap.value === 'Raven Nest. Dangerous') {
    theme.global.name.value = "ravenNestTheme"
  } else {
    theme.global.name.value = 'customDarkTheme'
  }
};
</script>
<script>
import SlotRow from "@/components/SlotRow.vue";

export default {
  components: {SlotRow},
  data() {
    return {
      selectedRoleOption: 'runner',
      // selectedMap: null,
      selectedCatOption: null,
      libraryCards: [],
      showTooltip: null,
      battlefieldEffects: [
      ]
    };
  },
  methods: {
    loadCardImages() {
      const battlefieldEffects = Object.values(import.meta.glob('@/assets/battlefieldeffects/*.{png,jpg,jpeg,PNG,JPEG}', {
        eager: true,
        as: 'url'
      }))
      battlefieldEffects.forEach((imagePath) => {
        const image = new URL(imagePath, import.meta.url).href;
        const name = imagePath.split('/').pop().replace(/\.\w+$/, '');
        this.battlefieldEffects.push({
          image,
          title: name,
        })
      })
      const passiveCardImages = Object.values(import.meta.glob('@/assets/cards/passive/*.{png,jpg,jpeg,PNG,JPEG}', {
        eager: true,
        as: 'url'
      }))
      passiveCardImages.forEach((imagePath) => {
        const image = new URL(imagePath, import.meta.url).href;
        const cardName = imagePath.split('/').pop().replace(/\.\w+$/, ''); // Extracts the filename without extension
        this.libraryCards.push({
          image,
          passive: true,
          text: cardName,
          id: cardName
        });
      });
      const cardImages = Object.values(import.meta.glob('@/assets/cards/*.{png,jpg,jpeg,PNG,JPEG}', {
        eager: true,
        as: 'url'
      }))
      cardImages.forEach((imagePath) => {
        const image = new URL(imagePath, import.meta.url).href;
        const cardName = imagePath.split('/').pop().replace(/\.\w+$/, ''); // Extracts the filename without extension
        this.libraryCards.push({
          image,
          passive: false,
          text: cardName,
          id: cardName
        });
      });
    },

    clearCards() {
      // Logic to clear cards
    },
    saveCards() {
      // Logic to save cards
    },
    startDrag(card, event) {
      // Set custom data attributes for the card being dragged
      event.dataTransfer.setData('text/plain', JSON.stringify(card));
    },
    endDrag() {
      // Logic for drag end
    },
    addCard(store, card) {
      store.addCard(card)
      this.showTooltip = card.id;

      // Simulate a delay for the tooltip to disappear (e.g., after 2 seconds).
      setTimeout(() => {
        this.showTooltip = null;
      }, 2000);
    }
  },
  created() {
    // Call the loadCardImages method when the component is created
    this.loadCardImages();
  },
};
</script>
<style scoped>

.scale {
  height: 2em;
  width: 2em;
}
</style>
