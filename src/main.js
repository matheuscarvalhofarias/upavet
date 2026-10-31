// UPAVET - Modern Senior-Crafted Client Architecture
// Zero errors, high-responsiveness, elegant micro-interactions

function initIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    try {
      window.lucide.createIcons();
      return true;
    } catch (e) {
      console.warn('Lucide createIcons notice:', e);
    }
  }
  return false;
}

initIcons();

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  let retries = 0;
  const timer = setInterval(() => {
    retries++;
    if (initIcons() || retries > 25) {
      clearInterval(timer);
    }
  }, 120);

  initNavigation();
  initSpaCalculator();
  initBeforeAfterSlider();
  initPricingToggle();
  initServicesTabs();
  initFaqAccordion();
  initBookingModal();
  initNewsletterForm();
});

/* ==========================================================================
   1. NAVIGATION & SCROLL
   ========================================================================== */
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navHeader = document.getElementById('nav-header');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navHeader.classList.add('shadow-md', 'bg-opacity-95');
    } else {
      navHeader.classList.remove('shadow-md');
    }
  }, { passive: true });
}

/* ==========================================================================
   2. INTERACTIVE SPA CALCULATOR
   ========================================================================== */
const SPA_RATES = {
  petMultipliers: {
    'dog-mini': { multiplier: 1.0, label: 'Cão Mini/Pequeno (até 10kg)' },
    'dog-medium': { multiplier: 1.25, label: 'Cão Médio (11 a 22kg)' },
    'dog-large': { multiplier: 1.6, label: 'Cão Grande/Gigante (+23kg)' },
    'cat-short': { multiplier: 1.1, label: 'Gato de Pelo Curto' },
    'cat-long': { multiplier: 1.35, label: 'Gato Persa/Pelo Longo' }
  },
  services: {
    'consulta': { basePrice: 120, durationMin: 30, name: 'Consulta Veterinária Especializada' },
    'vacina-v10': { basePrice: 90, durationMin: 20, name: 'Vacinação Completa (V10 / Antirrábica)' },
    'exames': { basePrice: 110, durationMin: 25, name: 'Exames Laboratoriais & Diagnóstico' },
    'banho-tosa': { basePrice: 85, durationMin: 60, name: 'Banho & Tosa Premium (Padrão Competição)' },
    'tosa-hig': { basePrice: 45, durationMin: 25, name: 'Tosa Higiênica & Corte de Unhas' },
    'hidratacao': { basePrice: 55, durationMin: 30, name: 'Hidratação Profunda de Pelagem' },
    'limpeza-dentes': { basePrice: 40, durationMin: 20, name: 'Higienização e Escovação Bucal' }
  }
};

function initSpaCalculator() {
  const petSelect = document.getElementById('calc-pet-type');
  const serviceCheckboxes = document.querySelectorAll('.calc-service-checkbox');
  const totalPriceEl = document.getElementById('calc-total-price');
  const totalTimeEl = document.getElementById('calc-total-time');
  const selectedCountEl = document.getElementById('calc-services-count');
  const bookCalcBtn = document.getElementById('calc-book-btn');

  if (!petSelect) return;

  function calculate() {
    const selectedPetKey = petSelect.value;
    const petData = SPA_RATES.petMultipliers[selectedPetKey] || { multiplier: 1.0, label: 'Pet' };

    let totalRaw = 0;
    let totalMinutes = 0;
    let selectedCount = 0;
    const selectedServicesNames = [];

    serviceCheckboxes.forEach(cb => {
      if (cb.checked) {
        const sKey = cb.value;
        const sData = SPA_RATES.services[sKey];
        if (sData) {
          totalRaw += sData.basePrice;
          totalMinutes += sData.durationMin;
          selectedCount++;
          selectedServicesNames.push(sData.name);
        }
      }
    });

    const finalPrice = Math.round(totalRaw * petData.multiplier);

    // Format Duration
    let durationText = '';
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours > 0 && mins > 0) {
      durationText = `${hours}h ${mins}min`;
    } else if (hours > 0) {
      durationText = `${hours}h`;
    } else {
      durationText = `${mins} min`;
    }

    if (totalPriceEl) totalPriceEl.textContent = `R$ ${finalPrice}`;
    if (totalTimeEl) totalTimeEl.textContent = selectedCount > 0 ? durationText : '0 min';
    if (selectedCountEl) selectedCountEl.textContent = `${selectedCount} selecionado${selectedCount > 1 ? 's' : ''}`;

    return {
      petKey: selectedPetKey,
      petLabel: petData.label,
      services: selectedServicesNames,
      price: finalPrice,
      duration: durationText
    };
  }

  // Event Listeners
  petSelect.addEventListener('change', calculate);
  serviceCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      calculate();
      // visual border highlight on parent card
      const label = cb.closest('label');
      if (label) {
        if (cb.checked) {
          label.classList.add('border-[#075da9]', 'bg-[#075da9]/5');
        } else {
          label.classList.remove('border-[#075da9]', 'bg-[#075da9]/5');
        }
      }
    });
  });

  // Action button: Pre-fill and open modal
  if (bookCalcBtn) {
    bookCalcBtn.addEventListener('click', () => {
      const calcData = calculate();
      if (calcData.services.length === 0) {
        showToast('Atenção', 'Selecione ao menos um serviço para agendar.', 'alert-circle');
        return;
      }
      openBookingModalWithData(calcData);
    });
  }

  calculate();
}

/* ==========================================================================
   3. BEFORE / AFTER COMPARISON SLIDER
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('grooming-ba-container');
  const beforeLayer = document.getElementById('ba-before-layer');
  const handle = document.getElementById('grooming-ba-handle');
  const labelBefore = document.getElementById('ba-label-before');
  const labelAfter = document.getElementById('ba-label-after');
  const badgeBefore = document.getElementById('ba-badge-before');
  const badgeAfter = document.getElementById('ba-badge-after');
  const sparklesLayer = document.getElementById('ba-sparkles-layer');

  if (!container || !beforeLayer || !handle) return;

  let isDragging = false;
  let cachedRect = null;
  let rafId = null;

  function render(percent) {
    const clamped = Math.max(0, Math.min(100, percent));
    beforeLayer.style.clipPath = `polygon(0 0, ${clamped}% 0, ${clamped}% 100%, 0 100%)`;
    handle.style.left = `${clamped}%`;

    // Brilhinhos cintilantes quando passar para o DEPOIS (arrastando para a esquerda)
    if (sparklesLayer) {
      if (clamped < 65) {
        sparklesLayer.classList.add('active');
        const intensity = Math.min(1, Math.max(0.2, (70 - clamped) / 35));
        sparklesLayer.style.opacity = intensity;
      } else {
        sparklesLayer.classList.remove('active');
        sparklesLayer.style.opacity = '0';
      }
    }

    // Destaque nos badges ANTES e DEPOIS
    if (badgeBefore && badgeAfter) {
      if (clamped >= 50) {
        badgeBefore.style.opacity = '1';
        badgeBefore.style.transform = 'scale(1.05)';
        badgeAfter.style.opacity = '0.75';
        badgeAfter.style.transform = 'scale(0.95)';
      } else {
        badgeBefore.style.opacity = '0.75';
        badgeBefore.style.transform = 'scale(0.95)';
        badgeAfter.style.opacity = '1';
        badgeAfter.style.transform = 'scale(1.08)';
      }
    }

    // Aparece ANTES quando a foto for antes (>= 50%); se arrastar para o depois (< 50%), ANTES desaparece e aparece somente DEPOIS
    if (labelBefore && labelAfter) {
      if (clamped >= 50) {
        labelBefore.style.opacity = '1';
        labelBefore.style.transform = 'scale(1)';
        labelAfter.style.opacity = '0';
        labelAfter.style.transform = 'scale(0.9)';
      } else {
        labelBefore.style.opacity = '0';
        labelBefore.style.transform = 'scale(0.9)';
        labelAfter.style.opacity = '1';
        labelAfter.style.transform = 'scale(1)';
      }
    }
  }

  // Instant Dragging with zero layout thrashing
  function updateFromClientX(clientX) {
    if (!cachedRect) cachedRect = container.getBoundingClientRect();
    let offsetX = clientX - cachedRect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > cachedRect.width) offsetX = cachedRect.width;
    const percent = (offsetX / cachedRect.width) * 100;

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      render(percent);
    });
  }

  const startDrag = (e) => {
    isDragging = true;
    cachedRect = container.getBoundingClientRect();
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
    if (clientX !== undefined) updateFromClientX(clientX);
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
    if (clientX !== undefined) updateFromClientX(clientX);
  };

  const stopDrag = () => {
    isDragging = false;
    cachedRect = null;
  };

  container.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);

  container.addEventListener('touchstart', startDrag, { passive: true });
  window.addEventListener('touchmove', onDrag, { passive: true });
  window.addEventListener('touchend', stopDrag);

  // Initialize at 50%
  render(50);
}

/* ==========================================================================
   4. PRICING TOGGLE (MONTHLY VS ANNUAL)
   ========================================================================== */
function initPricingToggle() {
  const toggleBtn = document.getElementById('pricing-toggle');
  const monthlyLabel = document.getElementById('pricing-label-monthly');
  const annualLabel = document.getElementById('pricing-label-annual');
  const priceCards = document.querySelectorAll('.pricing-card-amount');

  if (!toggleBtn) return;

  let isAnnual = false;

  toggleBtn.addEventListener('click', () => {
    isAnnual = !isAnnual;
    toggleBtn.setAttribute('aria-checked', isAnnual);

    // Switch indicator style
    const dot = toggleBtn.querySelector('.toggle-indicator');
    if (dot) {
      if (isAnnual) {
        dot.style.transform = 'translateX(24px)';
        toggleBtn.classList.replace('bg-stone-300', 'bg-emerald-700');
        if (annualLabel) annualLabel.classList.add('text-emerald-900', 'font-bold');
        if (monthlyLabel) monthlyLabel.classList.remove('text-emerald-900', 'font-bold');
      } else {
        dot.style.transform = 'translateX(0px)';
        toggleBtn.classList.replace('bg-emerald-700', 'bg-stone-300');
        if (monthlyLabel) monthlyLabel.classList.add('text-emerald-900', 'font-bold');
        if (annualLabel) annualLabel.classList.remove('text-emerald-900', 'font-bold');
      }
    }

    // Update prices
    priceCards.forEach(card => {
      const monthly = card.getAttribute('data-monthly');
      const annual = card.getAttribute('data-annual');
      const valueSpan = card.querySelector('.amount-val');
      const periodSpan = card.querySelector('.period-val');

      if (valueSpan) {
        valueSpan.textContent = isAnnual ? annual : monthly;
      }
      if (periodSpan) {
        periodSpan.textContent = isAnnual ? '/mês (no plano anual)' : '/mês';
      }
    });

    if (isAnnual) {
      showToast('Desconto Anual Ativado', 'Economia de 20% + 1 Banho Aromático cortesia!', 'sparkles');
    }
  });
}

/* ==========================================================================
   5. SERVICES TABS / FILTER
   ========================================================================== */
function initServicesTabs() {
  const tabButtons = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-catalog-card');

  if (!tabButtons.length) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => {
        btn.classList.remove('bg-emerald-800', 'text-white', 'shadow-md');
        btn.classList.add('bg-white', 'text-stone-700', 'hover:bg-emerald-50');
      });

      button.classList.add('bg-emerald-800', 'text-white', 'shadow-md');
      button.classList.remove('bg-white', 'text-stone-700', 'hover:bg-emerald-50');

      const filter = button.getAttribute('data-tab');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.classList.add('animate-fadeIn');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const chevron = item.querySelector('.faq-chevron');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');

      // Close all others
      items.forEach(otherItem => {
        const otherContent = otherItem.querySelector('.faq-content');
        const otherChevron = otherItem.querySelector('.faq-chevron');
        if (otherContent && otherContent !== content) {
          otherContent.classList.add('hidden');
          if (otherChevron) otherChevron.style.transform = 'rotate(0deg)';
        }
      });

      // Toggle current
      if (isOpen) {
        content.classList.add('hidden');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      } else {
        content.classList.remove('hidden');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* ==========================================================================
   7. BOOKING MODAL WIZARD (3-STEP WITH CUSTOMIZED WHATSAPP COPY)
   ========================================================================== */

let modalCurrentStep = 1;

const bookingState = {
  petName: '',
  petType: 'Cão',
  petBreed: '',
  petBehavior: 'Dócil e tranquilo',
  date: '',
  period: 'Manhã (08h às 12h)',
  services: ['Consultas Veterinárias'],
  estimatedTotal: '',
  tutorName: '',
  tutorPhone: '',
  notes: ''
};

function initBookingModal() {
  const modal = document.getElementById('booking-modal');
  const openBtns = document.querySelectorAll('.btn-open-booking');
  const closeBtn = document.getElementById('btn-close-modal');

  if (!modal) return;

  // Open modal triggers
  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const presetService = btn.getAttribute('data-service');
      if (presetService) {
        bookingState.services = [presetService];
        const serviceSelect = document.getElementById('modal-service-select');
        if (serviceSelect) {
          serviceSelect.value = presetService;
        }
      }

      // Reset to wizard step 1 and clear any previous success screen
      const wizard = document.getElementById('modal-wizard-container');
      const success = document.getElementById('modal-success-screen');
      if (wizard && success) {
        wizard.classList.remove('hidden');
        success.classList.add('hidden');
      }

      openModal();
    });
  });

  // Close modal trigger
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Step 1 -> Step 2
  const stepNext1 = document.getElementById('modal-btn-step-1-next');
  if (stepNext1) {
    stepNext1.addEventListener('click', () => {
      const petNameInput = document.getElementById('modal-pet-name');
      if (!petNameInput || !petNameInput.value.trim()) {
        showToast('Nome do Pet', 'Por favor, informe o nome do seu pet para personalizarmos o atendimento.', 'alert-circle');
        petNameInput?.focus();
        return;
      }
      bookingState.petName = petNameInput.value.trim();
      bookingState.petBreed = document.getElementById('modal-pet-breed')?.value.trim() || 'Não informada';
      bookingState.petType = document.getElementById('modal-pet-type-select')?.value || 'Cão';
      bookingState.petBehavior = document.getElementById('modal-pet-behavior')?.value || 'Dócil e tranquilo';

      goToStep(2);
    });
  }

  // Step 2 -> Step 1
  const stepBack2 = document.getElementById('modal-btn-step-2-back');
  if (stepBack2) {
    stepBack2.addEventListener('click', () => goToStep(1));
  }

  // Step 2 -> Step 3
  const stepNext2 = document.getElementById('modal-btn-step-2-next');
  if (stepNext2) {
    stepNext2.addEventListener('click', () => {
      const dateInput = document.getElementById('modal-booking-date');
      if (!dateInput || !dateInput.value) {
        showToast('Data Desejada', 'Por favor, escolha uma data de preferência.', 'calendar');
        dateInput?.focus();
        return;
      }
      bookingState.date = dateInput.value;
      bookingState.period = document.getElementById('modal-booking-period')?.value || 'Manhã (08h às 12h)';

      const serviceSelect = document.getElementById('modal-service-select');
      if (serviceSelect && serviceSelect.value) {
        bookingState.services = [serviceSelect.value];
      }

      const notesInput = document.getElementById('modal-notes');
      bookingState.notes = notesInput?.value.trim() || 'Nenhuma observação informada';

      // Update review items in step 3
      updateStep3Summary();
      goToStep(3);
    });
  }

  // Step 3 -> Step 2
  const stepBack3 = document.getElementById('modal-btn-step-3-back');
  if (stepBack3) {
    stepBack3.addEventListener('click', () => goToStep(2));
  }

  // Step 3 Finish
  const stepFinish3 = document.getElementById('modal-btn-step-3-finish');
  if (stepFinish3) {
    stepFinish3.addEventListener('click', (e) => {
      e.preventDefault();

      const tutorNameInput = document.getElementById('modal-tutor-name');
      const tutorPhoneInput = document.getElementById('modal-tutor-phone');

      if (!tutorNameInput || !tutorNameInput.value.trim()) {
        showToast('Seu Nome', 'Por favor, informe seu nome completo.', 'alert-circle');
        tutorNameInput?.focus();
        return;
      }
      if (!tutorPhoneInput || !tutorPhoneInput.value.trim()) {
        showToast('Seu WhatsApp', 'Por favor, informe seu número de WhatsApp para contato.', 'alert-circle');
        tutorPhoneInput?.focus();
        return;
      }

      bookingState.tutorName = tutorNameInput.value.trim();
      bookingState.tutorPhone = tutorPhoneInput.value.trim();

      // Dispatch to WhatsApp
      finishAndRedirectWhatsApp();
    });
  }

  // Today as min date
  const dateInput = document.getElementById('modal-booking-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;
  }
}

function openModal() {
  const modal = document.getElementById('booking-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    goToStep(1);
  }
}

function closeModal() {
  const modal = document.getElementById('booking-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function goToStep(stepNumber) {
  modalCurrentStep = stepNumber;
  const steps = [1, 2, 3];

  steps.forEach(s => {
    const panel = document.getElementById('modal-panel-step-' + s);
    const indicator = document.getElementById('step-indicator-' + s);

    if (panel) {
      if (s === stepNumber) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    }

    if (indicator) {
      if (s === stepNumber) {
        indicator.classList.add('bg-[#8B0000]', 'text-white');
        indicator.classList.remove('bg-stone-200', 'text-stone-600', 'bg-[#a30000]');
      } else if (s < stepNumber) {
        indicator.classList.add('bg-[#a30000]', 'text-white');
        indicator.classList.remove('bg-stone-200', 'text-stone-600', 'bg-[#8B0000]');
      } else {
        indicator.classList.remove('bg-[#8B0000]', 'bg-[#a30000]', 'text-white');
        indicator.classList.add('bg-stone-200', 'text-stone-600');
      }
    }
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function updateStep3Summary() {
  const summaryPet = document.getElementById('modal-summary-pet');
  const summaryServices = document.getElementById('modal-summary-services');
  const summaryDate = document.getElementById('modal-summary-date');

  if (summaryPet) {
    summaryPet.textContent = bookingState.petName + ' (' + bookingState.petType + (bookingState.petBreed && bookingState.petBreed !== 'Não informada' ? ' • ' + bookingState.petBreed : '') + ')';
  }
  if (summaryServices) {
    summaryServices.textContent = bookingState.services.join(', ');
  }
  if (summaryDate) {
    const parts = bookingState.date.split('-');
    const formattedDate = parts.length === 3 ? parts[2] + '/' + parts[1] + '/' + parts[0] : bookingState.date;
    summaryDate.textContent = formattedDate + ' • ' + bookingState.period;
  }
}

function openBookingModalWithData(calcData) {
  bookingState.petType = calcData.petLabel;
  bookingState.services = calcData.services;
  bookingState.estimatedTotal = 'R$ ' + calcData.price;

  const petTypeSelect = document.getElementById('modal-pet-type-select');
  if (petTypeSelect) {
    petTypeSelect.value = calcData.petKey.startsWith('dog') ? 'Cão' : 'Gato';
  }

  // Pre-select in modal
  const serviceSelect = document.getElementById('modal-service-select');
  if (serviceSelect && calcData.services && calcData.services.length > 0) {
    const firstServ = calcData.services[0];
    for (let opt of serviceSelect.options) {
      if (opt.value.toLowerCase().includes(firstServ.toLowerCase()) || firstServ.toLowerCase().includes(opt.value.toLowerCase())) {
        serviceSelect.value = opt.value;
        break;
      }
    }
  }

  const wizard = document.getElementById('modal-wizard-container');
  const success = document.getElementById('modal-success-screen');
  if (wizard && success) {
    wizard.classList.remove('hidden');
    success.classList.add('hidden');
  }

  openModal();
  showToast('Orçamento Carregado', 'Seus serviços e estimativa foram importados para o agendamento!', 'check-circle');
}

function finishAndRedirectWhatsApp() {
  const code = 'VET-' + Math.floor(1000 + Math.random() * 9000);

  // Format date YYYY-MM-DD to DD/MM/YYYY
  const parts = bookingState.date.split('-');
  const formattedDate = parts.length === 3 ? parts[2] + '/' + parts[1] + '/' + parts[0] : bookingState.date;

  const currentService = (bookingState.services[0] || 'Atendimento Geral');
  const s = currentService.toLowerCase();

  let headerIcon = '🐾';
  let title = 'SOLICITAÇÃO DE ATENDIMENTO';
  let intro = 'Olá! Vim pelo site da clínica e gostaria de verificar disponibilidade para o meu pet:';
  let serviceField = 'Serviço Desejado';

  if (s.includes('consulta')) {
    headerIcon = '🩺';
    title = 'AGENDAMENTO DE CONSULTA VETERINÁRIA';
    intro = 'Olá! Vim pelo site da clínica e gostaria de agendar uma consulta para o meu pet:';
    serviceField = 'Consulta Clínica';
  } else if (s.includes('vacina')) {
    headerIcon = '💉';
    title = 'AGENDAMENTO DE VACINAÇÃO';
    intro = 'Olá! Vim pelo site da clínica e gostaria de agendar a vacinação do meu pet:';
    serviceField = 'Vacinação';
  } else if (s.includes('exame')) {
    headerIcon = '🔬';
    title = 'SOLICITAÇÃO DE EXAMES E DIAGNÓSTICO';
    intro = 'Olá! Vim pelo site da clínica e gostaria de orientações / agendamento de exames:';
    serviceField = 'Exames Solicitados';
  } else if (s.includes('cirurgi')) {
    headerIcon = '🏥';
    title = 'AVALIAÇÃO CIRÚRGICA VETERINÁRIA';
    intro = 'Olá! Vim pelo site da clínica e gostaria de agendar uma avaliação cirúrgica:';
    serviceField = 'Procedimento Cirúrgico';
  } else if (s.includes('interna')) {
    headerIcon = '🏨';
    title = 'SUPORTE E INTERNAÇÃO MONITORADA';
    intro = 'Olá! Vim pelo site da clínica e preciso de suporte / informações de internação:';
    serviceField = 'Internação';
  } else if (s.includes('banho') || s.includes('tosa')) {
    headerIcon = '✨';
    title = 'AGENDAMENTO DE BANHO & TOSA';
    intro = 'Olá! Vim pelo site da clínica e gostaria de agendar estética animal para o meu pet:';
    serviceField = 'Estética Animal';
  } else if (s.includes('pet shop')) {
    headerIcon = '🛍️';
    title = 'CONSULTA DE ITENS PET SHOP';
    intro = 'Olá! Vim pelo site da clínica e gostaria de verificar disponibilidade de produtos:';
    serviceField = 'Produtos de Interesse';
  } else if (s.includes('raç') || s.includes('rac')) {
    headerIcon = '🥣';
    title = 'CONSULTA DE RAÇÕES E NUTRIÇÃO';
    intro = 'Olá! Vim pelo site da clínica e gostaria de consultar rações e nutrição premium:';
    serviceField = 'Nutrição / Rações';
  }

  const notesText = (bookingState.notes && bookingState.notes !== 'Nenhuma observação informada')
    ? '\n📝 *Observações/Sintomas:* ' + bookingState.notes
    : '';

  const priceText = (bookingState.estimatedTotal && bookingState.estimatedTotal !== 'R$ 85')
    ? '\n💰 *Estimativa do Simulador:* ' + bookingState.estimatedTotal
    : '';

  const msg =
headerIcon + ' *' + title + '* ' + headerIcon + '\n' +
'*Protocolo:* #' + code + '\n\n' +
intro + '\n\n' +
'👤 *Tutor(a):* ' + bookingState.tutorName + '\n' +
'📱 *WhatsApp:* ' + bookingState.tutorPhone + '\n' +
'🐶 *Pet:* ' + bookingState.petName + ' (' + bookingState.petType + (bookingState.petBreed && bookingState.petBreed !== 'Não informada' ? ', Raça: ' + bookingState.petBreed : '') + ')\n' +
'✨ *Comportamento:* ' + bookingState.petBehavior + '\n\n' +
'📅 *Data Preferencial:* ' + formattedDate + ' (' + bookingState.period + ')\n' +
'📋 *' + serviceField + ':* ' + bookingState.services.join(', ') + notesText + priceText + '\n\n' +
'Aguardo a confirmação da equipe. Muito obrigado(a)!';

  const encodedMsg = encodeURIComponent(msg);
  const whatsappUrl = 'https://wa.me/5561999233249?text=' + encodedMsg;

  // Show Success Step
  const content = document.getElementById('modal-success-screen');
  const wizard = document.getElementById('modal-wizard-container');
  const codeEl = document.getElementById('modal-success-code');
  const btnWa = document.getElementById('btn-wa-confirm');

  if (codeEl) codeEl.textContent = '#' + code;
  if (btnWa) {
    btnWa.setAttribute('href', whatsappUrl);
    btnWa.setAttribute('target', '_blank');
  }

  if (wizard && content) {
    wizard.classList.add('hidden');
    content.classList.remove('hidden');
  }

  showToast('Agendamento Pronto!', 'Clique no botão para abrir o WhatsApp e confirmar.', 'sparkles');
}

/* ==========================================================================
   8. NEWSLETTER & COUPON COPY
   ========================================================================== */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  const emailInput = document.getElementById('newsletter-email');

  if (form && emailInput) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!emailInput.value.includes('@')) {
        showToast('E-mail Inválido', 'Insira um e-mail válido para receber o cupom.', 'alert-circle');
        return;
      }

      showToast('Cupom Ativado! 🎉', 'Código BEMVINDO15 copiado! 15% OFF no primeiro banho.', 'gift');
      emailInput.value = '';
      navigator.clipboard?.writeText('BEMVINDO15').catch(() => { });
    });
  }
}

/* ==========================================================================
   9. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(title, message, iconName = 'bell') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-notice glass-card pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border border-[#075da9]/15 shadow-2xl bg-white/95 text-[#12253b]';

  toast.innerHTML = `
    <div class="w-10 h-10 rounded-xl bg-[#075da9]/10 text-[#075da9] flex items-center justify-center shrink-0">
      <i data-lucide="${iconName}" class="w-5 h-5"></i>
    </div>
    <div class="flex-1">
      <h4 class="font-bold text-sm text-[#074883]">${title}</h4>
      <p class="text-xs text-stone-600 mt-0.5 leading-relaxed">${message}</p>
    </div>
    <button class="text-stone-400 hover:text-stone-700 toast-close-btn">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;

  toastContainer.appendChild(toast);

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Animation show
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  const closeToast = () => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 350);
  };

  toast.querySelector('.toast-close-btn')?.addEventListener('click', closeToast);

  // Auto remove after 5s
  setTimeout(closeToast, 5000);
}


window.addEventListener('load', () => {
  initIcons();
});
