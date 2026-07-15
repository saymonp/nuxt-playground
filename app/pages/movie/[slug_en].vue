<script setup lang="ts">

import Navbar from '@/components/Navbar.vue';
import TheFooter from '@/components/TheFooter.vue';
import IconStar from '@/components/icons/IconStar.vue';
import IconWatchLater from '@/components/icons/IconWatchLater.vue';
import IconAddToList from '@/components/icons/IconAddToList.vue';
import IconCheck from '@/components/icons/IconCheck.vue';
import MovieDetailSkeleton from '@/components/MovieDetailSkeleton.vue';
import MovieDetailSkeletonMessage from '@/components/MovieDetailSkeletonMessage.vue';
import type { MovieDetails, CollectionMovie, RelatedMovie, MovieList, Review } from '@/types/Movies';
import { useAuthStore } from '@/stores/auth';
import { useMovieStore } from '@/stores/movie';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import type { ListasUser } from '@/types/Listas';
import { onClickOutside } from '@vueuse/core';
import MoviePoster from '@/components/MoviePoster.vue';
import { getImageUrl } from '@/utils/imageHelper';
import MovieBackdrop from '@/components/MovieBackdrop.vue';
import IconLike from '@/components/icons/IconLike.vue';

const movie = ref<MovieDetails>();
const collection = ref<CollectionMovie[]>();
const reviews = ref<Review[]>();
const moviesRelacionados = ref<RelatedMovie[]>();
const listas = ref<MovieList[]>();

const abaAtiva = ref('generos');
const authStore = useAuthStore();
const { isAuthenticated, user } = storeToRefs(authStore);
const movieStore = useMovieStore();

const userListas = ref<ListasUser[]>();

const activeList = ref(false);
const target = ref(null);
const isMovieAddWatchLater = ref<{ id: number, attached: boolean, isDefault: boolean, index: number }>();
const isMovieWatched = ref<{ id: number, attached: boolean, isDefault: boolean, index: number }>();
const isProcessing = ref(false); // Nova ref para a mensagem de instantes

const props = defineProps<{
  slug: string;
  lang?: string;
}>();

const isSearching = ref(false);

const maxRetries = 5;
const retryDelay = 2500;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadFullMovie(retryCount = 0) {
  if (isSearching.value && retryCount === 0) return;

  if (retryCount === 0) {
    isSearching.value = true;
    isProcessing.value = false; // Reseta ao iniciar
  }

  try {
    const response = await movieStore.fullDetailMovie(props.slug);
    const movieData = response.movie;

    const movieReady =
      movieData.status === 'processado' &&
      !!movieData.titulo_original &&
      !!movieData.poster_path_br &&
      !!movieData.backdrop_path &&
      !!movieData.descricao_br;

    if (!movieReady && retryCount < maxRetries) {
      // ATIVA A MENSAGEM: Se entrou aqui, significa que vai rodar um retry
      isProcessing.value = true;

      console.log(`Processando filme... tentativa ${retryCount + 1}/${maxRetries}`);

      await sleep(retryDelay);
      return await loadFullMovie(retryCount + 1);
    }

    // Filme pronto
    movie.value = movieData;
    collection.value = response.collection;
    reviews.value = response.reviews;
    moviesRelacionados.value = response.related;
    listas.value = response.lists;

    isProcessing.value = false; // Desativa pois o filme carregou

  } catch (error) {
    console.error("Erro na comunicação com a API:", error);
    isProcessing.value = false;
  } finally {
    if (retryCount >= maxRetries || movie.value?.status !== 'processando') {
      isSearching.value = false;
    }
  }
}



// PASSO 1: CARREGAMENTO PARALELO NO SERVIDOR (SSR) ---
const { data: initialData, status, error } = await useAsyncData('movie-data', async () => {
    const [movie] = await Promise.all([
        loadFullMovie()
    ])
    return { movie }
})

const {
    data: movies, // Aqui dizemos: Pegue os dados retornados e coloque na constante reativa chamada 'movies'
    status,       // O Nuxt altera isso sozinho! Começa como 'pending' e muda para 'success' ou 'error' no final da requisição
    error
} = await useAsyncData('movie-data', () => {
    lazy: true
})
// Mapeamento dos dados reativos vindos do SSR (com valor padrão caso falhe)
const generos = ref<GeneroResponse[]>(initialData.value?.genres || []);
const diretores = ref<DiretorResponse[]>(initialData.value?.directors || []);
const idiomasDisponiveis = ref<string[]>(initialData.value?.idioms || []);

const hoverRating = ref(0); // Para efeito visual ao passar o mouse

watch(() => props.slug, async () => {
  // Limpa dados antigos para não mostrar filme errado enquanto carrega
  movie.value = undefined;
  reviews.value = undefined;

  await loadAllData(); // Reutiliza a lógica de paralelismo
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const limite = ref(1); // Quantas reviews aparecem inicialmente

const mostrarMais = () => {
  limite.value += 3; // Carrega mais 3 por vez
};

const isCardReviewVisible = ref(false);

// Função para pegar a data de hoje formatada (YYYY-MM-DD)
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Inicializamos o estado com a data de hoje
const dataAssistido = ref(getTodayDate());

const getMovieParam = (movie: any) => {
  // Pega o slug de acordo com o idioma
  const slug = movie.slug_en;

  // Se não houver slug (nulo ou vazio), retorna apenas o ID
  if (!slug || slug.trim() === '') {
    return String(movie.id);
  }

  // Retorna o formato 235-nome-do-filme
  return `${movie.id}-${slug}`;
};


const movieStyles = [
  { zIndex: 'z-40', ml: '', opacity: 'opacity-100', hover: 'group-hover:-translate-y-2', ring: 'ring-2 ring-[#7075AB]' },
  { zIndex: 'z-30', ml: '-ml-2 sm:-ml-14 lg:-ml-16', opacity: 'opacity-100', hover: 'group-hover:-translate-y-1', ring: 'ring-1 ring-white/20' },
  { zIndex: 'z-20', ml: '-ml-4 sm:-ml-14 lg:-ml-16', opacity: 'opacity-100', hover: '', ring: 'ring-1 ring-white/10' },
  { zIndex: 'z-10', ml: '-ml-5 sm:-ml-14 lg:-ml-16', opacity: 'opacity-100', hover: '', ring: 'ring-1 ring-white/5' },
];

onClickOutside(target, () => (activeList.value = false));

const isSubmitting = ref(false);
const tagInput = ref('');
const formReview = reactive({
  titulo: '',
  comentario: '',
  rating: 0,
  tags: [] as string[],
});

const userReview = computed(() => {
  if (!reviews.value || !user.value?.id) return null;

  // Procura nas reviews carregadas aquela que pertence ao usuário
  return reviews.value.find(review => review.user_id === user.value?.id) || null;
});

// Quando a review do usuário for encontrada, preenchemos o formulário
watch(userReview, (newReview) => {
  console.log("review do user", newReview);
  if (newReview) {
    // Aqui você preenche as refs do seu formulário de edição
    formReview.comentario = newReview.comentario;
    formReview.rating = newReview.rating;
    formReview.tags = newReview.tags.map(t => t.nome);
    formReview.titulo = newReview.titulo;
  }
}, { immediate: true });

</script>

<template>
  <!-- Modal de Review -->
  <div v-show="isCardReviewVisible" class="fixed z-50 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-8 
            top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_20px_rgba(0,252,255,0.1)] w-[92%] max-w-[450px]">

    <div class="flex flex-col gap-6">
      <div class="text-center">
        <h2 class="text-zinc-100 font-black text-2xl tracking-tighter uppercase">Minha Review</h2>
        <p class="text-zinc-500 text-xs mt-1 italic">Compartilhe sua opinião sobre o filme</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-zinc-400 text-[10px] uppercase font-bold ml-1">Título da Review</label>
          <input type="text" v-model="formReview.titulo" placeholder="Ex: Incrível!"
            class="w-full bg-white/5 border border-white/10 p-2.5 rounded-lg text-white text-sm outline-none focus:border-[#00FCFF] focus:ring-1 focus:ring-[#00FCFF]/50 transition-all">
        </div>


      </div>

      <!-- Rating -->
      <div class="flex flex-col items-center bg-white/5 p-4 rounded-xl border border-white/5">
        <label class="text-zinc-400 text-[10px] uppercase font-bold mb-2">Sua Nota</label>
        <div class="flex items-center gap-2">
          <div class="flex">
            <button v-for="star in 5" :key="star" type="button"
              @mouseenter="hoverRating = star" @mouseleave="hoverRating = 0"
              class="p-1 transition-all active:scale-125 cursor-pointer">
              <IconStar class="w-6 h-6 transition-colors duration-200"
                :class="star <= (hoverRating || formReview.rating) ? 'text-[#00FCFF] drop-shadow-[0_0_8px_#00FCFF]' : 'text-zinc-700'" />
            </button>
          </div>
          <span class="text-[#00FCFF] font-black text-xl italic ml-2 w-10">{{ formReview.rating }}<span
              class="text-zinc-600 text-sm">/5</span></span>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-zinc-400 text-[10px] uppercase font-bold ml-1">Sua Mensagem</label>
        <textarea v-model="formReview.comentario" rows="4"
          placeholder="O que você achou da fotografia, roteiro e atuação?"
          class="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white text-sm outline-none focus:border-[#00FCFF] focus:ring-1 focus:ring-[#00FCFF]/50 transition-all resize-none"></textarea>
      </div>

      <!-- Tags com Feedback Visual -->
      <div class="flex flex-col gap-1">
        <label class="text-zinc-400 text-[10px] uppercase font-bold ml-1">Tags <span
            class="lowercase font-normal opacity-50">(pressione enter)</span></label>
        <input type="text" v-model="tagInput"
          placeholder="Ex: Masterpiece, Terror, Favorito"
          class="w-full bg-white/5 border border-white/10 p-2.5 rounded-lg text-white text-sm outline-none focus:border-[#00FCFF] transition-all">

        <div v-if="formReview.tags.length > 0" class="flex flex-wrap gap-1.5 mt-2">
          <span v-for="(tag, index) in formReview.tags" :key="index"
            class="bg-[#00FCFF]/10 text-[#00FCFF] text-[9px] uppercase font-bold px-2 py-1 rounded-md border border-[#00FCFF]/20 flex items-center gap-1">
            {{ tag }}
            <button class="hover:text-white ml-1">×</button>
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-3 mt-2">
        <button :disabled="isSubmitting"
          class="w-full bg-[#00FCFF] text-black font-black uppercase tracking-widest py-3 rounded-lg hover:bg-[#00f2f5] hover:shadow-[0_0_20px_rgba(0,252,255,0.4)] transition-all cursor-pointer active:scale-95 disabled:opacity-50">
          {{ isSubmitting ? 'Publicando...' : 'Publicar Review' }}
        </button>

        <button @click="isCardReviewVisible = false"
          class="w-full py-2 text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors cursor-pointer">
          Cancelar e Sair
        </button>
      </div>
    </div>
  </div>

  <!-- Overlay de fundo -->
  <div v-if="isCardReviewVisible" @click="isCardReviewVisible = false"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40">
  </div>
  <div class="bg-zinc-50 dark:bg-zinc-900">
    <Navbar />
    <!-- ESTADO DE LOADING -->
    <div v-if="isSearching">
      <!-- Agora a mensagem está integrada no componente -->
      <MovieDetailSkeletonMessage :is-processing="isProcessing" />
    </div>

    <div v-else-if="movie" class="bg-hero">
      <div v-if="movie" class="relative z-10 w-full h-auto">

        <div class="relative w-full h-auto overflow-hidden">



          <div
            class="relative w-full h-auto mx-auto max-w-[1440px] h-auto lg:max-w-[400%] lg:max-h-[450px] object-cover object-top mask-[linear-gradient(to_bottom,black_55%,transparent_100%)] sm:mask-[linear-gradient(to_bottom,black_70%,transparent_100%)]">

            <MovieBackdrop :path="movie.backdrop_path ? getImageUrl(movie.backdrop_path) : null"
              class="w-full h-full object-cover opacity-75" />
          </div>
        </div>

        <div class="relative z-20 px-4 -mt-13 sm:-mt-18 lg:max-w-5xl  mx-auto">



          <div class="mt-2 flex gap-2 lg:gap-10 lg:place-content-around">
            <div
              class="flex-1 flex flex-col gap-1 lg:flex-row lg:flex-wrap lg:items-baseline lg:gap-x-4 h-fit lg:max-w-[800px]">
              <h1 class="text-zinc-100 font-black text-2xl uppercase drop-shadow-md">
                {{ movie.titulo_br }}
              </h1>
              <p class="items-center justify-center text-zinc-300 font-bold leading-relaxed">{{
                movie.release_date?.slice(0, 4) }}
              </p>
              <p class="text-zinc-400 leading-relaxed">Dirigido por <span class="font-bold text-zinc-300">{{
                movie.diretores?.map(diretor => diretor.nome).join(', ') || 'Diretor desconhecido'}}</span></p>
              <p class="text-zinc-400 leading-relaxed drop-shadow-sm basis-full">{{ movie.tagline_br }}</p>
              <p class="text-zinc-400 leading-relaxed mb-2">{{ movie.duracao }} mins</p>
              <div class="mt-2 hidden lg:block">
                <p class="text-zinc-400 leading-relaxed">
                  {{ movie.descricao_en || 'Descrição indisponível'  }}
                </p>
              </div>
              <button v-if="isAuthenticated" @click="isCardReviewVisible = true"
                class="mt-2 w-fit lg:basis-auto bg-white/5 border border-white/20 text-white rounded-lg py-1 px-4 ring-1 ring-[#00FCFF]/50 hover:bg-[#00FCFF]/10 cursor-pointer transition-all">
                Fazer Review
              </button>
              <!-- Estrelas -->
              <div v-if="isAuthenticated" class="mt-4 flex lg:basis-full lg:items-center">
                <button v-for="star in 5" :key="star" type="button"
                  @mouseenter="hoverRating = star" @mouseleave="hoverRating = 0"
                  class="p-1 transition-all active:scale-125 cursor-pointer">
                  <IconStar class="w-6 h-6 transition-colors duration-200"
                    :class="star <= (hoverRating || formReview.rating) ? 'text-[#00FCFF] drop-shadow-[0_0_8px_#00FCFF]' : 'text-zinc-700'" />
                </button>
                <span class="text-[#00FCFF] font-black text-l italic">
                  {{ formReview.rating }}/5
                </span>
              </div>
              <!-- PC -->
              <div v-if="isAuthenticated" class="hidden lg:flex lg:w-full mt-8 lg:justify-around">
                <div class="flex justify-around w-full max-w-2xl mx-auto items-center">

                  <div v-if="isMovieAddWatchLater" class="flex flex-col items-center gap-2">
                    <button 
                      class="relative w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-500"
                      :class="isMovieAddWatchLater?.attached
                        ? 'bg-[#00FCFF] border-[#00FCFF] shadow-[0_0_15px_rgba(0,252,255,0.4)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'">
                      <IconWatchLater class="w-6 h-6 transition-colors"
                        :class="isMovieAddWatchLater?.attached ? 'text-black' : 'text-zinc-100'" />
                    </button>

                    <span class="text-[10px] lg:text-xs text-center max-w-[80px] transition-colors"
                      :class="isMovieAddWatchLater?.attached ? 'text-[#00FCFF] font-bold' : 'text-zinc-400'">
                      {{ isMovieAddWatchLater?.attached ? 'Na Lista' : 'Ver Depois' }}
                    </span>
                  </div>

                  <div class="relative flex flex-col items-center gap-2">

                    <IconAddToList  class="w-10 h-10 text-zinc-100 opacity-80 cursor-pointer" />

                    <span class="text-zinc-100 text-[10px] lg:text-xs text-center max-w-[80px]">
                      Salvar na Lista
                    </span>

                    <Transition name="fade-slide">
                      <div v-if="activeList" ref="target" class="absolute top-full left-1/2 -translate-x-1/2 z-[60] mt-2 w-56 bg-[#0f0f0f]/95 border
                        border-white/10 rounded-xl p-4 shadow-[0_15px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">

                        <div v-if="userListas && userListas?.length > 0" class="flex flex-col gap-3">
                          <p class="text-[10px] text-zinc-500 uppercase font-black border-b border-white/5 pb-1">
                            Salvar em:
                          </p>

                          <div class="flex flex-col gap-2 max-h-32 overflow-y-auto pr-1">
                            <label v-for="(lista, index) in userListas" :key="lista.id"
                              class="flex items-center gap-2 cursor-pointer group">
                              <input type="checkbox" :checked="lista.movie_exists" 
                                class="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#00FCFF]">
                              <span class="text-zinc-300 text-[11px] truncate">{{ lista.titulo }}</span>
                            </label>
                          </div>

                          <button @click="activeList = false"
                            class="w-full bg-white/10 hover:bg-[#00FCFF] text-white hover:text-black text-[9px] font-black py-2 rounded-md transition-all">
                            Concluir
                          </button>
                        </div>
                      </div>
                    </Transition>
                  </div>
                  <div v-if="isMovieWatched" class="flex flex-col items-center gap-2">
                    <button
                      class="relative w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-500 group"
                      :class="isMovieWatched?.attached
                        ? 'bg-[#00FCFF] border-[#00FCFF] shadow-[0_0_15px_rgba(0,252,255,0.4)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'">
                      <IconCheck class="w-6 h-6 transition-all duration-300" :class="isMovieWatched?.attached
                        ? 'text-black scale-110'
                        : 'text-zinc-100 opacity-60 group-hover:opacity-100'" />
                    </button>

                    <span class="text-[10px] lg:text-xs text-center max-w-[80px] transition-colors duration-300"
                      :class="isMovieWatched?.attached ? 'text-[#00FCFF] font-bold' : 'text-zinc-100 opacity-80'">
                      {{ isMovieWatched?.attached ? 'Assistido' : 'Marcar visto' }}
                    </span>
                  </div>

                </div>
              </div>
            </div>
            <div class="flex flex-col ">
              <div class="shrink-0 ml-auto">
                <MoviePoster v-if="movie.poster_path_br" :path="getImageUrl(movie.poster_path_br)"
                  class="-mt-1 w-40 sm:w-70 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10" />
              </div>


            </div>

          </div>
          <!-- Mobile -->
          <div v-if="isAuthenticated" class="block lg:hidden">
            <div class="grid grid-cols-3 gap-12 mx-auto lg:mx-0 w-fit lg:w-full max-w-md mt-9 lg:mt-6">
              <div v-if="isMovieAddWatchLater" class="flex flex-col items-center gap-2">
                <button 
                  class="relative w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-500"
                  :class="isMovieAddWatchLater?.attached
                    ? 'bg-[#00FCFF] border-[#00FCFF] shadow-[0_0_15px_rgba(0,252,255,0.4)]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'">
                  <IconWatchLater class="w-6 h-6 transition-colors"
                    :class="isMovieAddWatchLater?.attached ? 'text-black' : 'text-zinc-100'" />
                </button>

                <span class="text-[10px] lg:text-xs text-center max-w-[80px] transition-colors"
                  :class="isMovieAddWatchLater?.attached ? 'text-[#00FCFF] font-bold' : 'text-zinc-400'">
                  {{ isMovieAddWatchLater?.attached ? 'Na Lista' : 'Ver Depois' }}
                </span>
              </div>

              <div v-if="userListas?.length" class="relative flex flex-col items-center gap-2">

                <IconAddToList class="w-10 h-10 text-zinc-100 opacity-80 cursor-pointer" />

                <span class="text-zinc-100 text-[10px] lg:text-xs text-center max-w-[80px]">
                  Salvar na Lista
                </span>

                <Transition name="fade-slide">
                  <div v-if="activeList" ref="target" class="absolute top-12 left-1/2 -translate-x-1/2 z-[60] mt-2 w-56 bg-[#0f0f0f]/95 border
                        border-white/10 rounded-xl p-4 shadow-[0_15px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">

                    <div class="flex flex-col gap-3">
                      <p class="text-[10px] text-zinc-500 uppercase font-black border-b border-white/5 pb-1">
                        Salvar em:
                      </p>

                      <div class="flex flex-col gap-2 max-h-32 overflow-y-auto pr-1">
                        <label v-for="(lista, index) in userListas" :key="lista.id"
                          class="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" :checked="lista.movie_exists" 
                            class="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#00FCFF]">
                          <span class="text-zinc-300 text-[11px] truncate">{{ lista.titulo }}</span>
                        </label>
                      </div>

                      <button @click="activeList = false"
                        class="w-full bg-white/10 hover:bg-[#00FCFF] text-white hover:text-black text-[9px] font-black py-2 rounded-md transition-all">
                        Concluir
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
              <div v-if="isMovieWatched" class="flex flex-col items-center gap-2">
                <button 
                  class="relative w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-500 group"
                  :class="isMovieWatched?.attached
                    ? 'bg-[#00FCFF] border-[#00FCFF] shadow-[0_0_15px_rgba(0,252,255,0.4)]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'">
                  <IconCheck class="w-6 h-6 transition-all duration-300" :class="isMovieWatched?.attached
                    ? 'text-black scale-110'
                    : 'text-zinc-100 opacity-60 group-hover:opacity-100'" />
                </button>

                <span class="text-[10px] lg:text-xs text-center max-w-[80px] transition-colors duration-300"
                  :class="isMovieWatched?.attached ? 'text-[#00FCFF] font-bold' : 'text-zinc-100 opacity-80'">
                  {{ isMovieWatched?.attached ? 'Assistido' : 'Marcar visto' }}
                </span>
              </div>
            </div>
          </div>
          <div class="mt-8 block lg:hidden">
            <p class="text-zinc-400 leading-relaxed">
              movie.descricao_en
            </p>
          </div>

        </div>
        <div class="lg:max-w-5xl mx-auto px-4">
          <div class="flex gap-6 border-b border-white/10">
            <button @click="abaAtiva = 'generos'"
              :class="abaAtiva === 'generos' ? 'text-[#00FCFF] border-b-2 border-[#00FCFF]' : 'text-zinc-500'"
              class="pb-2 mt-8 font-black text-lg uppercase transition-all cursor-pointer outline-none">
              Gêneros
            </button>

            <button @click="abaAtiva = 'detalhes'"
              :class="abaAtiva === 'detalhes' ? 'text-[#00FCFF] border-b-2 border-[#00FCFF]' : 'text-zinc-500'"
              class="pb-2 mt-8 font-black text-lg uppercase transition-all cursor-pointer outline-none">
              Detalhes
            </button>
          </div>

          <div class="mt-4">
            <div v-if="abaAtiva === 'generos'" class="flex flex-wrap gap-2">
              <span v-for="(genero, index) in movie.generos" :key="index"
                class="bg-white/10 border border-white/20 rounded-lg py-1 px-2 ring-1 ring-[#00FCFF]/50 hover:bg-[#00FCFF]/10 cursor-pointer transition-all h-fit"">
                <p class=" text-white text-[10px] uppercase tracking-wider font-bold text-center"> {{ genero.nome_pt }}
                </p>
              </span>
            </div>

            <div v-if="abaAtiva === 'detalhes'" class="text-zinc-400 text-sm space-y-2">
              <p><span class="text-zinc-100 font-bold">Título Original:</span> {{ movie.titulo_original }}</p>
              <p><span class="text-zinc-100 font-bold">Idioma:</span> {{ new Intl.DisplayNames(['pt-BR'], {
                type:
                  'language'
              }).of(movie.lingua_origem) }}</p>
              <p><span class="text-zinc-100 font-bold">Produtoras:</span> {{movie.estudios?.map(estudio =>
                estudio.nome).join(', ') || 'Estudio desconhecido'}}</p>
              <p><span class="text-zinc-100 font-bold">Nota IMDb</span> {{ movie.rating }}</p>
            </div>
            <p class="mt-5 text-zinc-100 font-bold"><a class="underline"
                :href="`https://www.imdb.com/title/${movie.imdb_id}/`" target="_blank" rel="noopener noreferrer">Mais em
                IMDb</a></p>
          </div>
        </div>
        <div v-if="collection && collection.length" class="lg:max-w-5xl mx-auto">
          <h1 class="max-w-13/14 mx-auto mt-8 text-zinc-100 font-black text-lg uppercase drop-shadow-md">
            Coleção
          </h1>

          <div class="flex overflow-x-auto snap-x snap-mandatory gap-3 mt-3 px-4 pb-4 
           lg:grid lg:grid-cols-6 lg:gap-5 lg:px-2 lg:overflow-visible lg:pb-0">
            <div v-for="m in collection" :key="m.id"
              class="movie-card flex flex-col items-center min-w-[120px] sm:min-w-[150px] lg:min-w-0 snap-start">
              <RouterLink :to="{
                name: 'MovieView',
                params: {
                  slug: getMovieParam(m)
                }
              }" class="w-full">
                <MoviePoster v-if="m.poster_thumb_br" :path="getImageUrl(m.poster_thumb_br)"
                  class="w-full h-auto ring-1 sm:ring-2 ring-[#7075AB] rounded-sm mb-1 shadow-md transition-all hover:ring-[#00FCFF] hover:scale-105" />
              </RouterLink>

              <div class="w-full flex flex-col">
                <p class="text-center text-[10px] sm:text-xs font-bold text-zinc-100 truncate leading-tight">
                  {{ m.titulo_br || m.titulo_original }}
                </p>

                <div class="flex items-center justify-between mt-1 px-0.5">
                  <IconAddReview class="w-4 h-4 text-[#97A7CB] hover:text-[#00FCFF]" />
                  <span class="text-[8px] sm:text-[10px] font-black text-zinc-400">
                    {{ movie.rating || "" }}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="lg:max-w-5xl mx-auto">
          <h1 class="max-w-13/14 mx-auto mt-8 text-zinc-100 font-black text-lg uppercase drop-shadow-md">
            Filmes com a mesma pegada
          </h1>

          <div class="flex overflow-x-auto snap-x snap-mandatory gap-4 mt-3 px-4 pt-5 pb-4 custom-scrollbar">

            <div v-for="movieRel in moviesRelacionados" :key="movieRel.id"
              class="movie-card flex flex-col items-center w-[130px] sm:w-[150px] lg:w-[160px] flex-shrink-0 snap-start">

              <RouterLink :to="{
                name: 'MovieView',
                params: {
               
                  slug: getMovieParam(movieRel)
                }
              }" class="w-full">
                <MoviePoster v-if="movieRel.poster_thumb_br" :path="getImageUrl(movieRel.poster_thumb_br)"
                  class="w-full aspect-[2/3] object-cover ring-1 sm:ring-2 ring-[#7075AB] rounded-sm mb-2 shadow-md transition-all hover:ring-[#00FCFF] hover:scale-105" />
              </RouterLink>

              <div class="w-full flex flex-col">
                <p class="text-center text-[10px] sm:text-xs font-bold text-zinc-100 truncate leading-tight">
                  {{ movieRel.titulo_br || movieRel.titulo_original }}
                </p>

                <div class="flex items-center justify-center mt-1 gap-1 px-1">
                  <IconAddReview class="w-4 h-4 text-[#97A7CB] hover:text-[#00FCFF]" />
                  <span class="text-[8px] sm:text-[10px] font-black text-zinc-400">
                    IMDb {{ movieRel.rating }}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div v-if="listas" class="max-w-[95%] mx-auto mb-20 lg:max-w-5xl">
          <h1 class="mt-8 mb-6 text-zinc-100 font-black text-lg uppercase drop-shadow-md border-b border-white/10 pb-2">
            Listas Relacionadas
          </h1>

          <!-- Container com Scroll Horizontal -->
          <div class="flex overflow-x-auto snap-x snap-mandatory gap-4 mt-3 px-4 pb-4 custom-scrollbar">
            <div v-for="lista in listas" :key="lista.id" class="snap-start min-w-[280px] sm:min-w-[320px]">
              <RouterLink :to="{
                name: 'ListView',
                params: { id: lista.id, slug: lista.slug }
              }" class="w-full">
                <div class="group cursor-pointer">
                  <p
                    class="text-white text-[10px] lg:text-xs uppercase tracking-widest font-bold text-center mb-4 group-hover:text-[#00FCFF] transition-colors">
                    {{ lista.titulo }}
                  </p>

                  <div class="flex items-center justify-center pl-6">
                    <template v-for="(style, index) in movieStyles" :key="index">
                      <div v-if="lista.movies[index]" class="relative w-24 sm:w-28 transition-transform"
                        :class="[style.zIndex, style.ml, style.opacity, style.hover]">
                        <MoviePoster v-if="lista.movies[index].poster_thumb_br"
                          :path="getImageUrl(lista.movies[index].poster_thumb_br)" class="w-full h-auto rounded-sm"
                          :class="[style.ring, index === 0 ? 'shadow-xl' : 'shadow-lg']" />
                      </div>
                    </template>
                  </div>

                  <p class="text-zinc-500 text-[9px] text-center mt-6 uppercase">
                    {{ lista.movies.length }} filmes nesta lista
                  </p>
                </div>
              </RouterLink>
            </div>
          </div>
        </div>




        <div class="lg:max-w-5xl max-w-[95%] mx-auto mb-20">
          <h1 class="mt-8 mb-6 text-zinc-100 font-black text-lg uppercase drop-shadow-md border-b border-white/10 pb-2">
            Reviews Populares
          </h1>

          <div class="flex flex-col gap-8">
            <div v-for="(review, index) in reviews" :key="review.id" class="flex gap-4 items-start group">

              <div class="shrink-0">
                <div
                  class="w-12 h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden border-2 border-zinc-700 group-hover:border-[#00FCFF] transition-colors">
                  <img class="w-full h-full object-cover" src="/image.png" />
                </div>
              </div>

              <div class="flex-1 flex flex-col gap-1">
                <div class="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-3">
                  <p class="text-zinc-100 text-md font-light">
                    Review de <span class="font-extrabold text-[#00FCFF]">{{ review.user.name }}</span>
                  </p>

                  <div class="flex">
                    <IconStar v-for="i in 5" :key="i" :class="i <= review.rating ? 'text-[#00FCFF]' : 'text-zinc-700'"
                      class="w-3 h-3 lg:w-4 lg:h-4" />
                  </div>
                </div>

                <div class="mt-1">
                  <p class="text-zinc-400 text-sm lg:text-base leading-relaxed">
                    {{ review.comentario }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-1.5">
                <div 
                  class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition-all"
                  :class="review.is_liked
                    ? 'bg-[#ff0077]/20 border-[#ff0077]/40 text-[#ff0077]'
                    : 'bg-white/5 border-white/10 text-zinc-500'">
                  <IconLike class='hover:text-red-500 w-4 h-4 sm:w-5 sm:h-5' />
                </div>

                <div class="flex flex-col leading-none">
                  <span class="text-zinc-100 text-[11px] sm:text-xs font-black">
                    {{ review.likes_count || 0 }}
                  </span>
                  <span class="text-zinc-500 text-[8px] sm:text-[9px] uppercase tracking-widest">
                    Likes
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="reviews && 5 < reviews.length" class="mt-10 flex justify-center">
            <button @click="mostrarMais"
              class="text-zinc-400 hover:text-[#00FCFF] text-sm font-bold uppercase tracking-widest transition-all border-b border-zinc-800 hover:border-[#00FCFF] pb-1">
              Mostrar mais reviews
            </button>
          </div>
        </div>

      </div>
      <div v-else class="text-white">
        Filme não encontrado.
      </div>
    </div>
  </div>
  <TheFooter />
</template>

<style scoped>
/* Esconde a barra de scroll no mobile para ficar mais limpo */
@media (max-width: 1024px) {
  .flex {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
  }

  .flex::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari and Opera */
  }
}

/* Estilização para Chrome, Edge e Safari */
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
  /* Altura da barra horizontal */
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  /* Fundo da trilha quase invisível */
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  /* Cor da barra em si (bem discreta) */
  border-radius: 10px;
  transition: background 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 252, 255, 0.4);
  /* Ganha destaque (e sua cor tema) no hover */
}

/* Suporte para Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) rgba(255, 255, 255, 0.02);
}
</style>