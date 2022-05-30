
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js').then((serviceWorkerRegistration) => {
    },
    (err) => console.log('failed to register', err))
}
