const state = {
  name: "",
  goals: [],
  methods: []
};

function goTo(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

function selected(selector, attr) {
  return [...document.querySelectorAll(selector + ".active")].map(x => x.dataset[attr]);
}

async function startStripeCheckout(plan) {
  const errorBox = document.getElementById("payError");
  if (errorBox) errorBox.textContent = "";

  try {
    const res = await fetch("/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan })
    });

    const data = await res.json();

    if (data.url) window.location.href = data.url;
    else errorBox.textContent = data.error || "Nepavyko sukurti Stripe mokėjimo.";
  } catch {
    errorBox.textContent = "Stripe klaida. Patikrink Railway Variables.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("success") === "true") {
    buildResults();
    goTo("results");
  }

  document.querySelectorAll(".choice").forEach(btn => {
    btn.onclick = () => btn.classList.toggle("active");
  });

  document.querySelectorAll(".method").forEach(btn => {
    btn.onclick = () => {
      btn.classList.toggle("active");
      if (btn.dataset.method === "full" && btn.classList.contains("active")) {
        document.querySelectorAll(".method").forEach(m => m.classList.add("active"));
      }
    };
  });

  document.getElementById("startBtn").onclick = () => {
    const name = document.getElementById("userName").value.trim();
    if (!name) {
      document.getElementById("userName").style.borderColor = "#ffb3b3";
      return;
    }
    state.name = name;
    goTo("goal");
  };

  document.getElementById("toModules").onclick = () => {
    state.goals = selected(".choice", "goal");
    if (!state.goals.length) {
      document.getElementById("goalError").textContent = "Pasirink bent vieną sritį.";
      return;
    }
    goTo("modules");
  };

  document.getElementById("toData").onclick = () => {
    state.methods = selected(".method", "method");
    if (!state.methods.length) {
      document.getElementById("methodError").textContent = "Pasirink bent vieną analizės metodą.";
      return;
    }
    goTo("data");
  };

  document.getElementById("analyzeBtn").onclick = () => {
    if (!validateData()) return;
    startScan();
  };

  document.getElementById("toPayment").onclick = () => goTo("payment");

  document.getElementById("birthBtn").onclick = () => startStripeCheckout("birth");
  document.getElementById("singleBtn").onclick = () => startStripeCheckout("single");
  document.getElementById("compatibilityBtn").onclick = () => startStripeCheckout("compatibility");
  document.getElementById("premiumBtn").onclick = () => startStripeCheckout("premium");
  document.getElementById("monthlyBtn").onclick = () => startStripeCheckout("monthly");
  document.getElementById("demoBtn").onclick = () => {
    buildResults();
    goTo("results");
  };
});

function validateData() {
  const methods = state.methods;
  const hasFull = methods.includes("full");

  const checks = [
    { key: "face", ok: document.getElementById("faceFile").files.length > 0, text: "Įkelk veido nuotrauką." },
    { key: "palm", ok: document.getElementById("palmFile").files.length > 0, text: "Įkelk delno nuotrauką." },
    { key: "voice", ok: document.getElementById("voiceFile").files.length > 0, text: "Įkelk balso įrašą." },
    { key: "birth", ok: !!document.getElementById("birthDate").value, text: "Įrašyk gimimo datą." },
    { key: "test", ok: document.getElementById("lifeText").value.trim().length > 10, text: "Atsakyk į asmenybės klausimą bent keliais žodžiais." }
  ];

  const needed = hasFull ? ["face", "palm", "birth", "test"] : methods;
  const missing = checks.find(c => needed.includes(c.key) && !c.ok);

  if (missing) {
    document.getElementById("dataError").textContent = missing.text;
    return false;
  }

  document.getElementById("dataError").textContent = "";
  return true;
}

function startScan() {
  goTo("loading");

  const list = document.getElementById("scanList");
  const bar = document.getElementById("progressBar");
  list.innerHTML = "";
  bar.style.width = "0%";

  const steps = [
    "Veidotyros duomenys paruošiami interpretacijai...",
    "Chiromantijos ženklai sujungiami su pasirinktomis sritimis...",
    "Numerologinis profilis apskaičiuojamas pagal gimimo datą...",
    "Psichologinis atsakymas įtraukiamas į AUREA profilį...",
    "Formuojama personalizuota analizė..."
  ];

  steps.forEach((step, i) => {
    setTimeout(() => {
      list.innerHTML += `<li>${step}</li>`;
      bar.style.width = `${(i + 1) * 20}%`;
      if (i === steps.length - 1) {
        setTimeout(() => {
          document.getElementById("teaserTitle").textContent =
            `${state.name.toUpperCase()} · AUREA profilis paruoštas 87%`;
          goTo("teaser");
        }, 700);
      }
    }, i * 850);
  });
}

function buildResults() {
  const name = state.name || document.getElementById("userName")?.value.trim() || "AUREA";
  const resultName = document.getElementById("resultName");
  resultName.textContent = `${name.toUpperCase()} · Asmeninis AUREA profilis`;

  const partner = document.getElementById("partnerName")?.value.trim() || "pasirinktas žmogus";

  const sections = [
    {
      title: "❤️ Meilė",
      cards: [
        ["Santykių tipas", "Emocinis artumas tampa svarbiu santykių pagrindu. Giliuose ryšiuose atsiskleidžia lojalumas, jautrumas ir noras kurti ilgalaikį saugumą."],
        ["Kas traukia", "Dažniausiai traukia žmonės, kurie atrodo stiprūs, bet turi vidinio jautrumo. Paviršutiniškas bendravimas greitai praranda vertę."],
        ["Iššūkis", "Kai nėra aiškumo, gali atsirasti atsitraukimas ir vidinis užsidarymas. Ši kryptis verta dėmesio, nes gali kartotis santykių modeliuose."]
      ]
    },
    {
      title: "💰 Finansai",
      cards: [
        ["Pinigų modelis", "Didžiausias potencialas atsiskleidžia kuriant ilgalaikę vertę, o ne vaikantis greitų rezultatų. Finansinis augimas stiprėja per savarankiškumą ir aiškią kryptį."],
        ["Geriausios kryptys", "Tinka sritys, kuriose susijungia komunikacija, estetika, intuicija ir strategija. Ypač stiprus potencialas matomas asmeninio prekės ženklo, konsultavimo ir skaitmeninių produktų srityse."],
        ["Rizika", "Per ilgas laukimas tobulo momento gali stabdyti pajamas. Veikimas mažais, bet nuosekliais žingsniais duotų daugiau nei nuolatinis pasiruošimas."]
      ]
    },
    {
      title: "🚀 Karjera",
      cards: [
        ["Darbo stilius", "Geriausiai sekasi ten, kur yra laisvės, kūrybos ir galimybė matyti platesnį vaizdą. Griežta rutina gali slopinti potencialą."],
        ["Lyderystė", "Įtaka stiprėja tada, kai nereikia apsimetinėti kitu žmogumi. Natūrali charizma atsiranda per nuoširdumą, aiškią viziją ir gebėjimą įkvėpti."],
        ["Kryptis", "Karjeros kelias turėtų jungti žinias, grožį, analizę ir žmonių transformaciją. Tokiose srityse profilis atrodo stipriausias."]
      ]
    },
    {
      title: "⭐ Gyvenimo misija",
      cards: [
        ["Vidinė kryptis", "Misijos tema siejasi su vertės kūrimu kitiems per įžvalgą, estetiką ir emocinį supratimą. Svarbu ne tik rezultatas, bet ir prasmės jausmas."],
        ["Augimo zona", "Didžiausias augimas prasideda tada, kai leidžiama sau būti matomai. Vidinis potencialas stiprėja per drąsą išreikšti tai, kas jau seniai brandinama."],
        ["AUREA įžvalga", "Šis profilis rodo žmogų, kuris gali sujungti intuiciją ir strategiją. Tokia kombinacija tampa labai stipri, kai naudojama kryptingai."]
      ]
    },
    {
      title: "🧠 Charakteris",
      cards: [
        ["Archetipas", "Auksinis Vizionierius. Šis archetipas siejamas su intuicija, kūryba, subtiliu stebėjimu ir noru kurti aukštesnės vertės gyvenimą."],
        ["Stiprybės", "Stipriausios savybės: jautrumas detalėms, gebėjimas matyti giliau, estetikos pojūtis ir vidinis užsispyrimas."],
        ["Šešėlis", "Kartais per didelis analizavimas gali tapti stabdžiu. Kai sprendimas ilgai atidėliojamas, energija pradeda sklaidytis."]
      ]
    },
    {
      title: "💞 Suderinamumas",
      cards: [
        ["Ryšio potencialas", `Suderinamumas su ${partner} rodo stiprų emocinio smalsumo potencialą. Svarbiausia tampa ne tik trauka, bet ir gebėjimas kalbėtis apie ateitį.`],
        ["Stiprioji vieta", "Ryšys gali augti per atvirumą, bendrus tikslus ir norą suprasti vienas kitą giliau. Bendras augimo noras tampa vienu stipriausių aspektų."],
        ["Rizika", "Didžiausias iššūkis gali būti skirtingas tempas priimant sprendimus. Aiškumas ir sąžiningas pokalbis sumažina nereikalingas įtampas."]
      ]
    }
  ];

  document.getElementById("resultSections").innerHTML = sections.map(section => `
    <div class="section-title">${section.title}</div>
    ${section.cards.map(card => `
      <div class="mini-card">
        <strong>${card[0]}</strong>
        <p>${card[1]}</p>
      </div>
    `).join("")}
  `).join("");
}
