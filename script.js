const CA = "0xf0f8bb72275d842b332552733103e7e0a385b5ae";
const toast = document.querySelector("#toast");
let toastTimer;

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CA);
    } catch {
      const input = document.createElement("textarea");
      input.value = CA;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    const label = button.querySelector(".copy-label");
    if (label) {
      label.textContent = "COPIED ✓";
      setTimeout(() => (label.textContent = "COPY CA"), 1800);
    }

    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  });
});
