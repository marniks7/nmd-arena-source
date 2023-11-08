<template>
<!--  <div class="actions-container">-->
<!--    <button @click="clearCards">Clear</button>-->
<!--    <button @click="saveCards">Save</button>-->
<!--  </div>-->

  <div class="slot-container">
    <div class="input-container">
      <select v-model="selectedRoleOption" id="select-role-option">
        <option value="option1">Runner</option>
        <option value="option2">Carry</option>
        <option value="option3">Versatile</option>
        <option value="option5">Master of Fish</option>
      </select>
      <select v-model="selectedOptionCat" id="select-role-cat-option">
        <option value="option1">Option1</option>
        <option value="option2">Option2</option>
      </select>
      <select v-model="selectedMapOption" id="select-map-option">
        <option value="dark-prison">Dark Prison</option>
        <option value="raven-nest">Raven Nest</option>
        <option value="ablaze-cave">Ablaze Cave</option>
      </select>
    </div>

    <div class="top-grid">
      <div
          class="card-slot"
          v-for="slot in topGridSlots"
          :key="slot.id"
          @dragstart="startDrag(slot)"
          @dragend="endDrag"
          draggable="true"
      >
        <div class="static-text">{{ slot.text }}</div>
      </div>
    </div>
  </div>
  <SlotRow :library="libraryCards" />

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

<script>
import SlotRow from "@/components/SlotRow.vue";

export default {
  components: {SlotRow},
  data() {
    return {
      selectedRoleOption: 'option1',
      selectedMapOption: 'dark-prison',
      topGridSlots: [
        {id: 1, text: ''},
        {id: 2, text: ''},
        {id: 3, text: '1st boss'},
        {id: 4, text: '2nd boss'},
        {id: 5, text: ''},
      ],
      libraryCards: [/* Add your library card objects here */],
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
