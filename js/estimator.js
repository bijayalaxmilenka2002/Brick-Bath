/**
 * Interactive Bathroom Renovation Package Estimator
 */

(function () {
  let currentStep = 1;
  const selections = {
    roomType: null,
    scope: null,
    tier: null
  };

  const roomOptions = [
    { id: "compact", title: "Powder / Compact Bath", desc: "Up to 35 sq.ft. Space-smart fixtures & sleek vanity." },
    { id: "standard", title: "Standard Family Bath", desc: "35 - 65 sq.ft. Complete wet/dry zones & rain shower." },
    { id: "master", title: "Master Luxury Ensuite", desc: "65+ sq.ft. Spacious layout, premium vanity & glass partition." }
  ];

  const scopeOptions = [
    { id: "refresh", title: "Cosmetic Refresh", desc: "Fittings, vanity, LED mirror & accessories upgrade." },
    { id: "remodel", title: "Full Turnkey Remodel", desc: "Demolition, 100% waterproofing, new tiles, plumbing & fixtures." },
    { id: "luxury", title: "Bespoke Architectural Spa", desc: "Structural expansion, custom stone, sensory shower & luxury sanitary." }
  ];

  const tierOptions = [
    { id: "aura", title: "Aura Collection", desc: "Jaquar fittings, 12+ ceramic tile options, 5-yr warranty.", collectionId: "aura" },
    { id: "prestige", title: "Prestige Collection", desc: "Vitrified large tiles, accent wall, enhanced vanity, 5-yr warranty.", collectionId: "prestige" },
    { id: "elite", title: "Elite / Signature Luxury", desc: "Kohler/Grohe thermostatic fittings, imported stone, 7-10 yr warranty.", collectionId: "elite" }
  ];

  function initEstimator() {
    const nextBtn = document.getElementById("estimator-next-btn");
    const prevBtn = document.getElementById("estimator-prev-btn");
    const restartBtn = document.getElementById("estimator-restart-btn");
    const bookNowBtn = document.getElementById("estimator-book-btn");

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (!validateStep(currentStep)) {
          showToast("Please select an option to continue.", "info");
          return;
        }
        if (currentStep < 3) {
          goToStep(currentStep + 1);
        } else {
          calculateAndShowResult();
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (currentStep > 1) {
          goToStep(currentStep - 1);
        }
      });
    }

    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        selections.roomType = null;
        selections.scope = null;
        selections.tier = null;
        document.querySelectorAll(".estimator-option").forEach(el => el.classList.remove("selected"));
        goToStep(1);
      });
    }

    if (bookNowBtn) {
      bookNowBtn.addEventListener("click", () => {
        const bookingSection = document.getElementById("booking");
        const reqInput = document.getElementById("booking-requirements");
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: "smooth" });
        }
        if (reqInput && selections.tier) {
          reqInput.value = `Estimator Plan: ${selections.tier.toUpperCase()} for ${selections.roomType} (${selections.scope})`;
          reqInput.focus();
        }
      });
    }

    setupOptionListeners();
  }

  function setupOptionListeners() {
    document.querySelectorAll(".estimator-option").forEach(opt => {
      opt.addEventListener("click", function () {
        const step = parseInt(this.dataset.step, 10);
        const value = this.dataset.value;

        // Deselect siblings
        const parentPane = this.closest(".step-content-pane");
        parentPane.querySelectorAll(".estimator-option").forEach(el => el.classList.remove("selected"));

        this.classList.add("selected");

        if (step === 1) selections.roomType = value;
        if (step === 2) selections.scope = value;
        if (step === 3) selections.tier = value;

        // Auto advance after slight delay for smooth UX
        setTimeout(() => {
          if (step < 3) {
            goToStep(step + 1);
          } else {
            calculateAndShowResult();
          }
        }, 250);
      });
    });
  }

  function validateStep(step) {
    if (step === 1) return !!selections.roomType;
    if (step === 2) return !!selections.scope;
    if (step === 3) return !!selections.tier;
    return true;
  }

  function goToStep(step) {
    currentStep = step;

    // Update indicator
    document.querySelectorAll(".step-indicator").forEach((ind, i) => {
      if (i + 1 <= step) {
        ind.classList.add("active");
      } else {
        ind.classList.remove("active");
      }
    });

    // Update panes
    document.querySelectorAll(".step-content-pane").forEach(pane => {
      pane.classList.remove("active");
    });

    const activePane = document.getElementById(`step-pane-${step}`);
    if (activePane) {
      activePane.classList.add("active");
    }

    // Toggle button visibility
    const prevBtn = document.getElementById("estimator-prev-btn");
    const nextBtn = document.getElementById("estimator-next-btn");
    if (prevBtn) prevBtn.style.display = step === 1 ? "none" : "inline-flex";
    if (nextBtn) nextBtn.textContent = step === 3 ? "View Recommendation" : "Next Step";
  }

  function calculateAndShowResult() {
    let matchedCollectionId = "prestige";

    if (selections.tier === "aura" || selections.scope === "refresh") {
      matchedCollectionId = "aura";
    } else if (selections.tier === "elite" || selections.scope === "luxury") {
      matchedCollectionId = selections.roomType === "master" ? "signature" : "elite";
    } else {
      matchedCollectionId = "prestige";
    }

    const collection = BRICKNBATH_DATA.collections.find(c => c.id === matchedCollectionId) || BRICKNBATH_DATA.collections[1];

    document.getElementById("result-collection-name").textContent = collection.name;
    document.getElementById("result-tagline").textContent = collection.tagline;
    document.getElementById("result-budget-range").textContent = collection.idealBudgetRange;
    document.getElementById("result-timeline").textContent = collection.timeline;
    document.getElementById("result-warranty").textContent = collection.warranty;
    document.getElementById("result-brands").textContent = collection.brandPartners.join(", ");

    // Hide steps, show result box
    document.querySelectorAll(".step-content-pane").forEach(pane => pane.classList.remove("active"));
    document.getElementById("estimator-stepper-bar").style.display = "none";
    document.getElementById("estimator-nav-actions").style.display = "none";
    document.getElementById("step-pane-result").classList.add("active");
  }

  document.addEventListener("DOMContentLoaded", initEstimator);
})();
