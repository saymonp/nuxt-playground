
interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  roles: string[];
  permissions: string[];
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useCookie<User | null>('user') || null,
    token: useCookie('token').value || null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setUser(userData: User, tokenData: string) {
      const userCookie = useCookie<User | null>('user')
      const tokenCookie = useCookie('token')

      // É só atribuir direto! O Nuxt transforma o objeto User em texto no navegador sozinho
      userCookie.value = userData
      tokenCookie.value = tokenData

      this.user = userData
      this.token = tokenData
    },
    async fetchUser() {
      const { $api } = useNuxtApp()
      if (!this.token) return;
      try {
        const response = await $api<any>('/me'); // Rota no Laravel que retorna Auth::user()
        this.user = response;
      } catch (error) {
        this.logout(); // Se o token for inválido/expirado, limpa tudo
      }
    },
    async login(credentials: any) {
      const { $api } = useNuxtApp()
      const response = await $api<LoginResponse>('/login', { body: credentials, method: 'POST' });
      this.setUser(response.user, response.access_token);
    },
    async register(credentials: any) {
      const { $api } = useNuxtApp()
      const response = await $api<LoginResponse>('/register',{ body: credentials, method: 'POST' });
      this.setUser(response.user, response.access_token);
    },
    logout() {
      this.token = null;
      this.user = null;
      const userCookie = useCookie('user')
      const tokenCookie = useCookie('token')
      userCookie.value = null
      tokenCookie.value = null
    },
    async deleteAccount() {
      const { $api } = useNuxtApp()
      const response = await $api<any>('/me/delete', { method: 'DELETE' });
      if (response.status === 200) {
        this.token = null;
        this.user = null;
        const userCookie = useCookie('user')
        const tokenCookie = useCookie('token')
        userCookie.value = null
        tokenCookie.value = null
      }
      return response.data;
    },
    async solicitarRecuperacao(data: { email: string }) {
      const { $api } = useNuxtApp()
      const response = await $api<any>('/recover-password-request', { body: data, method: 'POST' });

      return response.data;
    },
    async redefinirSenha(data: { email: string, token: string, new_password: string }) {
      const { $api } = useNuxtApp()
      const response = await $api<any>('/reset-password', { body: data, method: 'POST' });
      this.setUser(response.data.user, response.data.access_token);
    },
  }
});