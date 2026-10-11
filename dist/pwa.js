(() => {
  if (!('serviceWorker' in navigator)) return;
  let installPrompt;
  const button = document.getElementById('installApp');
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    if (button) button.hidden = false;
  });
  button?.addEventListener('click', async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    button.hidden = true;
  });
  window.addEventListener('appinstalled', () => {
    if (button) button.hidden = true;
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(error => console.warn('Installation hors ligne indisponible :', error));
  });
})();
