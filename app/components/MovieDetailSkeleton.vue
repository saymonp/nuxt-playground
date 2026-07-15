<script setup lang="ts">
</script>

<!-- components/MovieDetailSkeleton.vue -->
<template>
    <div class="animate-pulse">
        <!-- Banner Skeleton -->
        <div class="w-full h-[300px] lg:h-[450px] bg-zinc-800 skeleton"></div>

        <div class="relative z-20 px-4 -mt-18 lg:max-w-5xl mx-auto flex flex-col lg:flex-row gap-10">
            <div class="flex-1 space-y-4">
                <!-- Título -->
                <div class="h-10 w-3/4 skeleton"></div>
                <!-- Info bars -->
                <div class="flex gap-4">
                    <div class="h-6 w-16 skeleton"></div>
                    <div class="h-6 w-32 skeleton"></div>
                </div>
                <!-- Descrição -->
                <div class="space-y-2 mt-6">
                    <div class="h-4 w-full skeleton"></div>
                    <div class="h-4 w-full skeleton"></div>
                    <div class="h-4 w-2/3 skeleton"></div>
                </div>
            </div>

            <!-- Poster Skeleton -->
            <div class="shrink-0 hidden lg:block">
                <div class="w-40 h-60 lg:w-70 lg:h-[400px] rounded-xl skeleton"></div>
            </div>
        </div>
    </div>
</template>

<style>
@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

.skeleton {
    background: linear-gradient(90deg, #27272a 25%, #3f3f46 50%, #27272a 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite linear;
    border-radius: 0.5rem;
    display: inline-block;
}
</style>