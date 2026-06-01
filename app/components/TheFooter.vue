<template>
  <footer class="w-full mt-50 pt-16 bg-[#020036]/80 border-t backdrop-blur-md py-8">
    <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
      
      <div class="flex flex-col items-center md:items-start">
        <div class="flex items-center gap-2 mb-2">
          <InconVertigoFooter class="w-12 h-12 text-[#00FCFF] drop-shadow-[0_0_8px_rgba(0,252,255,0.5)]" />
          <span class="text-white font-black text-xl tracking-tighter">VERTIGO</span>
        </div>
        <p class="text-zinc-500 text-[10px] uppercase tracking-[0.2em]">O seu guia neon de cinema</p>
      </div>

      <div class="text-center">
        <p class="text-zinc-400 text-xs font-medium">
          Desenvolvido por 
          <a href="URL_DO_SEU_PORTFOLIO" target="_blank" 
             class="text-white hover:text-[#00FCFF] transition-all duration-300 border-b border-transparent hover:border-[#00FCFF] pb-0.5">
            Saymon
          </a>
        </p>
      </div>

      <div class="flex items-center gap-4">
        <a href="URL_DO_INSTAGRAM_FILMEIRO" target="_blank" 
           class="group flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 hover:border-[#CC00CC] transition-all duration-500">
          <span class="text-zinc-400 text-[10px] font-bold group-hover:text-white transition-colors">INSTAGRAM</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#CC00CC] group-hover:drop-shadow-[0_0_5px_rgba(204,0,204,1)]">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
      </div>

    </div>

    <div class="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-white/5 flex justify-center">
      <p class="text-zinc-600 text-[9px] uppercase tracking-widest">
        &copy; 2026 VERTIGO - Todos os direitos reservados.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import InconVertigoFooter from'@/components/icons/InconVertigoFooter.vue';

</script>