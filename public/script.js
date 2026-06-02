function goTo(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

async function startStripeCheckout(plan) {
  const errorBox = document.getElementById("payError");
  if (errorBox) errorBox.textContent = "";

  try {
    const res = await fetch("/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ plan })
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      if (errorBox) {
        errorBox.textContent = data.error || "Nepavyko sukurti Stripe mokėjimo.";
      } else {
        alert(data.error || "Nepavyko sukurti Stripe mokėjimo.");
      }
    }
  } catch (error) {
    if (errorBox) {
      errorBox.textContent = "Stripe klaida. Patikrink Railway Variables.";
    } else {
      alert("Stripe klaida. Patikrink Railway Variables.");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("success") === "true") {
    goTo("results");
  }

  const startBtn = document.getElementById("startBtn");
  if (startBtn) startBtn.onclick = () => goTo("goal");

  const toModules = document.getElementById("toModules");
  if (toModules) toModules.onclick = () => goTo("modules");

  const toData = document.getElementById("toData");
  if (toData) toData.onclick = () => goTo("data");

  const toPayment = document.getElementById("toPayment");
  if (toPayment) toPayment.onclick = () => goTo("payment");

  const demoBtn = document.getElementById("demoBtn");
  if (demoBtn) demoBtn.onclick = () => showResults();

  const birthBtn = document.getElementById("birthBtn");
  if (birthBtn) {
    birthBtn.onclick = () => startStripeCheckout("birth");
  }

  const singleBtn = document.getElementById("singleBtn");
  if (singleBtn) {
    singleBtn.onclick = () => startStripeCheckout("single");
  }

  const compatibilityBtn = document.getElementById("compatibilityBtn");
  if (compatibilityBtn) {
    compatibilityBtn.onclick = () => startStripeCheckout("compatibility");
  }

  const premiumBtn = document.getElementById("premiumBtn");
  if (premiumBtn) {
    premiumBtn.onclick = () => startStripeCheckout("premium");
  }

  const monthlyBtn = document.getElementById("monthlyBtn");
  if (monthlyBtn) {
    monthlyBtn.onclick = () => startStripeCheckout("monthly");
  }

  document.querySelectorAll(".choice").forEach(button => {
    button.onclick = () => button.classList.toggle("active");
  });

  const analyzeBtn = document.getElementById("analyzeBtn");
  if (analyzeBtn) {
    analyzeBtn.onclick = () => {
      goTo("loading");

      setTimeout(() => {
        const status = document.getElementById("status");
        if (status) {
          status.textContent =
            "Sujungiami delnų, veido, balso, testo ir gimimo datos signalai...";
        }
      }, 900);

      setTimeout(() => {
        const status = document.getElementById("status");
        if (status) {
          status.textContent =
            "Formuojamas tavo gyvenimo profilis...";
        }
      }, 1800);

      setTimeout(() => {
        goTo("teaser");
      }, 3200);
    };
  }
});

function showResults() {
  const partnerInput = document.getElementById("partnerName");
  const compatibility = document.getElementById("compatibility");

  const partner = partnerInput ? partnerInput.value.trim() : "";

  if (partner && compatibility) {
    compatibility.textContent =
      `💞 ${partner}: suderinamumas 89%. Stipriausia vieta — trauka, emocinis smalsumas ir bendras augimo noras.`;
  }

  goTo("results");
}
