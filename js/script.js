// ====================================================================
// A) DOM ELEMENT REFERENCES
// ====================================================================

// Get all the DOM elements we'll be interacting with.
// This is done outside of any function to ensure they are accessible globally.
// We use 'const' since these references don't change.
const welcomeModal = document.getElementById('welcomeModal');
const userNameInput = document.getElementById('userName');
const submitBtn = document.getElementById('submitName');
const userNameDisplay = document.getElementById('userNameDisplay');

const messageForm = document.getElementById('messageForm');
const subscribeForm = document.getElementById('subscribeForm');
const successModal = document.getElementById('successModal');
const submittedData = document.getElementById('submittedData');
const closeModal = document.getElementById('closeModal');
const messageFormName = document.getElementById('name');

const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

const buyTab = document.getElementById('buy-tab');
const sellTab = document.getElementById('sell-tab');
const rentTab = document.getElementById('rent-tab');
const tabs = [buyTab, sellTab, rentTab];

const slider = document.getElementById('propertySlider');
const scrollLeftBtn = document.getElementById('scrollLeftBtn');
const scrollRightBtn = document.getElementById('scrollRightBtn');


// ====================================================================
// B) UTILITY FUNCTIONS
// ====================================================================

// --- 1. Message Utility ---
function displayMessage(message, type = "info") {
  if (document.querySelector('.message-box-container')) {
    return;
  }
  const parentContainer = document.createElement('div');
  parentContainer.classList.add('message-box-container', 'max-h-[50px]', 'fixed', 'inset-0', 'flex', 'items-start', 'justify-center', 'z-50');

  const messageBox = document.createElement('div');
  messageBox.classList.add(
    'bg-white', 'p-4', 'rounded-lg', 'shadow-lg', 'text-white',
    'duration-500', 'scale-0', 'transform', 'mt-4'
  );

  if (type === "error") {
    messageBox.classList.add('bg-red-500');
  } else if (type === "success") {
    messageBox.classList.add('bg-green-500');
  }

  messageBox.textContent = message;

  parentContainer.appendChild(messageBox);
  document.body.appendChild(parentContainer);

  setTimeout(() => {
    messageBox.classList.remove('scale-0');
    messageBox.classList.add('scale-100');
  }, 10);

  setTimeout(() => {
    messageBox.classList.remove('scale-100');
    messageBox.classList.add('scale-0');
    messageBox.addEventListener('transitionend', () => parentContainer.remove());
  }, 3000);
}

// --- 2. Data Parsing & Enhancement ---
function parsePrice(priceString) {
  return parseInt(priceString.replace(/[^0-9]/g, ''), 10);
}

function determineUnitType(title) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('apartment')) return 'Apartment';
  if (lowerTitle.includes('house')) return 'House';
  if (lowerTitle.includes('commercial')) return 'Commercial';
  return 'Other';
}

// Data for the property slider
const properties = [
  { id: 1, image: 'img/popular-1.png', title: 'Modern Apartment', price: '$350,000', location: 'Jakarta, Indonesia' },
  { id: 2, image: 'img/popular-2.png', title: 'Family House', price: '$500,000', location: 'Bandung, Indonesia' },
  { id: 3, image: 'img/popular-3.png', title: 'Cozy Commercial', price: '$250,000', location: 'Jakarta, Indonesia' },
  { id: 4, image: 'img/popular-4.png', title: 'Luxury Commercial', price: '$1,200,000', location: 'Bandung, Indonesia' },
  { id: 5, image: 'img/popular-5.jpg', title: 'The Commercial Property', price: '$100,000', location: 'Sleman, Yogyakarta' },
];

const enhancedProperties = properties.map(p => ({
  ...p,
  numericPrice: parsePrice(p.price),
  type: determineUnitType(p.title)
}));


// ====================================================================
// C) HANDLERS & EVENT LISTENERS
// ====================================================================

// --- 1. Welcome Modal & User Logic ---
function initWelcomeModal() {
  const savedName = localStorage.getItem('userName');
  if (savedName) {
    welcomeModal.style.display = 'none';
    userNameDisplay.textContent = savedName;
    if (messageFormName) messageFormName.value = savedName;
  } else {
    welcomeModal.style.display = 'flex';
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const name = userNameInput.value.trim();
      if (name) {
        localStorage.setItem('userName', name);
        welcomeModal.style.display = 'none';
        userNameDisplay.textContent = name;
        if (messageFormName) messageFormName.value = name;
      } else {
        displayMessage("Please input your name...", "error");
        userNameInput.focus();
      }
    });
  }
}

// --- 2. Message Form Logic ---
function handleMessageFormSubmit(e) {
  e.preventDefault();

  const fullNameInput = document.getElementById('full-name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone-number');
  const messageInput = document.getElementById('message');

  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const message = messageInput.value.trim();

  // Validation
  if (!fullName) { displayMessage("Please enter your full name.", "error"); fullNameInput.focus(); return; }
  if (!email) { displayMessage("Please enter your email address.", "error"); emailInput.focus(); return; }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) { displayMessage("Please enter a valid email address.", "error"); emailInput.focus(); return; }
  if (phone && !/^\d+$/.test(phone)) { displayMessage("Please enter a valid phone number (digits only).", "error"); phoneInput.focus(); return; }
  if (!message) { displayMessage("Please enter your message.", "error"); messageInput.focus(); return; }

  // If valid, process submission
  const formData = {
    name: localStorage.getItem('userName') || fullName,
    email: email,
    phone: phone,
    message: message
  };

  if (submittedData) {
    submittedData.innerHTML = `
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone:</strong> ${formData.phone || 'N/A'}</p>
      <p><strong>Message:</strong> ${formData.message}</p>
    `;
  }

  displayMessage("Message submitted successfully!", "success");
  messageForm.reset();
  if (successModal) successModal.classList.remove('hidden');
}

// --- 3. Subscribe Form Logic ---
function handleSubscribeFormSubmit(e) {
  e.preventDefault();

  const subscribeEmailInput = subscribeForm.querySelector('input[type="email"]');
  const email = subscribeEmailInput.value.trim();

  // Validation
  if (!email) {
    displayMessage("Please enter your email address.", "error");
    subscribeEmailInput.focus();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    displayMessage("Please enter a valid email address.", "error");
    subscribeEmailInput.focus();
    return;
  }

  // If valid, process submission
  // You can send this data to a server or just confirm to the user
  console.log('Subscribe form submitted with email:', email);
  displayMessage("Thank you for subscribing!", "success");
  subscribeForm.reset();
}

// --- 4. Close Modal Logic ---
function handleCloseModal() {
  if (successModal) successModal.classList.add('hidden');
  messageForm.reset();
  localStorage.removeItem('userName');
  document.documentElement.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    location.reload();
  }, 1500);
}

// --- 5. Mobile Menu Logic ---
function initMobileMenu() {
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', (event) => {
      event.stopPropagation();
      mobileMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (event) => {
      const isMenuOpen = !mobileMenu.classList.contains('hidden');
      const isClickInsideMenu = mobileMenu.contains(event.target);
      const isClickOnButton = mobileMenuButton.contains(event.target);

      if (isMenuOpen && !isClickInsideMenu && !isClickOnButton) {
        mobileMenu.classList.add('hidden');
      }
    });
  }
}

// --- 6. Tab Switching Logic ---
function initTabSwitching() {
  tabs.forEach(tabElement => {
    tabElement.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('search-tab-active', 'text-white');
        t.classList.add('bg-white', 'text-gray-600', 'hover:bg-gray-100');
      });
      tabElement.classList.add('search-tab-active', 'text-white');
      tabElement.classList.remove('bg-white', 'text-gray-600', 'hover:bg-gray-100');
    });
  });
}

// --- 7. Property Slider Logic ---
function renderProperties() {
  if (!slider) return;
  slider.innerHTML = '';
  enhancedProperties.forEach(property => {
    const propertyCard = document.createElement('div');
    propertyCard.className = 'flex-none w-[300px] md:w-[390px] bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 snap-center overflow-hidden';
    propertyCard.innerHTML = `
      <div class="relative">
        <img
          src="${property.image}"
          alt="${property.title}"
          class="h-[400px] sm:h-[460px] w-full object-cover"
          onerror="this.onerror=null;this.src='https://placehold.co/400x460/e0e0e0/333333?text=Image+Error';"
        />
        <div class="absolute bottom-3 left-3 right-3 bg-white rounded-xl px-4 py-3 shadow">
          <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-1 truncate">
            ${property.title}
          </h2>
          <p class="text-sm text-gray-600 flex items-center mb-1">
            <i class="fas fa-map-marker-alt text-gray-500 mr-1"></i>
            ${property.location}
          </p>
          <p class="font-bold text-lg text-orange-600">${property.price}</p>
        </div>
      </div>
    `;
    slider.appendChild(propertyCard);
  });
}

function scrollLeft() {
  if (slider) {
    const firstCard = slider.querySelector('.flex-none');
    let scrollAmount = 324;
    if (firstCard) {
      const cardWidth = firstCard.offsetWidth;
      const parentGapStyle = getComputedStyle(firstCard.parentNode).getPropertyValue('gap');
      const gapMatch = parentGapStyle.match(/(\d+)px/);
      const gap = gapMatch ? parseFloat(gapMatch[1]) : 0;
      scrollAmount = cardWidth + gap;
    }
    slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }
}

function scrollRight() {
  if (slider) {
    const firstCard = slider.querySelector('.flex-none');
    let scrollAmount = 324;
    if (firstCard) {
      const cardWidth = firstCard.offsetWidth;
      const parentGapStyle = getComputedStyle(firstCard.parentNode).getPropertyValue('gap');
      const gapMatch = parentGapStyle.match(/(\d+)px/);
      const gap = gapMatch ? parseFloat(gapMatch[1]) : 0;
      scrollAmount = cardWidth + gap;
    }
    slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}

// ====================================================================
// D) MAIN INITIALIZATION (DOMContentLoaded)
// ====================================================================

// This is the main entry point of your script
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all functions
  initWelcomeModal();
  initMobileMenu();
  initTabSwitching();

  // Attach event listeners for the message form and success modal
  if (messageForm) {
    messageForm.addEventListener('submit', handleMessageFormSubmit);
  }
  if (closeModal) {
    closeModal.addEventListener('click', handleCloseModal);
  }

  // Attach the event listener for the subscribe form
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', handleSubscribeFormSubmit);
  }

  // Initialize the property slider
  renderProperties();
  if (scrollLeftBtn) {
    scrollLeftBtn.addEventListener('click', scrollLeft);
  }
  if (scrollRightBtn) {
    scrollRightBtn.addEventListener('click', scrollRight);
  }
});