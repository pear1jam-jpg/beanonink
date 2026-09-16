const CA = "0xf0f8bb72275d842b332552733103e7e0a385b5ae";
const FEES_ENDPOINT = "https://api.goldsky.com/api/public/project_cmm7vh5xwsa8m01qmdr7w7u62/subgraphs/sentry-ink/1.6.0/gn";
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

const feesPaid = document.querySelector("#feesPaid");
const feesStatus = document.querySelector("#feesStatus");

function formatEth(value) {
  return `${value.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: value < 1 ? 4 : 2,
  })} ETH`;
}

function animateFees(target) {
  const startedAt = performance.now();
  const duration = 900;

  function frame(now) {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    feesPaid.textContent = formatEth(target * eased);
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

async function updateFees() {
  if (!feesPaid || !feesStatus) return;

  try {
    const response = await fetch(FEES_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{ token(id: "${CA.toLowerCase()}") { creatorFeesPaidWETH } }`,
      }),
    });

    if (!response.ok) throw new Error(`Fee source returned ${response.status}`);
    const payload = await response.json();
    const value = Number(payload?.data?.token?.creatorFeesPaidWETH);
    if (!Number.isFinite(value)) throw new Error("Fee value unavailable");

    animateFees(value);
    feesStatus.textContent = "paid to creator · live";
    feesStatus.title = `Last updated ${new Date().toLocaleTimeString()}`;
  } catch {
    feesPaid.textContent = "—";
    feesStatus.textContent = "on-chain sync unavailable";
  }
}

updateFees();
setInterval(updateFees, 60_000);
