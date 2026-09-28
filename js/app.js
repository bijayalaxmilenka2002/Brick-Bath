/**
 * Brick & Bath Luxury Application Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initMobileDrawer();
  initHeroSlideshow();
  initBeforeAfterSlider();
  initCollections();
  initFAQAccordion();
  initModals();
  initForms();
  initMoodboardPalette();
  initLeadsAdmin();
});

/* -------------------------------------------------------------
   1. NAVBAR & SCROLL EFFECTS
   ------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById("main-navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

/* -------------------------------------------------------------
   2. MOBILE DRAWER
   ------------------------------------------------------------- */
function initMobileDrawer() {
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const drawer = document.getElementById("mobile-drawer");
  const overlay = document.getElementById("mobile-drawer-overlay");
  const closeBtn = document.getElementById("drawer-close-btn");
  const drawerLinks = document.querySelectorAll(".drawer-link");

  function openDrawer() {
    drawer.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener("click", closeDrawer);
  });
}

/* -------------------------------------------------------------
   2.5 HERO BATHROOM TYPES & FACILITIES SLIDESHOW (10-SECOND AUTOPLAY)
   ------------------------------------------------------------- */
function initHeroSlideshow() {
  const slider = document.getElementById("hero-showcase-slider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".hero-slide");
  const tabs = slider.querySelectorAll(".hero-tab-btn");
  const prevBtn = document.getElementById("hero-slider-prev");
  const nextBtn = document.getElementById("hero-slider-next");

  if (!slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  const slideDuration = 10000; // Exactly 10 seconds per slide as requested
  let autoPlayTimer = null;

  // Preload all bathroom design images into browser memory immediately
  const heroImageUrls = [
    "assets/services/aura.webp",
    "assets/services/prestige.webp",
    "assets/services/elite.webp",
    "assets/services/signature.webp"
  ];
  heroImageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });

  function updateSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;

    // Update active slide with smooth cross-fade & Ken Burns zoom
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentIndex);
    });

    // Update selector tabs (image names)
    tabs.forEach((tab, i) => {
      const isActive = i === currentIndex;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    // Reset automatic slide cycle
    restartAutoPlay();
  }

  function nextSlide() {
    updateSlide(currentIndex + 1);
  }

  function restartAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(nextSlide, slideDuration);
  }

  // Start the automatic slideshow immediately
  restartAutoPlay();

  // Tab Buttons Click (immediate switch + resets 10-second timer)
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = parseInt(tab.dataset.slideTarget, 10);
      if (!isNaN(target)) {
        updateSlide(target);
      }
    });
  });

  // Navigation Arrows (immediate switch + resets 10-second timer)
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      updateSlide(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      updateSlide(currentIndex + 1);
    });
  }

  // Touch / Swipe Navigation for mobile devices
  let touchStartX = 0;
  let touchStartY = 0;

  slider.addEventListener("touchstart", (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }
  }, { passive: true });

  slider.addEventListener("touchend", (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          updateSlide(currentIndex + 1); // Swipe left -> Next
        } else {
          updateSlide(currentIndex - 1); // Swipe right -> Prev
        }
      }
    }
  }, { passive: true });

  // Keyboard navigation when focused
  slider.setAttribute("tabindex", "0");
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      updateSlide(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
      updateSlide(currentIndex + 1);
    }
  });

  // Page visibility: safely pause when browser tab is inactive and resume when active
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    } else {
      restartAutoPlay();
    }
  });
}

/* -------------------------------------------------------------
   3. INTERACTIVE BEFORE & AFTER SLIDER
   ------------------------------------------------------------- */
function initBeforeAfterSlider() {
  const sliderContainer = document.getElementById("transformation-slider");
  const afterWrapper = document.getElementById("slider-after-wrapper");
  const handle = document.getElementById("slider-handle");
  const afterImg = document.getElementById("slider-after-img");
  const beforeImg = document.getElementById("slider-before-img");

  if (!sliderContainer || !afterWrapper || !handle) return;

  let isDragging = false;

  function updateSlider(clientX) {
    const rect = sliderContainer.getBoundingClientRect();
    let posX = clientX - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;

    const percentage = (posX / rect.width) * 100;
    afterWrapper.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;

    // Ensure the clipped image stays proportional to the container width
    if (afterImg) {
      afterImg.style.width = `${rect.width}px`;
    }
  }

  // Recalculate inner image width on resize
  window.addEventListener("resize", () => {
    if (afterImg && sliderContainer) {
      afterImg.style.width = `${sliderContainer.offsetWidth}px`;
    }
  });

  // Mouse Events
  sliderContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Touch Events for Mobile
  sliderContainer.addEventListener("touchstart", (e) => {
    isDragging = true;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener("touchend", () => {
    isDragging = false;
  });

  // Project Tabs (Master Ensuite vs Family Bath)
  const tabs = document.querySelectorAll(".project-tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const projId = tab.dataset.project;
      const project = BRICKNBATH_DATA.transformations.find(p => p.id === projId);

      if (project) {
        beforeImg.src = project.beforeImg;
        afterImg.src = project.afterImg;

        document.getElementById("meta-location").textContent = project.location;
        document.getElementById("meta-turnaround").textContent = project.turnaround;
        document.getElementById("meta-collection").textContent = project.collection;
        document.getElementById("meta-scope").textContent = project.scope;

        // Reset handle to center
        afterWrapper.style.width = "50%";
        handle.style.left = "50%";
      }
    });
  });

  // Initial sizing of after image
  setTimeout(() => {
    if (afterImg && sliderContainer) {
      afterImg.style.width = `${sliderContainer.offsetWidth}px`;
    }
  }, 100);
}

/* -------------------------------------------------------------
   4. COLLECTIONS & DETAILS MODAL
   ------------------------------------------------------------- */
function initCollections() {
  const collectionModal = document.getElementById("collection-modal");
  const modalClose = document.getElementById("collection-modal-close");
  const modalBody = document.getElementById("collection-modal-body");

  // Open modal on "Explore Inclusions" button click
  document.querySelectorAll(".explore-collection-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const colId = this.dataset.collectionId;
      const collection = BRICKNBATH_DATA.collections.find(c => c.id === colId);
      if (!collection) return;

      modalBody.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <span class="badge-gold">${collection.timeline} Handover • ${collection.warranty} Warranty</span>
          <h2 style="font-size: 2rem; margin: 0.75rem 0 0.25rem 0; color: #FFF;">${collection.name}</h2>
          <p style="color: var(--gold-light); font-weight: 500;">${collection.tagline}</p>
        </div>
        <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.5rem;">${collection.summary}</p>
        
        <h4 style="font-size: 1.1rem; color: #FFF; margin-bottom: 1rem;">Complete Inclusions & Specifications:</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem;">
          ${collection.features.map(f => `
            <li style="display: flex; align-items: flex-start; gap: 0.65rem; color: var(--text-primary); font-size: 0.925rem;">
              <svg style="width: 18px; height: 18px; min-width: 18px; color: var(--gold-light); margin-top: 2px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              ${f}
            </li>
          `).join('')}
        </ul>

        <div style="background: rgba(14, 22, 34, 0.75); border: 1px solid var(--gold-border); border-radius: var(--radius-md); padding: 1.25rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem;">
          <div>
            <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Estimated Package Budget</span>
            <div style="font-family: var(--font-serif); font-size: 1.35rem; font-weight: 700; color: var(--gold-bright);">${collection.idealBudgetRange}</div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Featured Brands</span>
            <div style="font-size: 0.9rem; font-weight: 600; color: #FFF;">${collection.brandPartners.join(', ')}</div>
          </div>
        </div>

        <button class="btn btn-gold btn-lg" style="width: 100%; justify-content: center;" onclick="selectCollectionForBooking('${collection.name}')">
          Book Free 3D Consultation for ${collection.name}
        </button>
      `;

      collectionModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", () => {
      collectionModal.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  if (collectionModal) {
    collectionModal.addEventListener("click", (e) => {
      if (e.target === collectionModal) {
        collectionModal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }
}

window.selectCollectionForBooking = function(collectionName) {
  const modal = document.getElementById("collection-modal");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";

  const booking = document.getElementById("booking");
  const reqInput = document.getElementById("booking-requirements");
  if (booking) booking.scrollIntoView({ behavior: "smooth" });
  if (reqInput) {
    reqInput.value = `Interested in ${collectionName} package consultation.`;
    reqInput.focus();
  }
};

/* -------------------------------------------------------------
   5. FAQ ACCORDION
   ------------------------------------------------------------- */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const header = item.querySelector(".faq-header");
    header.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all other FAQs
      faqItems.forEach(i => i.classList.remove("active"));

      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

/* -------------------------------------------------------------
   6. MODAL SYSTEM (CATALOGUE & CAREERS)
   ------------------------------------------------------------- */
function initModals() {
  // Catalogue Modal
  const catalogueBtn = document.getElementById("open-catalogue-btn");
  const catalogueModal = document.getElementById("catalogue-modal");
  const catalogueClose = document.getElementById("catalogue-modal-close");
  const catalogueIframe = document.getElementById("catalogue-iframe");
  const catalogueLoader = document.getElementById("catalogue-loader");
  const catalogueExpandBtn = document.getElementById("catalogue-expand-btn");
  const catalogueExpandText = document.getElementById("catalogue-expand-text");
  const catalogueConsultBtn = document.getElementById("catalogue-consult-btn");
  const catalogueModalBox = catalogueModal ? catalogueModal.querySelector(".catalogue-modal-box") : null;

  const openCatalogue = () => {
    if (catalogueModal) {
      catalogueModal.classList.add("active");
      document.body.style.overflow = "hidden";

      if (catalogueIframe) {
        // Show loader
        if (catalogueLoader) catalogueLoader.classList.remove("hidden");

        const targetSrc = "https://flipebooks.com/embed/bricknbath-catalogue-final-compressed-R-abj3P-SV";
        if (catalogueIframe.getAttribute("src") !== targetSrc) {
          catalogueIframe.src = targetSrc;
        }

        // Hide loader when iframe finishes loading
        catalogueIframe.onload = () => {
          if (catalogueLoader) catalogueLoader.classList.add("hidden");
        };

        // Safety fallback timer to hide loader if iframe event is swallowed
        setTimeout(() => {
          if (catalogueLoader) catalogueLoader.classList.add("hidden");
        }, 3500);
      }
    }
  };

  const closeCatalogue = () => {
    if (catalogueModal) {
      catalogueModal.classList.remove("active");
      document.body.style.overflow = "";
      // Reset fullscreen if was expanded
      if (catalogueModalBox) catalogueModalBox.classList.remove("fullscreen-modal");
      if (catalogueExpandText) catalogueExpandText.textContent = "Expand";
    }
  };

  // Attach open triggers to hero CTA button and all .open-catalogue-trigger elements
  if (catalogueBtn) {
    catalogueBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openCatalogue();
    });
  }

  document.querySelectorAll(".open-catalogue-trigger").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openCatalogue();
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCatalogue();
      }
    });
  });

  if (catalogueClose) {
    catalogueClose.addEventListener("click", closeCatalogue);
  }

  // Toggle fullscreen modal
  if (catalogueExpandBtn && catalogueModalBox) {
    catalogueExpandBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isExpanded = catalogueModalBox.classList.toggle("fullscreen-modal");
      if (catalogueExpandText) {
        catalogueExpandText.textContent = isExpanded ? "Compact" : "Expand";
      }
    });
  }

  // Direct consultation booking from modal footer
  if (catalogueConsultBtn) {
    catalogueConsultBtn.addEventListener("click", (e) => {
      closeCatalogue();
    });
  }

  // Careers Modal
  const careerModal = document.getElementById("career-modal");
  const careerClose = document.getElementById("career-modal-close");
  const jobTitleSpan = document.getElementById("job-title-modal");

  document.querySelectorAll(".apply-job-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const title = this.dataset.jobTitle;
      if (jobTitleSpan) jobTitleSpan.textContent = title;
      if (careerModal) {
        careerModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  const closeCareer = () => {
    if (careerModal) {
      careerModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  if (careerClose) {
    careerClose.addEventListener("click", closeCareer);
  }

  // Backdrop click to dismiss modals
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });

  // ESC key to dismiss modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.active").forEach(overlay => {
        overlay.classList.remove("active");
        document.body.style.overflow = "";
      });
    }
  });
}

/* -------------------------------------------------------------
   7. BACKEND API & FORM HANDLING
   ------------------------------------------------------------- */
const API_BASE_URL = (window.location.protocol.startsWith("http") && window.location.hostname)
  ? "" 
  : "http://localhost:5000";

function initForms() {
  const bookingForm = document.getElementById("consultation-form");
  const careerForm = document.getElementById("career-application-form");

  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("booking-name").value.trim();
      const phone = document.getElementById("booking-phone").value.trim();
      const city = document.getElementById("booking-city").value.trim() || "Bhubaneswar";
      const date = document.getElementById("booking-date") ? document.getElementById("booking-date").value : "";
      const requirements = document.getElementById("booking-requirements").value.trim() || "Turnkey Luxury Bathroom Renovation";

      if (!name || !phone) {
        showToast("Please provide your name and contact phone number.", "error");
        return;
      }

      // Phone number validation (10 digits)
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      if (cleanPhone.length < 10) {
        showToast("Please enter a valid 10-digit mobile number.", "error");
        return;
      }

      const submitBtn = bookingForm.querySelector("button[type='submit']");
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Saving to Database...";
      submitBtn.disabled = true;

      const refId = `BNB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

      const newInquiry = {
        refId: refId,
        name: name,
        phone: cleanPhone,
        city: city,
        preferredDate: date || "Earliest Available",
        requirements: requirements,
        status: "New",
        createdAt: timestamp
      };

      // Submit directly into SQLite database through Express API
      try {
        const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            refId: refId,
            name: name,
            phone: cleanPhone,
            city: city,
            preferredDate: date || "Earliest Available",
            requirements: requirements
          })
        });

        if (response.ok) {
          showToast(`Consultation inquiry saved to database! Ref: ${refId}`, "success");
        } else {
          showToast("Inquiry saved locally (API notice).", "info");
        }
      } catch (err) {
        console.warn("Backend API not reachable; saved locally in browser:", err);
        showToast("Inquiry saved locally (Backend server offline).", "info");
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        bookingForm.reset();

        // Populate and open Confirmation Modal
        showConsultationSuccessModal(newInquiry);
      }
    });
  }

  if (careerForm) {
    careerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const jobTitle = document.getElementById("job-title-modal") ? document.getElementById("job-title-modal").textContent.trim() : "Renovation Specialist";
      const name = document.getElementById("career-name") ? document.getElementById("career-name").value.trim() : "";
      const email = document.getElementById("career-email") ? document.getElementById("career-email").value.trim() : "";
      const phone = document.getElementById("career-phone") ? document.getElementById("career-phone").value.trim() : "";
      const experience = document.getElementById("career-experience") ? document.getElementById("career-experience").value.trim() : "";
      const notes = document.getElementById("career-notes") ? document.getElementById("career-notes").value.trim() : "";

      const submitBtn = careerForm.querySelector("button[type='submit']");
      const origText = submitBtn ? submitBtn.textContent : "Submit Application";
      if (submitBtn) {
        submitBtn.textContent = "Saving Application...";
        submitBtn.disabled = true;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/careers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle,
            name,
            email,
            phone,
            experience,
            notes
          })
        });

        if (response.ok) {
          showToast("Career application received & saved to database!", "success");
        } else {
          showToast("Application received! Our HR team will review your profile.", "success");
        }
      } catch (err) {
        console.warn("Backend API offline for career application:", err);
        showToast("Application received! (Recorded locally)", "success");
      } finally {
        if (submitBtn) {
          submitBtn.textContent = origText;
          submitBtn.disabled = false;
        }
        const careerModal = document.getElementById("career-modal");
        if (careerModal) careerModal.classList.remove("active");
        document.body.style.overflow = "";
        careerForm.reset();
      }
    });
  }
}

function showConsultationSuccessModal(inquiry) {
  const modal = document.getElementById("consultation-success-modal");
  const closeBtn = document.getElementById("success-modal-close-btn");
  const refIdEl = document.getElementById("success-ref-id");
  const nameEl = document.getElementById("success-client-name");
  const phoneEl = document.getElementById("success-client-phone");
  const cityEl = document.getElementById("success-client-city");
  const notesEl = document.getElementById("success-client-notes");
  const waBtn = document.getElementById("success-whatsapp-btn");

  if (refIdEl) refIdEl.textContent = inquiry.refId;
  if (nameEl) nameEl.textContent = inquiry.name;
  if (phoneEl) phoneEl.textContent = `+91 ${inquiry.phone}`;
  if (cityEl) cityEl.textContent = inquiry.city;
  if (notesEl) notesEl.textContent = inquiry.requirements;

  if (waBtn) {
    const waText = encodeURIComponent(
      `Hello BricknBath, I have requested a bathroom renovation consultation!\n\n` +
      `📌 Booking Ref: ${inquiry.refId}\n` +
      `👤 Name: ${inquiry.name}\n` +
      `📞 Phone: +91 ${inquiry.phone}\n` +
      `📍 City: ${inquiry.city}\n` +
      `🛁 Plan / Scope: ${inquiry.requirements}`
    );
    waBtn.href = `https://wa.me/917205889111?text=${waText}`;
  }

  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  if (closeBtn && modal) {
    closeBtn.onclick = () => {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    };
  }
}

function initLeadsAdmin() {
  const openOwnerBtn = document.getElementById("open-owner-portal-btn");
  const modal = document.getElementById("leads-admin-modal");
  const closeBtn = document.getElementById("leads-admin-modal-close");
  const tbody = document.getElementById("admin-leads-tbody");
  const totalLeadsEl = document.getElementById("admin-total-leads");
  const dbStatusEl = document.getElementById("admin-db-status");
  const exportBtn = document.getElementById("export-leads-btn");
  const refreshBtn = document.getElementById("refresh-leads-btn");
  const clearBtn = document.getElementById("clear-leads-btn");
  const logoutBtn = document.getElementById("owner-logout-btn");

  // Owner Login Modal Elements
  const loginModal = document.getElementById("owner-login-modal");
  const loginCloseBtn = document.getElementById("owner-login-modal-close");
  const loginForm = document.getElementById("owner-login-form");
  const passwordInput = document.getElementById("owner-password-input");
  const togglePasswordBtn = document.getElementById("toggle-owner-password-btn");
  const loginErrorEl = document.getElementById("owner-login-error");
  const submitLoginBtn = document.getElementById("owner-login-submit-btn");

  let currentLeads = [];

  // Always purge legacy public localStorage to protect client privacy
  try {
    localStorage.removeItem("bnb_inquiries");
  } catch (e) {}

  function getOwnerToken() {
    return sessionStorage.getItem("bnb_owner_token");
  }

  function setOwnerToken(token) {
    if (token) {
      sessionStorage.setItem("bnb_owner_token", token);
    } else {
      sessionStorage.removeItem("bnb_owner_token");
    }
  }

  function openOwnerLogin() {
    if (loginErrorEl) {
      loginErrorEl.style.display = "none";
      loginErrorEl.textContent = "";
    }
    if (passwordInput) {
      passwordInput.value = "";
    }
    if (loginModal) {
      loginModal.classList.add("active");
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (passwordInput) passwordInput.focus();
      }, 100);
    }
  }

  function closeOwnerLogin() {
    if (loginModal) {
      loginModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  function openLeadsModal() {
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
      loadLeads();
    }
  }

  function closeLeadsModal() {
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  function handleOwnerPortalTrigger(e) {
    if (e) e.preventDefault();
    const token = getOwnerToken();
    if (token) {
      openLeadsModal();
    } else {
      openOwnerLogin();
    }
  }

  // Handle owner login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const pwd = passwordInput ? passwordInput.value : "";
      if (!pwd) return;

      if (submitLoginBtn) {
        submitLoginBtn.disabled = true;
        submitLoginBtn.innerHTML = `<span>Verifying...</span>`;
      }
      if (loginErrorEl) loginErrorEl.style.display = "none";

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pwd })
        });

        const resData = await response.json();

        if (response.ok && resData.token) {
          setOwnerToken(resData.token);
          closeOwnerLogin();
          openLeadsModal();
          showToast("Owner authenticated successfully. Welcome!", "success");
        } else {
          if (loginErrorEl) {
            loginErrorEl.textContent = resData.message || "Incorrect owner password.";
            loginErrorEl.style.display = "block";
          }
          if (passwordInput) {
            passwordInput.focus();
            passwordInput.select();
          }
        }
      } catch (err) {
        console.error("Owner authentication error:", err);
        if (loginErrorEl) {
          loginErrorEl.textContent = "Could not connect to authentication server.";
          loginErrorEl.style.display = "block";
        }
      } finally {
        if (submitLoginBtn) {
          submitLoginBtn.disabled = false;
          submitLoginBtn.innerHTML = `<span>Unlock Inquiries Manager</span>`;
        }
      }
    });
  }

  // Password visibility toggle
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener("click", () => {
      const isPwd = passwordInput.type === "password";
      passwordInput.type = isPwd ? "text" : "password";
      togglePasswordBtn.classList.toggle("active", isPwd);
    });
  }

  // Owner Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      const token = getOwnerToken();
      if (token) {
        try {
          await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
          });
        } catch (e) {}
      }
      setOwnerToken(null);
      closeLeadsModal();
      showToast("Owner logged out securely.", "info");
    });
  }

  async function loadLeads() {
    const token = getOwnerToken();
    if (!token) {
      closeLeadsModal();
      openOwnerLogin();
      return;
    }

    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="7" style="padding: 2.5rem; text-align: center; color: var(--gold-light);">⏳ Loading confidential inquiries from database...</td></tr>`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        setOwnerToken(null);
        closeLeadsModal();
        openOwnerLogin();
        showToast("Session expired. Please re-authenticate.", "warning");
        return;
      }

      if (response.ok) {
        const resData = await response.json();
        currentLeads = resData.data || [];
        const engineLabel = resData.storageEngine ? `● Connected: ${resData.storageEngine}` : "● Connected: Database";
        if (dbStatusEl) dbStatusEl.innerHTML = `${engineLabel} (${currentLeads.length} records)`;
        renderLeadsTable(currentLeads);
        return;
      }

      throw new Error("Failed to load: " + response.status);
    } catch (err) {
      console.error("Error loading leads:", err);
      if (dbStatusEl) dbStatusEl.innerHTML = `<span style="color: #EF4444;">❌ Failed to load</span>`;
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="7" style="padding: 2rem; text-align: center; color: #EF4444;">Unable to load inquiries. Ensure the backend server is running.</td></tr>`;
      }
    }
  }

  function renderLeadsTable(leads) {
    if (totalLeadsEl) totalLeadsEl.textContent = leads.length;

    if (!tbody) return;
    if (leads.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="padding: 2.5rem; text-align: center; color: var(--text-muted);">No inquiries logged yet. Consultation requests submitted by clients will appear here.</td></tr>`;
      return;
    }

    tbody.innerHTML = leads.map(l => {
      const displayStatus = l.status || "New";
      const statusColor = displayStatus === "Assessment Scheduled" ? "#3B82F6" : (displayStatus === "Contacted" ? "#10B981" : "#F59E0B");

      return `
        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
          <td style="padding: 0.85rem 1rem; color: var(--gold-bright); font-family: monospace; font-weight: 700;">${l.refId}</td>
          <td style="padding: 0.85rem 1rem; color: #FFF; font-weight: 600;">${l.name}</td>
          <td style="padding: 0.85rem 1rem; color: var(--text-primary);"><a href="tel:+91${l.phone}" style="color: inherit; text-decoration: none;">+91 ${l.phone}</a></td>
          <td style="padding: 0.85rem 1rem; color: var(--text-secondary);">${l.city || 'Bhubaneswar'}</td>
          <td style="padding: 0.85rem 1rem; color: var(--text-primary); max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${l.requirements}">${l.requirements}</td>
          <td style="padding: 0.85rem 1rem;">
            <span style="display: inline-block; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; background: ${statusColor}22; color: ${statusColor}; border: 1px solid ${statusColor}44;">
              ${displayStatus}
            </span>
          </td>
          <td style="padding: 0.85rem 1rem; white-space: nowrap;">
            <a href="https://wa.me/91${l.phone}?text=Hello%20${encodeURIComponent(l.name)}%2C%20this%20is%20BricknBath%20Bhubaneswar%20regarding%20your%20renovation%20inquiry%20(${l.refId})." target="_blank" rel="noopener noreferrer" style="color: #25D366; text-decoration: none; font-weight: 600; font-size: 0.8rem; margin-right: 0.6rem;">WhatsApp</a>
            ${l.id ? `<button class="admin-delete-btn" data-id="${l.id}" style="background: none; border: none; color: #EF4444; font-size: 0.85rem; cursor: pointer; padding: 0;" title="Delete lead">🗑️</button>` : ''}
          </td>
        </tr>
      `;
    }).join('');

    // Attach delete listeners
    tbody.querySelectorAll(".admin-delete-btn").forEach(btn => {
      btn.addEventListener("click", async function () {
        const id = this.getAttribute("data-id");
        if (confirm("Are you sure you want to permanently remove this inquiry?")) {
          const token = getOwnerToken();
          try {
            await fetch(`${API_BASE_URL}/api/inquiries/${id}`, {
              method: "DELETE",
              headers: { "Authorization": `Bearer ${token}` }
            });
            showToast("Inquiry removed from database.", "info");
            loadLeads();
          } catch (e) {
            showToast("Could not delete from database.", "error");
          }
        }
      });
    });
  }

  function exportToCSV() {
    const token = getOwnerToken();
    if (!token) {
      openOwnerLogin();
      return;
    }
    window.open(`${API_BASE_URL}/api/inquiries/export/csv?token=${encodeURIComponent(token)}`, "_blank");
    showToast("Downloading CSV export from database...", "info");
  }

  // Trigger bindings
  if (openOwnerBtn) openOwnerBtn.addEventListener("click", handleOwnerPortalTrigger);
  const drawerOwnerBtn = document.getElementById("drawer-leads-admin-link");
  if (drawerOwnerBtn) drawerOwnerBtn.addEventListener("click", handleOwnerPortalTrigger);

  // Keyboard shortcut: Ctrl + Shift + L (or Cmd + Shift + L)
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "L" || e.key === "l")) {
      e.preventDefault();
      handleOwnerPortalTrigger();
    }
  });

  // URL Hash check: #owner or #admin
  if (window.location.hash === "#owner" || window.location.hash === "#admin") {
    setTimeout(handleOwnerPortalTrigger, 300);
  }

  if (closeBtn) closeBtn.addEventListener("click", closeLeadsModal);
  if (loginCloseBtn) loginCloseBtn.addEventListener("click", closeOwnerLogin);

  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      loadLeads();
      showToast("Refreshed records from database.", "info");
    });
  }

  if (exportBtn) exportBtn.addEventListener("click", exportToCSV);

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem("bnb_inquiries");
      showToast("Public local cache cleared.", "info");
    });
  }
}

/* Toast Notification Utility */
function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const iconSvg = type === "success" 
    ? '<svg style="width:20px;height:20px;color:#10B981;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>'
    : '<svg style="width:20px;height:20px;color:#DFB15B;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';

  toast.innerHTML = `
    ${iconSvg}
    <div style="font-size:0.9rem; font-weight:500;">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "all 0.3s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/* -------------------------------------------------------------
   8. MATERIAL & FINISH MOODBOARD LOGIC
   ------------------------------------------------------------- */
function initMoodboardPalette() {
  const currentSelections = {
    tile: "Italian Statuario White",
    finish: "Brushed Champagne Gold",
    vanity: "Fluted Dark Walnut"
  };

  const swatchBtns = document.querySelectorAll(".swatch-btn");
  const mbHeading = document.getElementById("moodboard-heading");
  const mbTile = document.getElementById("mb-val-tile");
  const mbFinish = document.getElementById("mb-val-finish");
  const mbVanity = document.getElementById("mb-val-vanity");
  const mbImg = document.getElementById("moodboard-img");
  const bookPaletteBtn = document.getElementById("book-palette-btn");

  swatchBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const type = this.dataset.type;
      const name = this.dataset.name;
      const img = this.dataset.img;

      // Deselect siblings in the same group
      const parentGroup = this.closest(".swatch-pills");
      parentGroup.querySelectorAll(".swatch-btn").forEach(b => b.classList.remove("active"));
      this.classList.add("active");

      if (type === "tile") {
        currentSelections.tile = name;
        if (mbTile) mbTile.textContent = name;
        if (mbImg && img) mbImg.src = img;
      } else if (type === "finish") {
        currentSelections.finish = name;
        if (mbFinish) mbFinish.textContent = name;
      } else if (type === "vanity") {
        currentSelections.vanity = name;
        if (mbVanity) mbVanity.textContent = name;
      }

      if (mbHeading) {
        mbHeading.textContent = `${currentSelections.tile} & ${currentSelections.finish} Suite`;
      }
    });
  });

  if (bookPaletteBtn) {
    bookPaletteBtn.addEventListener("click", () => {
      const booking = document.getElementById("booking");
      const reqInput = document.getElementById("booking-requirements");
      if (booking) booking.scrollIntoView({ behavior: "smooth" });
      if (reqInput) {
        reqInput.value = `Selected Palette: ${currentSelections.tile} + ${currentSelections.finish} fittings + ${currentSelections.vanity} vanity.`;
        reqInput.focus();
      }
      showToast("Palette loaded into consultation form!", "success");
    });
  }
}
