<template>
  <!--  <div class="actions-container">-->
  <!--    <button @click="clearCards">Clear</button>-->
  <!--    <button @click="saveCards">Save</button>-->
  <!--  </div>-->
  <v-container class="bg-surface-variant">
    <v-row no-gutters>
      <v-col>
        <v-select
            label="Role"
            density="compact"
            :items="['Runner', 'Carry', 'Versatile', 'Master of Fish']"
        ></v-select>
      </v-col>
      <v-col>
        <v-select
            label="Map"
            v-model="selectedMap"
            density="compact"
            :items=maps
            @update:modelValue="toggleTheme"
        ></v-select>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <SlotRow/>
      </v-col>
    </v-row>
  </v-container>
<!--  <div class="slot-container">-->

    <!--    <div class="input-container">-->

    <!--&lt;!&ndash;      <select v-model="selectedRoleOption" id="select-role-option">&ndash;&gt;-->
    <!--&lt;!&ndash;        <option value="runner">Runner</option>&ndash;&gt;-->
    <!--&lt;!&ndash;        <option value="carry">Carry</option>&ndash;&gt;-->
    <!--&lt;!&ndash;        <option value="versatile">Versatile</option>&ndash;&gt;-->
    <!--&lt;!&ndash;        <option value="master-of-fish">Master of Fish</option>&ndash;&gt;-->
    <!--&lt;!&ndash;      </select>&ndash;&gt;-->
    <!--      <select v-model="selectedCatOption" id="select-role-cat-option">-->
    <!--        <option value="none"></option>-->
    <!--        <option value="option1">Option1</option>-->
    <!--        <option value="option2">Option2</option>-->
    <!--      </select>-->
    <!--      <select v-model="selectedMapOption" id="select-map-option">-->
    <!--        <option value="dark-prison-hard">Dark Prison. Hard</option>-->
    <!--        <option value="raven-nest-hard">Raven Nest. Hard</option>-->
    <!--        <option value="ablaze-cave-hard">Ablaze Cave. Hard</option>-->
    <!--        <option value="dark-prison-dangerous">Dark Prison. Dangerous</option>-->
    <!--        <option value="raven-nest-dangerous">Raven Nest. Dangerous</option>-->
    <!--        <option value="ablaze-cave-dangerous">Ablaze Cave. Dangerous</option>-->
    <!--      </select>-->
    <!--      <select v-model="selectedMapBattlefieldEffectOption" id="select-battlefield-effect-option">-->
    <!--        <option value="predicament">Predicament</option>-->
    <!--        <option value="lucky">Lucky</option>-->
    <!--        <option value="discount">Discount</option>-->
    <!--        <option value="fire">Weakness: Fire</option>-->
    <!--        <option value="wind">Weakness: Wind</option>-->
    <!--        <option value="water">Weakness: Water</option>-->
    <!--        <option value="lightning">Weakness: Lightning</option>-->
    <!--        <option value="confined">Confined</option>-->
    <!--        <option value="overload">Overload</option>-->
    <!--        <option value="mirror">Mirror</option>-->
    <!--        <option value="irritable">Irritable</option>-->
    <!--        <option value="chaos">Chaos</option>-->
    <!--        <option value="solo">Solo</option>-->
    <!--      </select>-->
    <!--    </div>-->

<!--    <div class="top-grid">-->

<!--    </div>-->
<!--  </div>-->


  <div class="bottom-grid" id="library">
    <!-- Library cards will be added via Vue data -->
    <!--      <div-->
    <!--          class="card"-->
    <!--          v-for="card in libraryCards"-->
    <!--          :key="card.id"-->
    <!--          draggable="true"-->
    <!--          @dragstart="startDrag(card)"-->
    <!--          @dragend="endDrag"-->
    <!--      >-->
    <!--        <img :src="card.image" :alt="card.text" />-->
    <!--&lt;!&ndash;        {{ card.text }}&ndash;&gt;-->
    <!--      </div>-->
    <v-container>
      <v-row>
        <v-col
            cols="2"
            v-for="card in libraryCards"
            :key="card.id"
            @dragstart="startDrag(card, $event)"
            draggable="true"
            class="gallery-image"
        >
          <v-img :src="card.image"/>
        </v-col>
      </v-row>
    </v-container>

  </div>
</template>

<script setup>
import { useTheme } from "vuetify";
import {ref} from "vue";

const theme = useTheme();
const maps=['Dark Prison. Hard', 'Raven Nest. Hard', 'Ablaze Cave. Hard', 'Dark Prison. Dangerous', 'Raven Nest. Dangerous', 'Ablaze Cave. Dangerous']
const selectedMap = ref(maps[0]);
const toggleTheme = () => {
  if (selectedMap.value === 'Dark Prison. Hard') {
    theme.global.name.value = "customDarkTheme"
  } else {
    theme.global.name.value = "customLightTheme"
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
    };
  },
  methods: {
    loadCardImages() {
      const cardImages = Object.values(import.meta.glob('@/assets/cards/*.{png,jpg,jpeg,PNG,JPEG}', {
        eager: true,
        as: 'url'
      }))
      // const cardImages = require.context('@/assets/cards', false, /\.(jpg|jpeg|png|gif)$/);
      cardImages.forEach((imagePath) => {
        const image = new URL(imagePath, import.meta.url).href;
        //const image = cardImages(imagePath);
        // Extract the card name from the image file name (filename without extension)
        const cardName = imagePath.split('/').pop().replace(/\.\w+$/, ''); // Extracts the filename without extension
        this.libraryCards.push({
          image,
          text: cardName,
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
  },
  created() {
    // Call the loadCardImages method when the component is created
    this.loadCardImages();
  },
};
</script>
