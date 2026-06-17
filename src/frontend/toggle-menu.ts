export function toggleMenu() {
  const toggleBtn = document.querySelector(".menu-toggle") as HTMLButtonElement;
  const mobileMenu = document.querySelector(".mobile-menu") as HTMLElement;

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");

    // Atualiza o ícone do botão
    const isOpen = mobileMenu.classList.contains("open");
    toggleBtn.textContent = isOpen ? "✕" : "☰";
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  // Fecha o menu ao clicar fora dele
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (!toggleBtn.contains(target) && !mobileMenu.contains(target)) {
      mobileMenu.classList.remove("open");
      toggleBtn.textContent = "☰";
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });
}
