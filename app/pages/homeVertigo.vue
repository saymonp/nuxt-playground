<script setup lang="ts">

import { onClickOutside } from '@vueuse/core'
import SearchBarHome from '@/components/SearchBarHome.vue';
import { useAuthStore } from '@/stores/auth';
import { useMovieStore } from '@/stores/movie';
import { storeToRefs } from 'pinia';
import type { DinamicMovieInsertionResponse, GeneroResponse, DiretorResponse, MovieIndex, MovieFilters, MovieIndexResponse } from '@/types/Movies';
import MoviePoster from '@/components/MoviePoster.vue';
import { getImageUrl } from '@/utils/imageHelper';
import MovieIndexSkeleton from '@/components/MovieIndexSkeleton.vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue'
import TheFooter from '@/components/TheFooter.vue';

const authStore = useAuthStore();
const movieStore = useMovieStore();
// transforma as propriedades em Refs, permitindo o uso de .value
const { isAuthenticated, user } = storeToRefs(authStore);

const isResettingFilters = ref(false);
const target = ref(null);

const isSearching = ref(false);

const searchMode = ref('movies')

const filterMovies = ref<MovieFilters>({
    destaque: true,
    lang: 'pt-BR',
    search: undefined,
    generos: [] as number[],
    ano: undefined,
    diretores: [] as number[],  // Array de IDs
    idioma: undefined,       // Sigla do idioma (ex: 'en', 'es')
    recentes: undefined,
    bilheteria: undefined,
    page: 1,
});

// Função que observa mudanças e recarrega os filmes
watch(
    () => ({ ...filterMovies.value }),
    (newVal: any, oldVal) => {
        if (isSearching.value || isResettingFilters.value) return;

        // Verifica se o que mudou foi algo além da página
        const changedOtherThanPage = Object.keys(newVal).some(
            key => key !== 'page' && JSON.stringify(newVal[key]) !== JSON.stringify(oldVal[key])
        );

        if (changedOtherThanPage) {
            // Se mudou um filtro, resetamos a página
            filterMovies.value.page = 1;
            // IMPORTANTE: Não damos 'return' aqui. 
            // Chamamos o loadMovies com o objeto atualizado (já com page: 1)
        }

        loadMovies(filterMovies.value);
    },
    { deep: true }
);

const resetFilters = async () => {
    isResettingFilters.value = true;

    filterValue.value = 0;

    filterMovies.value = {
        destaque: false,
        lang: 'pt-BR',
        search: filterMovies.value.search, // mantém busca
        generos: [],
        ano: undefined,
        diretores: [],
        idioma: undefined,
        recentes: undefined,
        bilheteria: undefined,
        page: 1,
    };

    await nextTick();

    isResettingFilters.value = false;
};

// const movies = ref<MovieIndexResponse>();
// Se MovieIndexResponse for o objeto que contém { data: [...] }
const movies = ref<MovieIndexResponse | DinamicMovieInsertionResponse>();

// Função para checar se a resposta é de importação
function isImportingResponse(res: any): res is DinamicMovieInsertionResponse {
    return res && res.status === 'processando';
}

async function loadMovies(filters: MovieFilters) {
    if (isSearching.value) return;

    isSearching.value = true;
    try {
        const response = await movieStore.listMovies(filters);

        // O TypeScript agora entende o que há dentro de 'response'
        if (isImportingResponse(response)) {
            await resetFilters();
            const tempMovie = {
                id: response.id,
                tmdb: response.tmdb_id,
                titulo_br: response.temp_result.title, // Mudado de title_br para titulo_br
                poster_thumb_br: response.poster_thumb_br,
                poster_thumb_us: response.poster_thumb_us,
                rating: response.temp_result.vote_average,
                year: response.temp_result.release_date?.split('-')[0],
                is_importing: true,
                slug_pt: 'temp-movie',
                slug_en: 'temp-movie'
            };

            // @ts-ignore
            movies.value = { data: [tempMovie] };
            console.log(tempMovie);
        } else {
            // Aqui o TS sabe que é MovieIndexResponse
            movies.value = response;
            console.log("Movies", movies.value)
        }
    } catch (error) {
        console.error("Erro na busca:", error);
    } finally {
        isSearching.value = false;
    }
};

// PASSO 1: CARREGAMENTO PARALELO NO SERVIDOR (SSR) ---
const { data: initialData } = await useAsyncData('initial-movie-metadata', async () => {
    const [genres, directors, idioms] = await Promise.all([
        movieStore.listGenres(),
        movieStore.listDirectors(),
        movieStore.listIdioms()
    ])
    return { genres, directors, idioms }
})

// Mapeamento dos dados reativos vindos do SSR (com valor padrão caso falhe)
const generos = ref<GeneroResponse[]>(initialData.value?.genres || []);
const diretores = ref<DiretorResponse[]>(initialData.value?.directors || []);
const idiomasDisponiveis = ref<string[]>(initialData.value?.idioms || []);

// --- PASSO 2: O ONMOUNTED ---
// Gêneros, diretores e idiomas já vieram do servidor! 
// No mounted, disparara apenas a primeira carga dos filmes no cliente
onMounted(() => {
    try {
        loadMovies(filterMovies.value);
    } catch (error) {
        console.error("Erro ao carregar filmes iniciais:", error);
    }
});

const showFilter = ref(false)
onClickOutside(target, () => (showFilter.value = false))

const filterValue = ref(0);

const movieListSection = ref<HTMLElement | null>(null);

const changePage = (newPage: number) => {
    // Correção: Para validar a última página, use last_page (número) e não last_page_url (string)
    // @ts-ignore
    if (newPage < 1 || newPage > (movies.value?.last_page || 1)) return;

    filterMovies.value.page = newPage;

    // Pequeno delay para garantir que o Vue iniciou a atualização do DOM
    nextTick(() => {
        if (movieListSection.value) {
            const yOffset = -150; // Ajuste este valor para controlar a altura (negativo sobe mais, positivo desce)
            const element = movieListSection.value;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    });
};

const getMovieParam = (movie: any) => {
    const slug = movie.slug_en

    if (!slug || slug.trim() === '') {
        return String(movie.id);
    }

    // Retorna o formato 235-nome-do-filme
    return `${movie.id}-${slug}`;
};

</script>

<template>
    <div class="bg-zinc-50 dark:bg-zinc-900">
        <div class="bg-hero">

            <div class="relative z-10 w-full h-auto">

                <div class="relative w-full h-auto overflow-hidden">

                    <img src="/Vertigo.svg" alt="Logo"
                        class="sm:hidden absolute top-4/5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-65 z-10" />

                    <div class="hidden sm:flex absolute bottom-10 left-0 w-full flex-col items-center z-20">
                        <p class="text-white text-3xl text-center font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                            Registre os filmes que você assistiu.
                        </p>
                        <p
                            class="text-[#00FCFF] text-xl text-center font-bold mt-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                            Crie listas para salvar seus filmes favoritos.
                        </p>
                       
                    </div>
                </div>

                <div class="sm:hidden">
                    <div class="max-w-9/10 mx-auto">
                        <p class="text-white text-2xl text-center font-bold mt-1 mb-3">
                            Registre os filmes que você assistiu.
                        </p>
                        <p class="text-white text-2xl text-center font-bold">
                            Crie listas para salvar seus filmes favoritos
                        </p>
                    </div>

                    <div class="text-center max-w-9/10 mx-auto mt-5">
                        <NuxtLink to="/perfil">
                            <button class="bg-[#00FCFF] text-black font-bold py-2 px-6 rounded-md 
                transition-all duration-300
                shadow-[0_0_15px_rgba(0,252,255,0.8)]
                hover:scale-105 active:scale-95">
                                {{ !!isAuthenticated === true ? "Acesse suas Listas" : "Comece agora — É Grátis" }}
                            </button>
                        </NuxtLink>
                    </div>
                </div>
                <div class="lg:max-w-3xl max-w-13/14 mx-auto mt-10">
            
                            
                    <SearchBarHome v-model:filterMovies="filterMovies" :generos="generos"
                        :diretores="diretores" :idiomas="idiomasDisponiveis" :isSearching="isSearching"
                        v-model:filterValue="filterValue" @search="loadMovies(filterMovies)" />
                    
                </div>
                <MovieIndexSkeleton :isSearching="isSearching" :searchMode="searchMode" />
                <TransitionGroup v-if="searchMode == 'movies'" tag="section" name="list"
                    class="grid grid-cols-2 sm:grid-cols-4 max-w-3xl mt-3 gap-5 p-2.5 mx-auto">
                    <div v-if="movies && (movies as any).data"
                        v-for="movie in (movies as any)?.data?.filter((elemento: any) => elemento.rating >= filterValue)"
                        :key="movie.id" class="relative flex flex-col items-center w-full">


                        <NuxtLink :to="`movie/${movie.slug_en}`" class="w-full">
                            <MoviePoster :path="getImageUrl(movie.poster_thumb_br)" />
                        </NuxtLink>

                        <div class="relative w-full">
                            <div class="flex flex-col items-center">
                                <div class="w-full mt-1">
                                    <p class="text-center text-xs sm:text-sm font-bold text-zinc-100 truncate px-1">
                                        {{ movie.titulo_br }}
                                    </p>

                                    <div class="flex items-center justify-between px-1 mt-2">
                                        <span class="text-[9px] sm:text-[10px] font-black text-zinc-400">
                                            IMDb {{ movie.rating }}
                                        </span>

                                    </div>
                                </div>
                            </div>

                     

                           
                        </div>
                    </div>
                </TransitionGroup>
               
                <!-- Paginação -->
                <div class="flex items-center justify-center gap-2 mt-8 mb-12">
                    <!-- Botão Voltar -->
                    <button v-if="movies && (movies as any).data" @click="changePage((movies as any).current_page - 1)"
                        :disabled="(movies as any).current_page === 1"
                        class="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-[#00FCFF] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <IconChevronLeft class="w-4 h-4" />
                    </button>

                    <!-- Números das Páginas (Simples) -->
                    <div class="flex gap-1">
                        <button v-if="movies && (movies as any).data" v-for="page in (movies as any).last_page"
                            :key="page" @click="changePage(page)"
                            class="w-8 h-8 rounded-lg text-[10px] font-bold transition-all border" :class="(movies as any).current_page === page
                                ? 'bg-[#00FCFF]/20 border-[#00FCFF] text-[#00FCFF]'
                                : 'bg-white/5 border-white/10 text-zinc-500 hover:bg-white/10'">
                            {{ page }}
                        </button>
                    </div>

                    <!-- Botão Próximo -->
                    <button v-if="movies && (movies as any).data" @click="changePage((movies as any).current_page + 1)"
                        :disabled="(movies as any).current_page === (movies as any).last_page"
                        class="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-[#00FCFF] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <IconChevronRight class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
        <TheFooter />
    </div>
</template>

<style>
/* 1. Transição de Entrada e Saída */
.list-enter-active,
.list-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 2. Estado de "Sumir" (Fade + Encolher levemente) */
.list-enter-from,
.list-leave-to {
    opacity: 0;
    /* Reduzimos o movimento para quase zero */
    transform: translateY(5px);
}

/* 3. O Ajuste Crítico para a Saída */
.list-leave-active {
    position: absolute;
    pointer-events: none;
}

/* 4. Suavização do movimento dos que ficam */
.list-move {
    transition: transform 0.4s ease;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.2s ease-out;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
