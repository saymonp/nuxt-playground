<template>
    <div class="relative min-h-screen bg-zinc-950 overflow-hidden">
        <!-- Banner Skeleton com Overlay de Mensagem -->
        <div class="relative w-full h-[350px] lg:h-[550px] bg-zinc-900/50 overflow-hidden">
            <div class="absolute inset-0 skeleton opacity-40"></div>
            
            <!-- Mensagem Centralizada (Aparece apenas quando isProcessing é true) -->
            <Transition name="fade">
                <div v-if="isProcessing" 
                    class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <div class="relative">
                        <!-- Spinner estilizado -->
                        <div class="w-16 h-16 border-t-2 border-r-2 border-[#00FCFF] rounded-full animate-spin"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-2 h-2 bg-[#00FCFF] rounded-full animate-ping"></div>
                        </div>
                    </div>
                    
                    <div class="mt-6 text-center space-y-2 px-6">
                        <h3 class="text-[#00FCFF] text-lg lg:text-xl font-black uppercase tracking-[0.3em] drop-shadow-[0_0_10px_rgba(0,252,255,0.5)]">
                            Sincronizando Filme
                        </h3>
                        <p class="text-zinc-400 text-xs lg:text-sm font-medium uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                            Buscando metadados e imagens em alta definição...
                        </p>
                    </div>
                </div>
            </Transition>

            <!-- Gradiente para o conteúdo inferior -->
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10"></div>
        </div>

        <!-- Conteúdo Inferior -->
        <div class="relative z-20 px-6 -mt-24 lg:max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
            <!-- Poster Skeleton -->
            <div class="shrink-0 mx-auto lg:mx-0">
                <div class="w-48 h-72 lg:w-72 lg:h-[430px] rounded-2xl border border-white/5 shadow-2xl skeleton opacity-60"></div>
            </div>

            <div class="flex-1 py-8 space-y-8">
                <div class="space-y-4">
                    <!-- Título -->
                    <div class="h-12 w-3/4 lg:w-1/2 skeleton opacity-80"></div>
                    <!-- Info bars -->
                    <div class="flex gap-4">
                        <div class="h-6 w-20 skeleton opacity-40"></div>
                        <div class="h-6 w-32 skeleton opacity-40"></div>
                        <div class="h-6 w-16 skeleton opacity-40"></div>
                    </div>
                </div>

                <!-- Descrição Lines -->
                <div class="space-y-3">
                    <div class="h-4 w-full skeleton opacity-30"></div>
                    <div class="h-4 w-full skeleton opacity-30"></div>
                    <div class="h-4 w-full skeleton opacity-30"></div>
                    <div class="h-4 w-4/5 skeleton opacity-30"></div>
                </div>

                <!-- Buttons Skeleton -->
                <div class="flex gap-3 pt-4">
                    <div class="h-12 w-40 rounded-xl skeleton opacity-40"></div>
                    <div class="h-12 w-12 rounded-xl skeleton opacity-40"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    isProcessing?: boolean;
}>();
</script>

<style scoped>
@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

.skeleton {
    background: linear-gradient(90deg, #18181b 25%, #27272a 50%, #18181b 75%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite linear;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>