<script lang="ts">
import { Condition, Consequence, Option, Step, Story } from '@/types/Step';
import { getStepById } from '@/functions/getStepById'

export default {
   name: 'DebugMenu',
   data() {
      return {
      };
   },

   props: {
      story: {
         required: true,
         type: Object as () => Story
      },
      entryStepId: {
         required: true,
         type: String
      },
      storyVariables: {
         required: true,
         type: Object as () => Record<string, boolean>,
         mutable: true
      }
   },

   computed: {
      stepsWithDuplicateIds(): Step[] {
         const allIds = this.story.chapitres.map((step: Step) => step.identifiant)
         const duplicateIds = allIds.filter((id: string, index: number) => allIds.indexOf(id) !== index)
         return duplicateIds.map(id => getStepById(id, this.story))
      },
      unusedSteps(): Step[] {
         const allIds = this.story.chapitres.map((step: Step) => step.identifiant)
         const allOptions = this.story.chapitres.flatMap((step: Step) => step.options.map(o => o.vers))
         const unusedSteps = allIds.filter((id: string) => !allOptions.includes(id)).map(id => getStepById(id, this.story))
         const unusedStepsWithoutEntryStep = unusedSteps.filter((step: Step) => step.identifiant !== this.entryStepId)
         return unusedStepsWithoutEntryStep
      },
      falseBridges(): string[] {
         const allIds = this.story.chapitres.map((step: Step) => step.identifiant)
         const allOptions = this.story.chapitres.flatMap((step: Step) => step.options.map(o => o.vers))
         return allOptions.filter((id: string) => !allIds.includes(id))
      }
   },

   methods: {



   },

   mounted() {
   }
};
</script>

<template>
   <div class="flex flex-col gap-5">
      <div class="h-1/2 w-full overflow-auto">
         <div v-if="stepsWithDuplicateIds.length">
            <p class="text-red-400 text-lg uppercase font-semibold">Identifiants répétés</p>
            <p class="truncate" v-for="step in stepsWithDuplicateIds">
               <span>{{ step.identifiant }} : </span>
               <span class="opacity-50">{{ step.texte }}</span>
            </p>
         </div>
         <div v-if="unusedSteps.length">
            <p class="text-red-400 text-lg uppercase font-semibold">Etapes non utilisées</p>
            <p class="truncate" v-for="step in unusedSteps">
               <span>{{ step.identifiant }} : </span>
               <span class="opacity-50">{{ step.texte }}</span>
            </p>
         </div>
         <div v-if="falseBridges.length">
            <p class="text-red-400 text-lg uppercase font-semibold">Ponts cassés</p>
            <p class="truncate" v-for="id in falseBridges">{{ id }}</p>
         </div>
      </div>
      <div class="h-1/2 w-full overflow-auto">
         <p v-for="(val, key) in storyVariables">
            <span>{{ key }} : </span>
            <span :class="val ? 'text-green-500' : 'text-red-500'">{{ val }}</span>
         </p>
      </div>
   </div>
</template>


<style scoped></style>