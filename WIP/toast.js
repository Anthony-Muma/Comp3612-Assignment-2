export function showToast(message) {
    const toast = document.querySelector('#toast');
    const messageElement = document.querySelector('#toast-message');

    if (!toast || !messageElement) return;

    // Set text
    messageElement.textContent = message;

    // Remove hidden state classes
    toast.classList.remove('translate-y-24', 'opacity-0');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-24', 'opacity-0');
    }, 3000);
}