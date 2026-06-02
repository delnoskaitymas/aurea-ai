function goTo(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", event => {
  if (event.target.classList.contains("choice")) {
    event.target.classList.toggle("active");
  }
});

function startAnalysis() {
  goTo("loading");

  const statuses = [
    "Skaitomi pasirinkti analizės moduliai...",
    "Vertinami meilės, finansų ir karjeros signalai...",
    "Sujungiami delnų, veido, balso, testo ir gimimo datos duomenys...",
    "Formuojamas tavo gyvenimo archetipas...",
    "Premium analizė paruošta."
  ];

  let index = 0;
  const status = document.getElementById("status");

  const interval = setInterval(() => {
    status.textContent = statuses[index];
    index++;

    if (index >= statuses.length) {
      clearInterval(interval);

      setTimeout(() => {
        goTo("teaser");
      }, 900);
    }
  }, 900);
}

function showResults() {
  const partner = document.getElementById("partnerName").value.trim();
  const text = partner
    ? `${partner} suderinamumo potencialas: 89%. Stipriausia vieta — emocinė trauka, smalsumas ir noras augti kartu.`
    : "Suderinamumo potencialas: 89%. Stipriausia vieta — emocinė trauka ir bendras augimo noras.";

  document.getElementById("compatibility").textContent = text;
  goTo("results");
}
