<template>
  <v-container>
    <v-row no-gutters>
      <v-col class="v-col-auto">
        <v-select label="Role"
                  density="compact"
                  bg-color="undefined"
                  hide-details="true"
                  base-color="background"
                  :items="['Runner', 'Carry', 'Versatile', 'Master of Fish']"
        >
          <template #selection="{ item }">
            <span class="text-h7 text-primary"> {{ item.title }}</span>
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
      <v-col class="v-col-auto">
        <v-select label="Option"
                  density="compact"
                  hide-details="true"
                  flat="true"
                  bg-color="undefined"
                  base-color="background"
                  :items="['', 'Option1', 'Option2', 'Option3']"
        >
          <template #selection="{ item }">
            <span class="text-h7 text-secondary"> {{ item.title }}</span>
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
      <v-col class="v-col-6">
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
            <span class="text-h5 text-primary"> {{ item.title }}</span>
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
      <v-col class="v-col-auto">
        <v-select label="Battlefield effect"
                  density="compact"
                  hide-details="true"
                  flat="true"
                  bg-color="undefined"
                  base-color="background"
                  :items="['','Predicament', 'Lucky', 'Discount', 'Weakness: Fire', 'Weakness: Wind', 'Weakness: Water', 'Weakness: Lightning',
                  'Confined', 'Overload', 'Mirror', 'Irritable', 'Chaos', 'Solo']"
        >
          <template #selection="{ item }">
            <span class="text-h7 text-secondary"> {{ item.title }}</span>
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
    </v-row>
    <v-row no-gutters>
      <v-col>
        <SlotRow/>
      </v-col>
    </v-row>
  </v-container>
  <!--      <select v-model="selectedCatOption" id="select-role-cat-option">-->
  <!--        <option value="none"></option>-->
  <!--        <option value="option1">Option1</option>-->
  <!--        <option value="option2">Option2</option>-->
  <!--      </select>-->
  <!--    </div>-->
  <v-container>
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
      showTooltip: null
    };
  },
  methods: {
    loadCardImages() {
      const passiveCardImages = Object.values(import.meta.glob('@/assets/cards/passive/*.{png,jpg,jpeg,PNG,JPEG}', {
        eager: true,
        as: 'url'
      }))
      const cardImages = Object.values(import.meta.glob('@/assets/cards/*.{png,jpg,jpeg,PNG,JPEG}', {
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
