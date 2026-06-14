const toggleBtn = document.querySelector('.menu-toggle') as HTMLButtonElement;
const sidebar = document.querySelector('.sidebar') as HTMLElement;

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('expanded');
});