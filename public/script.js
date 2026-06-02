function goTo(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0,0);
}

document.addEventListener("DOMContentLoaded",()=>{
  const params=new URLSearchParams(window.location.search);
  if(params.get("success")==="true") goTo("results");

  document.getElementById("startBtn").onclick=()=>goTo("goal");
  document.getElementById("toModules").onclick=()=>goTo("modules");
  document.getElementById("toData").onclick=()=>goTo("data");
  document.getElementById("toPayment").onclick=()=>goTo("payment");
  document.getElementById("demoBtn").onclick=()=>showResults();

  document.querySelectorAll(".choice").forEach(btn=>{
    btn.onclick=()=>btn.classList.toggle("active");
  });

  document.getElementById("analyzeBtn").onclick=()=>{
    goTo("loading");
    setTimeout(()=>document.getElementById("status").textContent="Sujungiami delnų, veido, balso, testo ir datos signalai...",900);
    setTimeout(()=>document.getElementById("status").textContent="Formuojamas tavo gyvenimo profilis...",1800);
    setTimeout(()=>goTo("teaser"),3200);
  };

  document.getElementById("stripeBtn").onclick=async()=>{
    const errorBox=document.getElementById("payError");
    errorBox.textContent="";

    try{
      const res=await fetch("/create-checkout-session",{method:"POST"});
      const data=await res.json();

      if(data.url){
        window.location.href=data.url;
      }else{
        errorBox.textContent=data.error || "Nepavyko sukurti Stripe mokėjimo.";
      }
    }catch(e){
      errorBox.textContent="Stripe klaida. Patikrink Railway Variables.";
    }
  };
});

function showResults(){
  const partner=document.getElementById("partnerName").value.trim();
  if(partner){
    document.getElementById("compatibility").textContent=`💞 ${partner}: suderinamumas 89%. Stipriausia vieta — trauka, emocinis smalsumas ir bendras augimo noras.`;
  }
  goTo("results");
}
