export function showToast(message) {
    const toast = document.getElementById('toast');
    const messageElement = document.getElementById('toast-message');

    if (!toast || !messageElement) return;

    // set text
    messageElement.textContent = message;

    // remove hidden state classes
    toast.classList.remove('translate-y-24', 'opacity-0');
    
    // hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-24', 'opacity-0');
    }, 3000);
}