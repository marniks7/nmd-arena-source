<template xmlns="http://www.w3.org/1999/html">
  <v-container id="main-working-area">
    <v-row no-gutters justify-sm="space-between">
      <v-col align-self="start" cols="auto">
        <v-select label="Map"
                  v-model="store.map"
                  density="compact"
                  hide-details="true"
                  bg-color="undefined"
                  base-color="background"
                  class="child-sm-p-1"
                  :items=maps
                  @update:modelValue="toggleThemeInternal"
        >
          <template #selection="{ item }">
            <span class="text-h6 text-sm-h3 text-primary"> {{ item.title }}</span>
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
      <v-col align-self="end" cols="2">
        <v-select label="Battlefield effect"
                  v-model="store.battlefieldEffect"
                  density="compact"
                  hide-details="true"
                  bg-color="undefined"
                  class="child-sm-p-1"
                  base-color="background"
                  :items="battlefieldEffects"
        >
          <template v-slot:selection="{ item }">
            <div class="d-flex align-center">
              <v-img class="scale mr-1" :src="item.raw.image"/>
              <span class="text-caption text-sm-h6 text-secondary">  {{ item.title }}</span>
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
    <v-row no-gutters v-for="item in store.items" :key="item.id">
      <v-col>
        <SlotRow v-bind:slt="item"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn class="mr-1" @click="store.addNewRow()">
          Add one more row
        </v-btn>
        <v-btn class="mr-1" @click="store.removeRow()">
          Remove last row
        </v-btn>
        <v-btn class="mr-1" @click="store.clearCards()">
          Clear Cards
        </v-btn>
        <v-btn class="mr-1" @click="store.clearAll()">
          Clear All
        </v-btn>
        <div v-if="loading">{{ loadingText }}</div>
        <div v-else>
          <v-btn class="mr-1" @click="takeScreenshot()">Take Screenshot</v-btn>
        </div>

      </v-col>
    </v-row>
  </v-container>
  <v-container fluid>
    <v-row no-gutters>
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
import {useSlotsStore} from '@/stores/slots'
import {useTheme} from "vuetify";
import {toggleTheme} from "@/functions/theme";

const theme = useTheme();
// access the `store` variable anywhere in the component ✨
const store = useSlotsStore()
const maps = ['Dark Prison. Hard', 'Raven Nest. Hard', 'Ablaze Cave. Hard', 'Dark Prison. Dangerous', 'Raven Nest. Dangerous', 'Ablaze Cave. Dangerous']
const toggleThemeInternal = () => {
  toggleTheme(theme)
}
</script>
<script>
import SlotRow from "@/components/SlotRow.vue";
import {toggleTheme} from "@/functions/theme";
import html2canvas from "html2canvas";

export default {
  components: {SlotRow},
  data() {
    return {
      loading: false,
      loadingText: "",
      libraryCards: [],
      showTooltip: null,
      battlefieldEffects: [],
    };
  },
  methods: {
    loadCardImages() {
      const battlefieldEffects = Object.values(import.meta.glob('@/assets/battlefieldeffects/*.{png,jpg,jpeg,JPG,PNG,JPEG}', {
        eager: true,
        as: 'url'
      }))

      this.battlefieldEffects.push({
        title: '',
      })
      battlefieldEffects.forEach((imagePath) => {
            const image = new URL(imagePath, import.meta.url).href;
            let name = imagePath.split('/').pop().replace(/\.\w+$/, '');
            const dashIndex = name.lastIndexOf('-');

            if (dashIndex !== -1) {
              name = name.substring(0, dashIndex);
            }
            this.battlefieldEffects.push({
              image,
              title: name,
            })
          }
      )

      const passiveCardImages = Object.values(import.meta.glob('@/assets/cards/passive/*.{png,jpg,jpeg,JPG,PNG,JPEG}', {
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
      const cardImages = Object.values(import.meta.glob('@/assets/cards/*.{png,jpg,jpeg,JPG,PNG,JPEG}', {
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
    }
    ,
    saveCards() {
      // Logic to save cards
    }
    ,
    startDrag(card, event) {
      // Set custom data attributes for the card being dragged
      event.dataTransfer.setData('text/plain', JSON.stringify(card));
    }
    ,
    endDrag() {
      // Logic for drag end
    }
    ,
    addCard(store, card) {
      store.addCard(card)
      this.showTooltip = card.id;

      // Simulate a delay for the tooltip to disappear (e.g., after 2 seconds).
      setTimeout(() => {
        this.showTooltip = null;
      }, 2000);
    },
    takeScreenshot() {
      this.loading = true
      this.loadingText = "Loading..."
      const elementToCapture = document.getElementById('app');
      const mainWorkingArea = document.getElementById('main-working-area');
      html2canvas(elementToCapture, {
        // without taking height of main working area it will copy entire page
        // if take screenshot of main-working-area it will be without theme
        height: mainWorkingArea.offsetHeight,
      }).then((canvas) => {
        canvas.toBlob((blob) => {
          // Check if ClipboardItem is supported
          if (navigator.clipboard && navigator.clipboard.write) {
            const item = new ClipboardItem({'image/png': blob});
            navigator.clipboard.write([item]).then(() => {
              this.loadingText = 'Done'
              setTimeout(() => {
                this.loading = false
              }, 2000);
            }).catch((err) => {

              this.loadingText = 'Failed. Try again or different browser'
              setTimeout(() => {
                this.loading = false
              }, 3000);
              console.error('Unable to copy canvas to clipboard:', err);
            });
          } else {
            // Fallback for browsers that don't support ClipboardItem
            const dataUrl = canvas.toDataURL('image/png');
            const textArea = document.createElement('textarea');
            textArea.value = dataUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.loadingText = 'Done. CTRL+V into browser\'s address bar or use Chrome for better experience'
            setTimeout(() => {
              this.loading = false
            }, 3000);
          }
        }, 'image/png');
      }).catch((error) => {
        this.loadingText = 'Failed. Try again or different browser'
        setTimeout(() => {
          this.loading = false
        }, 3000);
        console.error('Error capturing screenshot:', error);
      });

    }
  },
  created() {
    // Call the loadCardImages method when the component is created
    this.loadCardImages();
    // toggleTheme();
  },
};
</script>
<style scoped>

.scale {
  height: 2em;
  width: 2em;
}
@media screen and (max-width: 960px) {
  .child-sm-p-1 ::v-deep(.v-field) {
    --v-field-padding-start: 4px;
  }
}

</style>
