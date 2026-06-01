<script setup lang="ts">

defineProps<{
  isSearching: boolean;
  searchMode: string;
}>();
</script>
<template>
    <section v-if="searchMode == 'movies' && isSearching"
        class="grid grid-cols-2 sm:grid-cols-4 max-w-3xl mt-3 gap-5 p-2.5 mx-auto animate-pulse">

        <div v-for="n in 8" :key="n" class="relative flex flex-col items-center w-full">

            <div class="w-full aspect-[2/3] bg-zinc-800 rounded-lg shadow-md"></div>

            <div class="relative w-full mt-1">
                <div class="flex flex-col items-center">
                    <div class="w-full mt-1">

                        <div class="h-4 bg-zinc-800 rounded w-3/4 mx-auto my-1"></div>

                        <div class="flex items-center justify-between px-1 mt-3">
                            <div class="w-6 h-6 rounded-full bg-zinc-800"></div>

                            <div class="h-3 bg-zinc-800 rounded w-12"></div>

                            <div class="w-6 h-6 rounded-full bg-zinc-800"></div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    </section>
</template>