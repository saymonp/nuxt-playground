<script setup lang="ts">


const movieStore = useMovieStore();

const {
    data: movies, // Aqui dizemos: Pegue os dados retornados e coloque na constante reativa chamada 'movies'
    status,       // O Nuxt altera isso sozinho! Começa como 'pending' e muda para 'success' ou 'error' no final da requisição
    error
} = await useAsyncData('movies-list', () => movieStore.listMovies(), {
    lazy: true
})
</script>

<template>
    <div class="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased">
        <main class="max-w-7xl px-4 sm:px-6 lg:px-8">
            <section class="space-y-6"> <!-- Aplica mt-6 nos filhos -->
                <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Filmes Populares
                </h1>

                <p class="text-lg text-slate-400 max-w-2xl">
                    Descubra os lançamentos mais assistidos da semana com dados atualizados em tempo real.
                </p>

                <div class="h-64 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                    <div v-if="status === 'pending'">
                        Carregando filmes...
                    </div>
                    <div v-else-if="status === 'error'">
                        Houve um erro: {{ error?.message }}
                    </div>
                    <div v-else>
                        <div v-for="movie in movies?.data" :key="movie.id">
                            <h3>{{ movie.titulo_original }}</h3>
                        </div>
                    </div>
                </div>

            </section>
        </main>
    </div>
</template>