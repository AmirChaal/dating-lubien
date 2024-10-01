<script lang="ts">
import { Condition, Consequence } from '@/types/Step';

export default {
   props: {
      mainText: {
         type: String,
         required: true
      },
      secondaryText: {
         type: String,
         required: true
      },
      conditions: {
         type: Object as () => Condition[],
         required: false
      },
      consequences: {
         type: Object as () => Consequence[],
         required: false
      },
      validity: {
         type: Boolean,
         required: false,
      },
      visibility: {
         type: Boolean,
         required: false,
      },
      currentStoryVariables: {
         type: Object as () => Record<string, boolean>,
         required: true
      },
      onClick: {
         type: Function,
         required: false
      }
   },

   emits: ['click'],

   computed: {
      visibilityClasses(): string {
         if (this.visibility) return ''
         else return 'opacity-50'
      },
      validityClasses(): string {
         if (this.validity) return 'text-zinc-400 optionHover'
         else return 'text-red-400'
      }
   },

   methods: {
      isOptionConditionMet(condition: Condition): boolean {
         return this.currentStoryVariables[condition[0]] === condition[1]
      }
   }
}
</script>

<template>
   <div class="flex items-center" :class="visibilityClasses, validityClasses, $attrs.class">
      <span class="flex gap-1">
         <i v-if="!visibility" class="pi pi-eye-slash" />
         <i v-if="!validity" class="pi pi-times" />
      </span>
      <p class="font-semibold p-1 flex items-center transition-all select-none" @click="$emit('click')">{{ mainText }} </p>
      <span class="opacity-50 ml-3"> {{ secondaryText }}</span>
   </div>

   <template v-for="consequence in consequences">
      <p class="opacity-50 ml-10 flex items-center text-zinc-400">
         <i class="pi pi-cog mr-2" />
         <span>{{ consequence[0] }} : <span :class="consequence[1] ? 'text-green-500' : 'text-red-500'">{{ consequence[1] }}</span></span>
      </p>
   </template>

   <template v-for="condition in conditions">
      <p class="opacity-50 ml-10 flex items-center" :class="isOptionConditionMet(condition) ? 'text-green-500' : 'text-red-500'">
         <i v-if="isOptionConditionMet(condition)" class="pi pi-check-circle mr-2" />
         <i v-else class="pi pi-circle mr-2" />
         <span>{{ condition[0] }} : {{ condition[1] }}</span>
      </p>
   </template>
</template>

<style scoped lang="scss">
.optionHover {
   p {
      cursor: pointer;

      &:hover {
         transform: translate(0.2em);
         color: #00FFFF;
      }
   }
}
</style>