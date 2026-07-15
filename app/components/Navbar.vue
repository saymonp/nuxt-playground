<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import IconList from '@/components/icons/IconList.vue'
import IconAdd from '@/components/icons/IconAdd.vue'
import IconProfile from './icons/IconProfile.vue';
import IconNavHam from './icons/IconNavHam.vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { onClickOutside } from '@vueuse/core'
import InconVertigoFooter from'@/components/icons/InconVertigoFooter.vue';

const route = useRoute();
const authStore = useAuthStore();
const { isAuthenticated, user } = storeToRefs(authStore);
const isLoginVisible = ref(false);
//const isCriarConta = ref(false);
const menuAberto = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const target = ref(null);

const isCriarConta = defineModel<boolean>('isCriarConta', { default: false });

// Dados dos formulários
const loginData = reactive({
    email: '',
    password: ''
});

const registerData = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    aceitou_termos: false,
    termos_versao: 1.0
});

const toggleMenu = (event: Event) => {
    event.preventDefault();
    menuAberto.value = !menuAberto.value;
};

// Ação de Login
const handleLogin = async () => {
    try {
        isLoading.value = true;
        errorMessage.value = '';

        // No Laravel/Sanctum, enviamos as credenciais
        await authStore.login({
            email: loginData.email,
            password: loginData.password
        });

        isLoginVisible.value = false;
        // Limpar campos
        loginData.email = '';
        loginData.password = '';
    } catch (error: any) {
    } finally {
        isLoading.value = false;
    }
};

// Ação de Cadastro
const handleRegister = async () => {
    try {
        isLoading.value = true;
        errorMessage.value = '';

        // Chamada direta para o axios ou via action no store
        await authStore.register({
            name: registerData.name,
            email: registerData.email,
            password: registerData.password,
            password_confirmation: registerData.password,
            aceitou_termos: registerData.aceitou_termos,
            termos_versao: registerData.termos_versao
        });

        isCriarConta.value = false;
    } catch (error: any) {

    } finally {
        isLoading.value = false;
    }
};

const logout = () => {
    authStore.logout();
    menuAberto.value = false;
};

// Login Social
const loginGoogle = () => {
    const baseUrl = import.meta.env.VITE_GOOGLE_AUTH_URL;

    const params = new URLSearchParams({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
        response_type: 'code', // Indica que o backend vai receber um Authorization Code
        scope: 'openid email profile', // Dados mínimos (LGPD ok)
        access_type: 'offline', // Opcional: se precisar de refresh_token
        prompt: 'select_account' // Força o Google a mostrar a tela de escolher conta
    });
    // Redireciona para: https://accounts.google.com/o/oauth2/v2/auth?client_id=...
    window.location.href = `${baseUrl}?${params.toString()}`;
};
onClickOutside(target, () => {
    isCriarConta.value = false;
    //isLoginVisible.value = false;
    menuAberto.value = false;
});
</script>
<template>

    <div v-show="isLoginVisible" ref="target" class="fixed z-50 bg-black/5 backdrop-blur-xl border border-white/20 rounded-xl p-8 
         top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
         shadow-[0_0_50px_rgba(0,0,0,0.5)] w-[90%] max-w-[400px]">
        <div class="flex flex-col items-center gap-4">
            <h2 class="text-zinc-100 font-black text-2xl uppercase tracking-tighter">Entrar</h2>
            <p class="text-white text-center text-sm">
                Acesse sua conta no Filmeiro para salvar suas listas.
            </p>

            <input v-model="loginData.email" type="email" placeholder="E-mail"
                class="w-full bg-white/15 border border-white/10 p-2 rounded text-white outline-none focus:border-[#00FCFF]">

            <input v-model="loginData.password" type="password" placeholder="Senha" @keyup.enter="handleLogin"
                class="w-full bg-white/15 border border-white/10 p-2 rounded text-white outline-none focus:border-[#00FCFF]">

            <p v-if="errorMessage" class="text-red-400 text-xs">{{ errorMessage }}</p>

            <button @click="handleLogin" :disabled="isLoading"
                class="w-full bg-white/5 border border-white/20 text-white rounded-lg py-2 px-4 ring-1 ring-[#00FCFF]/50 hover:bg-[#00FCFF]/10 cursor-pointer transition-all disabled:opacity-50">
                {{ isLoading ? 'Entrando...' : 'Entrar' }}
            </button>

            <!-- Botão Google -->
            <button @click="loginGoogle" class="mt-2 text-xs text-zinc-300 hover:text-white flex items-center gap-2">
                Ou entrar com Google
            </button>
            <button @click="$router.push('/recuperar-senha')" class="mt-2 text-xs text-zinc-300 hover:text-white flex items-center gap-2">
                Esqueceu a senha?
            </button>
            <button @click="isLoginVisible = false"
                class="cursor-pointer mt-4 text-xs text-zinc-400 hover:text-white transition-colors">
                FECHAR
            </button>
        </div>
    </div>

    <div v-if="isLoginVisible" @click="isLoginVisible = false" class="fixed inset-0 bg-black/10 backdrop-blur-xs z-40">
    </div>

    <div v-show="isCriarConta" ref="target" class="fixed z-50 bg-black/5 backdrop-blur-xl border border-white/20 rounded-xl p-8 
         top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
         shadow-[0_0_50px_rgba(0,0,0,0.5)] w-[90%] max-w-[400px]">
        <div class="flex flex-col items-center gap-4">
            <h2 class="text-zinc-100 font-black text-2xl uppercase tracking-tighter">Criar Conta</h2>
            <p class="text-white text-center text-sm">
                Crie sua conta no Filmeiro para salvar suas listas.
            </p>

            <input v-model="registerData.name" type="text" placeholder="Nome de Usuário"
                class="w-full bg-white/15 border border-white/10 p-2 rounded text-white outline-none focus:border-[#00FCFF]">

            <input v-model="registerData.email" type="email" placeholder="E-mail"
                class="w-full bg-white/15 border border-white/10 p-2 rounded text-white outline-none focus:border-[#00FCFF]">
            <input v-model="registerData.password" type="password" placeholder="Senha"
                class="w-full bg-white/15 border border-white/10 p-2 rounded text-white outline-none focus:border-[#00FCFF]">
            <div class="flex flex-col gap-4 mt-4">
                <label class="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" v-model="registerData.aceitou_termos" required
                        class="mt-1 accent-[#00FCFF] rounded border-zinc-700 bg-zinc-800 text-black focus:ring-[#00FCFF]" />
                    <span class="text-xs text-zinc-300 leading-tight">
                        Li e estou de acordo com os
                        <a href="/termos" target="_blank" class="text-[#00FCFF] hover:underline font-bold">Termos de
                            Uso</a>
                        e com a
                        <a href="/privacidade" target="_blank" class="text-[#00FCFF] hover:underline font-bold">Política
                            de Privacidade</a>. *
                    </span>
                </label>
            </div>
            <button @click="handleRegister" :disabled="isLoading"
                class="w-full bg-white/5 border border-white/20 text-white rounded-lg py-2 px-4 ring-1 ring-[#00FCFF]/50 hover:bg-[#00FCFF]/10 cursor-pointer transition-all">
                {{ isLoading ? 'Criando...' : 'Criar Conta' }}
            </button>
            <!-- Botão Google -->
            <button @click="loginGoogle" class="mt-2 text-xs text-zinc-300 hover:text-white flex items-center gap-2">
                Ou entrar com Google
            </button>
            <button @click="isCriarConta = false"
                class="cursor-pointer mt-4 text-xs text-zinc-400 hover:text-white transition-colors">
                FECHAR
            </button>
        </div>
    </div>

    <div v-if="isCriarConta" @click="isCriarConta = false" class="fixed inset-0 bg-black/10 backdrop-blur-xs z-40">
    </div>

    <header class="absolute w-full left-0 right-0 mx-auto z-11 flex flex-wrap items-center justify-between max-w-7xl">
        <a href="/" class="text-white no-underline text-2xl font-bold transition-all"
            :class="route.path === '/' ? 'invisible md:visible' : 'visible'">
            <InconVertigoFooter class="w-30 text-zinc-100" />
        </a>
        <nav>
            <ul class="flex list-none p-0 m-0">
                <li v-if="!isAuthenticated"><a
                        class="block cursor-pointer p-2.5 text-white no-underline ml-2.5 hover:text-teal-400">
                        <a class="font-bold text-zinc-100" @click="isLoginVisible = !isLoginVisible"
                            :isLoginVisible="isLoginVisible">Entrar</a>
                    </a>
                </li>
                <li v-if="!isAuthenticated">
                    <a class="block cursor-pointer p-2.5 text-white no-underline ml-2.5 hover:text-teal-400"
                        @click="isCriarConta = !isCriarConta" :isCriarConta="isCriarConta">
                        <p class="font-bold text-zinc-100">Criar Conta</p>
                    </a>
                </li>
                <li v-if="isAuthenticated"><a href="/perfil"
                        class="cursor-pointer block p-2.5 text-white no-underline ml-2.5 hover:text-teal-400">
                        <IconProfile class="w-7 text-zinc-100" />
                    </a>
                </li>
                <li v-if="isAuthenticated" class="relative">
                    <button @click="toggleMenu"
                        class="cursor-pointer block p-2.5 text-white no-underline ml-2.5 hover:text-[#00FCFF] transition-colors focus:outline-none">
                        <IconNavHam class="rotate-90 w-7 text-zinc-100" />
                    </button>

                    <Transition enter-active-class="transition duration-100 ease-out"
                        enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-75 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0">
                        <div v-if="menuAberto" ref="target"
                            class="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl py-2 z-[200]">

                            <RouterLink to="/perfil"
                                class="block px-4 py-2 text-sm text-zinc-300 hover:bg-[#00FCFF]/10 hover:text-[#00FCFF] transition-colors"
                                @click="menuAberto = false">
                                Minhas Listas
                            </RouterLink>

                            <div class="h-[1px] bg-white/5 my-1"></div>

                            <button @click="logout"
                                class="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                                Sair
                            </button>
                <li v-if="user?.roles.includes('admin')">
                    <RouterLink to="/administrador"
                        class="block cursor-pointer p-2.5 text-white no-underline ml-2.5 hover:text-teal-400">
                        <a class="font-bold text-zinc-100" :isLoginVisible="isLoginVisible">Administrador</a>
                    </RouterLink>
                </li>
                </div>
                </Transition>
                </li>
            </ul>
        </nav>
    </header>


</template>