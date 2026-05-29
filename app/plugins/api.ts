export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase,

    credentials: 'include',

    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },

    onRequest({ options }) {
      const token = useCookie('token').value

      if (token) {
        options.headers.set('Authorization', `Bearer ${token}`)
      }
    },

    onResponseError({ response }) {
      if (response.status === 401) {
        console.log('Não autenticado')
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})