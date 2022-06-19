/**
 * toggle between between light and dark mode
 */

function toggleMode() {
    let mode = localStorage.getItem('theme') !== null ? localStorage.getItem('theme') : 'light';
    mode = mode === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
}
