<template xmlns="http://www.w3.org/1999/html">
  <v-container id="main-workspace">
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
                  @update:modelValue="onMapSelected"
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
  </v-container>

  <v-container>
    <v-row>
      <v-col>
        <v-btn class="mr-1" @click="store.addNewRow()">
          Add one more row
        </v-btn>
        <v-dialog width="auto">
          <template v-slot:activator="{ props }">
            <v-btn class="mr-1" v-bind="props" text="Remove last row"></v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    text="Confirm remove last row"
                    color="primary"
                    @click="isActive.value = false; store.removeRow();"
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

        <v-dialog width="auto">
          <template v-slot:activator="{ props }">
            <v-btn class="mr-1" v-bind="props" text="Clear Cards"></v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card>
              <v-card-text>
                Cards will be cleared from current workspace. Saved cards are not affected
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    text="Confirm clear cards"
                    color="primary"
                    @click="isActive.value = false; store.clearCards()"
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
        <v-dialog width="auto">
          <template v-slot:activator="{ props }">
            <v-btn class="mr-1" v-bind="props" text="Start from the scratch"></v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card>
              <v-card-text>
                Clear workspace: cards, as well as map, battlefield effect, etc. Saved options will not be affected
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    text="Confirm start from the scratch"
                    color="primary"
                    @click="isActive.value = false; store.clearAll()"
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
        <span v-if="loading">{{ loadingText }}</span>
        <v-btn v-else class="mr-1" @click="takeScreenshot()">Take Screenshot</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-dialog width="auto">
          <template v-slot:activator="{ props }">
            <v-btn class="mr-1" v-bind="props" text="Save"></v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card>
              <v-card-text>
                Save workspace in the browser cache for map:
                <p class="d-inline font-weight-bold">{{ store.map }}</p>
                <p class="d-inline" v-if="store.battlefieldEffect"> and battlefield effect:</p>
                <p class="d-inline font-weight-bold" v-if="store.battlefieldEffect">{{ store.battlefieldEffect }}</p>
                <p>
                  Next time whenever you choose map and battlefield effect - the cards and roles will be loaded.
                </p>
                <p>
                </p>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    text="Confirm save"
                    color="primary"
                    @click="isActive.value = false; store.saveCards()"
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
        <v-dialog width="auto">
          <template v-slot:activator="{ props }">
            <v-btn class="mr-1" v-bind="props" text="Remove saved"></v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card>
              <v-card-text>
                Remove saved option if exists for map:
                <p class="d-inline font-weight-bold">{{ store.map }}</p>
                <p class="d-inline" v-if="store.battlefieldEffect"> and battlefield effect:</p>
                <p class="d-inline font-weight-bold" v-if="store.battlefieldEffect">{{ store.battlefieldEffect }}</p>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    text="Confirm remove saved"
                    color="primary"
                    @click="isActive.value = false; store.removeSaved()"/>

                <v-btn
                    text="Cancel"
                    color="secondary"
                    @click="isActive.value = false"
                />
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
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

// const props = defineProps({
//   test: {}
// })
import {useSlotsStore} from '@/stores/slots'
import {useTheme} from "vuetify";
import {toggleTheme} from "@/functions/theme";

const theme = useTheme();
// access the `store` variable anywhere in the component ✨
const store = useSlotsStore()
const maps = ['Dark Prison. Hard', 'Raven Nest. Hard', 'Ablaze Cave. Hard',
  'Dark Prison. Dangerous', 'Raven Nest. Dangerous', 'Ablaze Cave. Dangerous',
  'Ablaze Cave. Nightmare', 'Samurai Castle. Nightmare', 'Sakura Valley. Nightmare',
  'Sword Tomb. Unrivaled', 'Abandoned Tunnel. Unrivaled', 'Stone Cavern. Unrivaled']
const onMapSelected = () => {
  toggleTheme(theme)
  store.loadCards()
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
      dialog: false,
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
      const mainWorkspace = document.getElementById('main-workspace');
      html2canvas(elementToCapture, {
        // Without taking height of main workspace  it will copy entire page
        // if I take screenshot of main-workspace it will be without theme
        height: mainWorkspace.offsetHeight,
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

              this.loadingText = 'Failed. If mobile browser - it is not supported. Use PC - Chrome browser provides best experience'
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
        this.loadingText = 'Failed. If mobile browser - it is not supported. Use PC - Chrome browser provides best experience'
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
