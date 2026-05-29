<script setup lang="ts">


const movieStore = useMovieStore();

const {
    data: movies, // Aqui dizemos: Pegue os dados retornados e coloque na constante reativa chamada 'movies'
    status: moviesStatus,       // O Nuxt altera isso sozinho! Começa como 'pending' e muda para 'success' ou 'error' no final da requisição
    error: moviesError
} = await useAsyncData('movies-list', () => movieStore.listMovies(), {
    lazy: true
})

const {
    data: marioMovie,
} = await useAsyncData('mario-movie', () => movieStore.detailMovie("23"))
</script>

<template>
    <div class="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased">
        <main class="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
            <section class="space-y-6"> <!-- Aplica mt-6 nos filhos -->
                <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Exercíco de Grid Nível 1/3
                </h1>

                <p class="text-lg text-slate-400 max-w-2xl">
                    Grid simples onde em telas pequenas tem 1 coluna, telas médias 2 colunas e telas grande 4 colunas.
                </p>

                <div v-if="moviesStatus === 'pending'">
                    Carregando filmes...
                </div>
                <div v-else-if="moviesStatus === 'error'">
                    Houve um erro: {{ moviesError?.message }}
                </div>
                <div v-else>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
                        <div v-for="movie in movies?.data" :key="movie.id"
                            class="flex flex-col items-center group cursor-pointer">
                            <img :src="movie.poster_thumb_us || movies?.data[0]?.poster_thumb_us" />
                            <h3
                                class="block font-semibold text-slate-200 group-hover:text-blue-500 transition-colors line-clamp-1">
                                {{ movie.titulo_original }}
                            </h3>
                        </div>
                    </div>
                </div>


            </section>
            <section class="space-y-6"> <!-- Aplica mt-6 nos filhos -->
                <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Exercíco de Grid Nível 2/3
                </h1>

                <p class="text-lg text-slate-400 max-w-2xl">
                    Grid de 4 colunas.
                    Card de destaque ocupa 2 colunas.
                </p>

                <div v-if="moviesStatus === 'pending'">
                    Carregando filmes...
                </div>
                <div v-else-if="moviesStatus === 'error'">
                    Houve um erro: {{ moviesError?.message }}
                </div>
                <div v-else>
                    <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 ">
                        <div class="col-span-1 sm:col-span-2 flex flex-col items-center bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group cursor-pointer"
                            v-for="movie in movies?.data.slice(0, 1)" :key="movie.id">
                            <h3
                                class="m-1 uppercase font-bold text-slate-200 group-hover:text-blue-500 transition-colors line-clamp-1">
                                Filme em Destaque</h3>
                            <div class="w-full sm:w-1/2 sm:h-full bg-slate-950 overflow-hidden">
                                <img :src="movie.poster_thumb_us || movies?.data[0]?.poster_thumb_us" />
                            </div>
                            <h3
                                class="font-semibold text-slate-200 group-hover:text-blue-500 transition-colors line-clamp-1">
                                {{ movie.titulo_original }}
                            </h3>
                        </div>
                        <div v-for="movie in movies?.data.slice(1)" :key="movie.id"
                            class="flex flex-col items-center group cursor-pointer">
                            <img :src="movie.poster_thumb_us || movies?.data[0]?.poster_thumb_us" />

                            <h3
                                class="font-semibold text-slate-200 group-hover:text-blue-500 transition-colors line-clamp-1">
                                {{ movie.titulo_original }}
                            </h3>
                        </div>
                    </div>
                </div>


            </section>
            <section class="space-y-6"> <!-- Aplica mt-6 nos filhos -->
                <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Exercíco de Grid Nível 3/3
                </h1>

                <p class="text-lg text-slate-400 max-w-2xl">
                    Bento Grid
                </p>

                <div v-if="moviesStatus === 'pending'">
                    Carregando filmes...
                </div>
                <div v-else-if="moviesStatus === 'error'">
                    Houve um erro: {{ moviesError?.message }}
                </div>
                <div v-else>
                    <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 ">
                        <div v-for="movie in movies?.data.slice(0, 2)" :key="movie.id"
                            class="flex flex-col items-center group cursor-pointer">
                            <img class="w-full h-full object-cover"
                                :src="movie.poster_thumb_us || movies?.data[0]?.poster_thumb_us" />
                            <h3
                                class="font-semibold text-slate-200 group-hover:text-blue-500 transition-colors line-clamp-1">
                                {{ movie.titulo_original }}
                            </h3>
                        </div>

                        <div v-for="movie in movies?.data.slice(2, 3)" :key="movie.id"
                            class="row-span-2 col-span-2 flex flex-col items-center group cursor-pointer">
                            <img class="w-full h-full object-cover"
                                :src="movie.poster_thumb_us || movies?.data[0]?.poster_thumb_us" />

                            <h3
                                class="font-semibold text-slate-200 group-hover:text-blue-500 transition-colors line-clamp-1">
                                {{ movie.titulo_original }}
                            </h3>
                        </div>
                        <div v-if="marioMovie" class="col-span-2">
                            <div class="flex flex-col items-center group cursor-pointer">
                                <img class="w-full h-full object-cover" :src="marioMovie?.movie.backdrop_path" />
                                <h3>{{ marioMovie?.movie.titulo_original }}</h3>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <section class="space-y-6"> <!-- Aplica mt-6 nos filhos -->
                <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Exercíco Extra
                </h1>

                <p class="text-lg text-slate-400 max-w-2xl">
                    Listagem tipo Pinterest
                </p>

                <div v-if="moviesStatus === 'pending'">
                    Carregando filmes...
                </div>
                <div v-else-if="moviesStatus === 'error'">
                    Houve um erro: {{ moviesError?.message }}
                </div>
                <div v-else>
                    <div
                        class="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 [column-fill:balance]">

                        <div
                            class="break-inside-avoid bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3 mb-6">
                            <div
                                class="w-full h-80 bg-blue-950 rounded-xl flex items-center justify-center text-blue-400 font-bold">
                                <img class="h-full" :src="marioMovie?.movie.poster_path_us"/>
                            </div>
                            
                            <p class="text-xs text-slate-400">Uma sinopse bem longa que vai ocupar várias linhas aqui no
                                rodapé do card para dar volume.</p>
                        </div>

                        <div
                            class="break-inside-avoid bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3 mb-6">
                            <div
                                class="w-full h-40 bg-purple-950 rounded-xl flex items-center justify-center text-purple-400 font-bold">
                                <img class="w-full" :src="marioMovie?.movie.backdrop_path"/></div>
                            <h3 class="font-semibold text-white">Filme Curto</h3>
                            <p class="text-xs text-slate-400">Texto rápido.</p>
                        </div>

                        <div
                            class="break-inside-avoid bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3 mb-6">
                            <div
                                class="w-full h-60 bg-emerald-950 rounded-xl flex items-center justify-center text-emerald-400 font-bold">
                                <img class="h-full" :src="marioMovie?.movie.poster_path_us"/></div>
                            <h3 class="font-semibold text-white">Comédia da Semana</h3>
                            <p class="text-xs text-slate-400">Texto de tamanho mediano para testar o encaixe automático
                                do layout.</p>
                        </div>

                        <div
                            class="break-inside-avoid bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3 mb-6">
                            <div
                                class="w-full h-96 bg-amber-950 rounded-xl flex items-center justify-center text-amber-400 font-bold">
                                <img class=" w-full" :src="marioMovie?.movie.poster_path_us"/></div>
                            <h3 class="font-semibold text-white">Épico de Ficção Científica</h3>
                            <p class="text-xs text-slate-400">Mais um texto longo para forçar o Masonry a trabalhar
                                jogando o próximo card para cima.</p>
                        </div>

                        <div
                            class="break-inside-avoid bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3 mb-6">
                            <div
                                class="w-full h-44 bg-red-950 rounded-xl flex items-center justify-center text-red-400 font-bold">
                                <img class="w-full" :src="marioMovie?.movie.backdrop_path"/></div>
                            <h3 class="font-semibold text-white">Documentário</h3>
                            <p class="text-xs text-slate-400">Finalizando a distribuição.</p>
                        </div>

                    </div>
                </div>


            </section>
        </main>
    </div>
</template>

<style lang="css"></style>