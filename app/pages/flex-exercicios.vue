<script setup lang="ts">
import InconVertigoFooter from '~/components/icons/InconVertigoFooter.vue';

const genres = ref<string[]>([])
const newGenre = ref<string>('')

const addGenre = () => {
    const value = newGenre.value.trim();

    // Evita tags vazias ou duplicadas
    if (value && !genres.value.includes(value)) {
        // Adiciona ao array de tags que será enviado ao backend
        genres.value.push(value);
        newGenre.value = ''; // Limpa o input
    }
}

</script>

<template>
    <div class="bg-zinc-200 min-h-screen">
        <!-- Nível 1 NavBar -->
        <div class="flex justify-between items-center p-4">
            <IconsInconVertigoFooter class="cursor-pointer w-25"></IconsInconVertigoFooter>
            <div class="flex space-x-8">
                <div class="text-lg text-slate-900 font-semibold cursor-pointer hover:text-blue-500 transition-colors">
                    Dashboard</div>
                <div class="text-lg text-slate-900 font-semibold cursor-pointer hover:text-blue-500 transition-colors">
                    Filmes</div>
                <div class="text-lg text-slate-900 font-semibold cursor-pointer hover:text-blue-500 transition-colors">
                    Gêneros</div>
            </div>
            <div class="flex space-x-8">
                <div class="text-lg text-slate-900 font-semibold cursor-pointer hover:text-blue-500 transition-colors">
                    User</div>
                <div class="text-lg text-slate-900 font-semibold cursor-pointer hover:text-red-900 transition-colors">
                    Sair</div>
            </div>
        </div>

        <main class="max-w-7xl mx-auto text-black">
            <!-- Nível 2 Card -->

            <h1 class="text-black font-extrabold">Exercícios de Flex Box</h1>
            <section class="mt-10 mb-10">
                <h3 class="text-xs font-bold tracking-wider text-slate-900 uppercase">Exercício Card</h3>

                <div class="bg-zinc-400/10 max-w-sm rounded overflow-hidden shadow-lg">
                    <div class="flex flex-col m-5 space-y-1 ">

                        <h3 class="text-xs font-bold tracking-wider text-slate-900 uppercase">Métrica:</h3>
                        <h3 class="text-lg text-slate-700 font-bold leading-tight">Total de Filmes no Acervo</h3>
                        <div class="flex items-center space-x-3 pt-1">
                            <p class="text-3xl font-extrabold text-slate-900 tracking-tight">2335</p>
                            <p
                                class="inline-flex items-center text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                                +12% este mês</p>
                        </div>
                        <p class="text-xs text-slate-500 leading-relaxed pt-2 border-t border-zinc-500">"Lorem ipsum
                            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut labore
                            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                            nisi
                            ut
                            aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
                            esse
                            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                            in
                            culpa qui officia deserunt mollit anim id est laborum."</p>
                    </div>
                </div>
            </section>

            <!-- Nível 3 Form -->
            <section class="mt-10 mb-10">
                <div class="border-t border-slate-400"></div>
                <h3 class="mt-5 text-xs font-bold tracking-wider text-slate-900 uppercase">Exercício Formulário com
                    Botões de Ação</h3>

                <h3 class="text-center mt-5 text-xs font-bold tracking-wider text-slate-900 uppercase">Cadastrar Filme
                </h3>
                <div class="mx-auto bg-zinc-400/10 max-w-sm rounded overflow-hidden shadow-lg">
                    <div class="flex flex-col m-5 space-y-1 ">

                        <h3 class="text-lg text-slate-700 font-bold leading-tight">Título</h3>
                        <input type="text" placeholder="Fuga Das Galinhas"
                            class="border border-slate-700-medium text-heading text-sm rounded-xl focus:border-slate-700 block w-full px-3 py-2 shadow-xs placeholder:text-body">

                        <h3 class="text-lg text-slate-700 font-bold leading-tight">Nota IMDb</h3>
                        <input type="number" min="0" max="10" placeholder="7,5"
                            class="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-slate-700-medium text-heading text-sm rounded-xl focus:border-slate-700 block w-full px-3 py-2 shadow-xs placeholder:text-body">

                        <h3 class="text-lg text-slate-700 font-bold leading-tight">Gênero</h3>
                        <input v-model="newGenre" @keyup.enter.prevent="addGenre" type="text" enterkeyhint="done"
                            placeholder="Drama"
                            class="border border-slate-700-medium text-heading text-sm rounded-xl focus:border-slate-700 block w-full px-3 py-2 shadow-xs placeholder:text-body">

                        <div class="flex gap-2">
                            <span v-for="(g, index) in genres" :key="index">
                                {{ g }}
                            </span>
                        </div>

                        <h3 class="text-lg text-slate-700 font-bold leading-tight">Descrição</h3>
                        <textarea type="text" placeholder="Drama"
                            class="border border-slate-700-medium text-heading text-sm rounded-xl focus:border-slate-700 block w-full px-3 py-2 shadow-xs placeholder:text-body"></textarea>

                        <div class="flex space-x-2">
                            <button>Salvar</button>
                            <button>Cancelar</button>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    </div>
</template>