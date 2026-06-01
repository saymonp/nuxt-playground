<template>
  <!-- O Vue aplicará automaticamente as classes passadas aqui se este for o elemento raiz -->
  <div class="relative overflow-hidden aspect-[2/3]" v-bind="$attrs">
    
    <img 
      v-if="path && !hasError" 
      :src="path" 
      @error="hasError = true"
      class="w-full h-full object-cover"
    />

    <div v-else
      class="flex flex-col items-center justify-center w-full h-full bg-white/5 border-2 border-dashed border-white/10 p-2 text-center">
      <IconNoMovies class="w-8 h-8 text-white/20 mb-2" />
      <span class="text-white/30 text-[10px] font-medium leading-tight">
        {{ title || 'Sem Imagem' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import IconNoMovies from './icons/IconNoMovies.vue';
// Desabilita a herança automática para termos controle total (opcional)
defineOptions({
  inheritAttrs: false
});

defineProps<{
  path: string | null | undefined;
  title?: string;
}>();

const hasError = ref(false);
</script>