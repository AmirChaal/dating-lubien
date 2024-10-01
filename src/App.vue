<script lang="ts">
import osuStory from './assets/json/osu.json'
import histoire from './assets/json/histoire.json'
import { Condition, Consequence, Option, Step, Story } from './types/Step';
import { getStepById } from './functions/getStepById'
import Button from 'primevue/button'
import TextButton from './components/TextButton.vue'
import DebugMenu from './components/DebugMenu.vue'

export default {
   name: 'App',

   components: {
      Button,
      TextButton,
      DebugMenu
   },

   data() {
      return {
         // story: histoire as Story,
         // entryStepId: '0_0_0_0',
         story: null as Story | null,
         entryStepId: '',
         stepHistory: [] as Step[],
         storyVariablesHistory: [] as Record<string, boolean>[],
         currentCharacterImage: '',
         currentBackgroundImage: ''
      }
   },

   computed: {
      previousStep(): Step | null {
         return this.stepHistory[this.stepHistory.length - 2] ?? null
      },
      currentStep(): Step | null {
         return this.stepHistory[this.stepHistory.length - 1] ?? null
      },
      currentStoryVariables(): Record<string, boolean> {
         return this.storyVariablesHistory[this.storyVariablesHistory.length - 1] ?? {}
      }
   },

   methods: {
      getStepById(id: string) {
         return getStepById(id, this.story)
      },
      addStepToHistoryWithId(id: string) {
         const step = getStepById(id, this.story)
         if (step == null) return
         else this.stepHistory.push(step)
      },
      returnToPreviousStep() {
         this.stepHistory.pop()
         this.storyVariablesHistory.pop()
      },
      async takeOption(opt: Option) {
         this.addStepToHistoryWithId(opt.vers)
         let newStoryVariables = { ...this.currentStoryVariables }
         if (this.dumpEmptyArrays(opt.consequence).length) {
            opt.consequence.forEach(con => {
               newStoryVariables[con[0]] = con[1]
            })
         }
         this.storyVariablesHistory.push(newStoryVariables)
      },
      getAllStoryVariables() {
         const allSteps = this.story.chapitres
         const allOptions = allSteps?.map((step: Step) => step.options).flat()

         const allUsedVariables = {} as Record<string, boolean>
         allOptions.forEach(opt => {
            ['consequence', 'condition'].forEach(key => {
               const exploitableArray = this.dumpEmptyArrays(opt[key])
               if (exploitableArray.length === 0) return
               exploitableArray.forEach((con: (Consequence | Condition)) => {
                  if (allUsedVariables[con[0]] == null) allUsedVariables[con[0]] = false
               })
            })
         })

         return allUsedVariables
      },
      getOptionValidity(option: Option): boolean {
         return this.getStepById(option.vers) != null;
      },
      getOptionVisibility(option: Option): boolean {
         const areAllConditionsMet = option.condition.every(con => {
            return this.currentStoryVariables[con[0]] === con[1]
         })
         return areAllConditionsMet
      },
      async getCurrentCharacterImage() {
         const charPath = import.meta.env.VITE_CHEMIN_DU_DOSSIER_PERSONNAGES
         if (this.currentStep == null || !this.currentStep.perso) return ''
         const characterImage = import(`${charPath}${this.currentStep?.perso}`).then((img: any) => { return img.default })
         return characterImage
      },
      async getCurrentBackgroundImage() {
         const backPath = import.meta.env.VITE_CHEMIN_DU_DOSSIER_FONDS
         if (this.currentStep == null || !this.currentStep.image) return ''
         const backgroundImage = import(`${backPath}${this.currentStep?.image}`).then((img: any) => { return img.default })
         return backgroundImage
      },
      dumpEmptyArrays(array: Consequence[] | Condition[]): Consequence[] | Condition[] {
         return array.filter(con => con.length === 2)
      }
   },

   async mounted() {
      this.story = await import(`${import.meta.env.VITE_CHEMIN_VERS_DOSSIER_JSON}${import.meta.env.VITE_NOM_DE_JSON_HISTOIRE}`).then(mod => { return mod.default })
      this.entryStepId = import.meta.env.VITE_IDENTIFIANT_CHAPITRE_INITIAL
      this.stepHistory.push(getStepById(this.entryStepId, this.story))
      this.storyVariablesHistory = [this.getAllStoryVariables()]
   },

   watch: {
      async currentStep() {
         this.currentCharacterImage = await this.getCurrentCharacterImage()
         this.currentBackgroundImage = await this.getCurrentBackgroundImage()
      }
   }
}
</script>

<template>
   <template v-if="story">
      <DebugMenu :story="story" :entryStepId="entryStepId" :storyVariables="currentStoryVariables" class="h-full w-[30%]" />
      <div class="flex flex-col justify-center w-[60em]">
         <div class="w-full">
            <div class="relative imagesContainer h-[30em] w-full flex justify-center items-end overflow-hidden rounded-t-[0.75em]">
               <img class="z-[-1] absolute w-full opacity-60" :src="currentBackgroundImage" alt="">
               <img class="h-[calc(100%-2em)]" :src="currentCharacterImage" alt="">
            </div>
            <p class="ml-[0.5em] opacity-50 absolute translate-y-[-1.7em]">{{ currentStep?.identifiant }}</p>
            <div class="text-lg h-[6em] p-[0.5em] bg-zinc-900 overflow-auto" v-html="currentStep?.texte" />
            <div class="border-t-[3px] border-solid border-zinc-700 h-[15em] bg-zinc-900 rounded-b-[0.75em] p-[0.5em] overflow-auto">
               <TextButton v-if="previousStep" @click="returnToPreviousStep()" mainText="(Retour...)" :secondaryText="previousStep?.identifiant" :validity="true" :visibility="true" :currentStoryVariables="currentStoryVariables" />
               <template v-for="opt in currentStep?.options">
                  <TextButton @click="takeOption(opt)" :mainText="`${opt.question}`" :secondaryText="opt.vers" :conditions="dumpEmptyArrays(opt?.condition)" :consequences="dumpEmptyArrays(opt?.consequence)" :validity="getOptionValidity(opt)" :visibility="getOptionVisibility(opt)" :currentStoryVariables="currentStoryVariables" />
               </template>
            </div>
         </div>
      </div>
   </template>
</template>

<style scoped lang="scss"></style>
