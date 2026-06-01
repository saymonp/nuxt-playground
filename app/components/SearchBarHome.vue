<script setup lang="ts">
import { ref } from 'vue';

import { onClickOutside } from '@vueuse/core'
import IconFilter from '@/components/icons/IconFilter.vue'

import type { GeneroResponse, DiretorResponse, MovieFilters } from '@/types/Movies';

const props = defineProps<{
    filterMovies: MovieFilters,
    generos: GeneroResponse[],
    diretores: DiretorResponse[],
    idiomas: string[],
    isSearching: boolean,
    filterValue: number
}>();

const emit = defineEmits<{
    (e: 'update:filterMovies', value: MovieFilters): void
    (e: 'search'): void
    (e: 'update:filterValue', value: number): void
}>()
const target = ref(null);
const showFilter = ref(false);
const searchMode = ref('movies');
onClickOutside(target, () => (showFilter.value = false));

// Helper para emitir mudanças
const updateFilter = (key: keyof MovieFilters, value: any) => {
    let finalValue = value;

    // Se o valor for a string "undefined" ou algo que resulte em NaN, transforme em undefined
    if (value === 'undefined' || (typeof value === 'string' && value.trim() === '')) {
        finalValue = undefined;
    } else if (key === 'diretores' || key === 'ano') {
        // Tenta converter para número, se falhar, fica undefined
        const parsed = Number(value);
        finalValue = isNaN(parsed) ? undefined : parsed;
    }
    emit('update:filterMovies', { ...props.filterMovies, [key]: finalValue, page: 1 });
};

const updateFilterValue = (value: string) => {
    // Conver para número antes de enviar para o pai
    emit('update:filterValue', Number(value));
};

const toggleGenero = (id: number) => {
    const newGeneros = [...(props.filterMovies.generos || [])];
    const index = newGeneros.indexOf(id);
    if (index > -1) newGeneros.splice(index, 1);
    else newGeneros.push(id);
    updateFilter('generos', newGeneros);
};

const toggleBooleanFilter = (tag: string) => {
    if (tag === 'Destaques') updateFilter('destaque', !props.filterMovies.destaque);
    if (tag === '2026') updateFilter('ano', props.filterMovies.ano === 2026 ? undefined : 2026);
    if (tag === 'Bilheterias') updateFilter('bilheteria', !props.filterMovies.bilheteria);
};

const isFilterActive = (tag: string): boolean => {
    if (tag === 'Destaques') return !!props.filterMovies.destaque;
    if (tag === '2026') return props.filterMovies.ano === 2026;
    if (tag === 'Bilheterias') return !!props.filterMovies.bilheteria;
    return false;
};

onClickOutside(target, () => (showFilter.value = false))

</script>

<template>
    <div ref="movieListSection" class="lg:max-w-3xl max-w-13/14 mx-auto">
        <div class="lg:max-w-3xl max-w-13/14 mx-auto">
            <div
                class="relative z-50 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 ring-1 ring-white/10 transition-all duration-500">
                <div class="grid grid-cols-1 sm:grid-cols-12 gap-6">

                    <div class="sm:col-span-4 flex flex-col gap-4">
                        <div class="flex items-center bg-white/5 border border-white/20 rounded-xl px-3 py-2 focus-within:ring-1 transition-all"
                            :class="[
                                isSearching ? 'opacity-50 cursor-not-allowed' : '',
                                searchMode === 'movies' ? 'focus-within:ring-[#00FCFF]' : 'focus-within:ring-[#ff0077]'
                            ]">

                            <input type="text" :value="filterMovies.search"
                                @input="e => updateFilter('search', (e.target as HTMLInputElement).value)"
                                :placeholder="searchMode === 'movies' ? 'Buscar filmes...' : 'Buscar listas por título...'"
                                class="flex-1 bg-transparent border-none outline-none text-zinc-100 text-xs font-bold min-w-0">

                            <div class="relative">
                                <button @click="showFilter = !showFilter"
                                    class="flex items-center gap-1 ml-2 px-2 py-1 rounded-md transition-all group"
                                    :class="searchMode === 'movies' ? 'bg-[#00FCFF]/10 text-[#00FCFF]' : 'bg-[#ff0077]/10 text-[#d919ff]'">
                                    <span class="text-[9px] font-black uppercase tracking-tighter">
                                        {{ searchMode === 'movies' ? 'Gêneros' : 'Tags' }}
                                    </span>
                                    <IconFilter class="w-3" />
                                </button>

                                <div ref="target" v-show="showFilter"
                                    class="absolute right-0 mt-3 z-50 bg-[#020036]/95 backdrop-blur-2xl border border-white/20 rounded-xl p-4 shadow-2xl w-[220px]">
                                    <p class="text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-2 mb-3"
                                        :class="searchMode === 'movies' ? 'text-[#00FCFF]' : 'text-[#d919ff]'">
                                        {{ searchMode === 'movies' ? 'Selecionar Gêneros' : 'Filtrar por Tags' }}
                                    </p>
                                    <div class="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        <label
                                            v-for="item in (searchMode === 'movies' ? generos : ['Favoritos', 'Maratona', 'Cyberpunk', 'Clássicos'])"
                                            :key="searchMode === 'movies' ? (item as any).id : (item as string)"
                                            class="flex items-center gap-3 cursor-pointer group">

                                            <div class="relative flex items-center">
                                                <input type="checkbox"
                                                    :value="searchMode === 'movies' ? (item as any).id : (item as string)"
                                                    :checked="searchMode === 'movies' ? filterMovies.generos?.includes((item as any).id) : false"
                                                    @change="searchMode === 'movies' ? toggleGenero((item as any).id) : null"
                                                    :class="searchMode === 'movies' ? 'checked:bg-[#00FCFF] checked:border-[#00FCFF]' : 'checked:bg-[#ff0077] checked:border-[#ff0077]'"
                                                    class="peer appearance-none w-4 h-4 border border-white/20 rounded transition-all">
                                                >

                                                <span
                                                    class="absolute text-black font-bold text-[10px] left-1 opacity-0 peer-checked:opacity-100">✓</span>
                                            </div>
                                            <span
                                                class="text-zinc-300 text-[11px] font-bold group-hover:text-white transition-colors">{{
                                                    searchMode === 'movies' ? (item as any).nome_pt : item
                                                }}</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="px-1">
                            <div class="flex justify-between items-center text-[9px] mb-1">
                                <span class="text-zinc-500 uppercase font-bold tracking-widest">
                                    {{ searchMode === 'movies' ? 'Nota Mínima' : 'Mínimo de Likes' }}
                                </span>
                                <span class="font-black px-2 py-0.5 rounded"
                                    :class="searchMode === 'movies' ? 'text-[#00FCFF] bg-[#00FCFF]/10' : 'text-[#d919ff] bg-[#ff0077]/10'">
                                    {{ props.filterValue }}
                                </span>
                            </div>
                            <input type="range" min="0" step="0.5" :value="filterValue"
                                @input="e => updateFilterValue((e.target as HTMLInputElement).value)"
                                :max="searchMode === 'movies' ? 10 : 1000"
                                class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                :class="searchMode === 'movies' ? 'accent-[#00FCFF]' : 'accent-[#d919ff]'">
                        </div>
                    </div>

                    <div class="sm:col-span-8 flex flex-col gap-4">

                        <div class="grid grid-cols-3 gap-3">
                            <div class="flex flex-col gap-1">
                                <label class="text-[9px] text-zinc-500 uppercase font-bold ml-1">Ano</label>
                                <select :value="filterMovies.ano" @change="e => {
                                    const val = (e.target as HTMLSelectElement).value;
                                    updateFilter('ano', val === 'undefined' ? undefined : Number(val));
                                }"
                                    class="bg-white/5 border border-white/10 p-2 rounded-lg text-[10px] text-white outline-none focus:border-[#00FCFF] cursor-pointer">
                                    <option class="bg-zinc-900" :value="undefined">Todos</option>
                                    <option class="bg-zinc-900">2026</option>
                                    <option class="bg-zinc-900">2025</option>
                                    <option class="bg-zinc-900">2024</option>
                                </select>
                            </div>

                            <template v-if="searchMode === 'movies'">
                                <div class="flex flex-col gap-1">
                                    <label class="text-[9px] text-zinc-500 uppercase font-bold ml-1">Diretor</label>
                                    <select :value="filterMovies.diretores"
                                        @change="e => updateFilter('diretores', Number((e.target as HTMLSelectElement).value))"
                                        class="bg-white/5 border border-white/10 p-2 rounded-lg text-[10px] text-white outline-none focus:border-[#00FCFF] cursor-pointer">
                                        <option class="bg-zinc-900" :value="undefined">Todos</option>
                                        <option v-for="diretor in diretores" :key="diretor.id" :value="diretor.id"
                                            class="bg-zinc-900">
                                            {{ diretor.nome }}
                                        </option>
                                    </select>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <label class="text-[9px] text-zinc-500 uppercase font-bold ml-1">Idioma de
                                        Origem</label>
                                    <select :value="filterMovies.idioma"
                                        @change="e => updateFilter('idioma', (e.target as HTMLSelectElement).value)"
                                        class="bg-white/5 border border-white/10 p-2 rounded-lg text-[10px] text-white outline-none focus:border-[#00FCFF] cursor-pointer">
                                        <option class="bg-zinc-900" value="">Todos</option>
                                        <option class="bg-zinc-900" v-for="idioma in props.idiomas" :key="idioma"
                                            :value="idioma">
                                            {{ new Intl.DisplayNames(['pt-BR'], {
                                                type: 'language'
                                            }).of(idioma) }}
                                        </option>
                                    </select>
                                </div>
                            </template>

                            <template v-else>
                                <div class="flex flex-col gap-1">
                                    <label class="text-[9px] text-zinc-500 uppercase font-bold ml-1">Ordenar
                                        por</label>
                                    <select
                                        class="bg-white/5 border border-white/10 p-2 rounded-lg text-[10px] text-white outline-none focus:border-[#ff0077] cursor-pointer">
                                        <option class="bg-zinc-900">Mais curtidas</option>
                                        <option class="bg-zinc-900">Recentes</option>
                                    </select>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <label class="text-[9px] text-zinc-500 uppercase font-bold ml-1">Privacidade</label>
                                    <select
                                        class="bg-white/5 border border-white/10 p-2 rounded-lg text-[10px] text-white outline-none focus:border-[#ff0077] cursor-pointer">
                                        <option class="bg-zinc-900">Públicas</option>
                                        <option class="bg-zinc-900">Minhas Listas</option>
                                    </select>
                                </div>
                            </template>
                        </div>

                        <div class="flex gap-2 mt-auto">
                            <button
                                v-for="tag in (searchMode === 'movies' ? ['Destaques', '2026', 'Bilheterias'] : ['Top Listas', 'Curadorias', 'Mais Ativas'])"
                                :key="tag" @click="toggleBooleanFilter(tag)"
                                class="flex-1 rounded-xl py-2.5 px-2 transition-all group hover:bg-white/10" :class="[
                                    // Cores base e hover
                                    searchMode === 'movies' ? 'hover:border-[#00FCFF]/50' : 'hover:border-[#ff0077]/50',

                                    // Estilo quando ATIVO
                                    isFilterActive(tag)
                                        ? (searchMode === 'movies' ? 'bg-[#00FCFF]/5 border border-[#00FCFF]' : 'bg-[#ff0077]/20 border-[#ff0077]')
                                        : 'bg-white/5 border border-white/10'
                                ]">
                                <p class="text-zinc-400 text-[10px] uppercase tracking-tighter font-black text-center group-hover:text-white"
                                    :class="[
                                        isFilterActive(tag)
                                            ? (searchMode === 'movies' ? 'text-[#00FCFF]' : 'text-[#ff0077]')
                                            : 'text-zinc-400 group-hover:text-white'
                                    ]">

                                    {{ tag }}
                                </p>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>