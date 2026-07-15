<template>
  <div class="relative overflow-hidden aspect-[16/9] w-full" v-bind="$attrs">
    
    <img 
      v-if="path && !hasError" 
      :src="path" 
      @error="hasError = true"
      class="w-full h-full object-cover"
    />

    <div v-else
      class="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-white/5 p-4 text-center">
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

defineOptions({
  inheritAttrs: false
});

const props = defineProps<{
  path: string | null | undefined;
  title?: string;
}>();

const hasError = ref(false);

// Se o path mudar (troca de filme na mesma tela), reseta o estado de erro
watch(() => props.path, () => {
  hasError.value = false;
});
</script>