document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // JavaScript to handle tab switching for the search form
  const buyTab = document.getElementById('buy-tab');
  const sellTab = document.getElementById('sell-tab');
  const rentTab = document.getElementById('rent-tab');
  const tabs = [buyTab, sellTab, rentTab];
  let activeTab = 'Buy'; // Track active tab for modal

  tabs.forEach(tabElement => {
    tabElement.addEventListener('click', () => {
      // Set all tabs to inactive state first
      tabs.forEach(t => {
        t.classList.remove('search-tab-active');
        t.classList.remove('text-white');
        t.classList.add('bg-white', 'text-gray-600', 'hover:bg-gray-100');
      });

      // Set the clicked tab to active state
      tabElement.classList.add('search-tab-active', 'text-white');
      tabElement.classList.remove('bg-white', 'text-gray-600', 'hover:bg-gray-100');

      // Update active tab
      if (tabElement === buyTab) activeTab = 'Buy';
      else if (tabElement === sellTab) activeTab = 'Sell';
      else if (tabElement === rentTab) activeTab = 'Rent';
    });
  });

  // --- Utility functions for data processing ---

  // Function to parse price string to a number (e.g., "$350,000" -> 350000)
  function parsePrice(priceString) {
    return parseInt(priceString.replace(/[^0-9]/g, ''), 10);
  }

  // Function to determine unit type from property title
  function determineUnitType(title) {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('apartment')) return 'Apartment';
    if (lowerTitle.includes('house')) return 'House';
    if (lowerTitle.includes('commercial')) return 'Commercial'; // If you add commercial properties
    return 'Other'; // Default or fallback type
  }

  // --- Property Slider Data ---
  const properties = [
    { id: 1, image: 'img/popular-1.png', title: 'Modern Apartment', price: '$350,000', location: 'Jakarta, Indonesia' },
    { id: 2, image: 'img/popular-2.png', title: 'Family House', price: '$500,000', location: 'Bandung, Indonesia' },
    { id: 3, image: 'img/popular-3.png', title: 'Cozy Commercial', price: '$250,000', location: 'Jakarta, Indonesia' },
    { id: 4, image: 'img/popular-4.png', title: 'Luxury Commercial', price: '$1,200,000', location: 'Bandung, Indonesia' },
    { id: 5, image: 'img/popular-5.jpg', title: 'The Commercial Property', price: '$100,000', location: 'Sleman, Yogyakarta' },    
  ];

  // Enhance properties with numeric price and determined type for filtering
  const enhancedProperties = properties.map(p => ({
    ...p,
    numericPrice: parsePrice(p.price),
    type: determineUnitType(p.title)
  }));

  // Property Slider (remains largely the same, but uses enhancedProperties)
  const slider = document.getElementById('propertySlider');
  const scrollLeftBtn = document.getElementById('scrollLeftBtn');
  const scrollRightBtn = document.getElementById('scrollRightBtn');

  // Function to render properties into the slider
  function renderProperties() {
    if (!slider) return; // Exit if slider element not found

    slider.innerHTML = ''; // Clear existing content
    enhancedProperties.forEach(property => { // Use enhancedProperties for slider too
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

  // Function to scroll the slider left
  const scrollLeft = () => {
    if (slider) {
      const firstCard = slider.querySelector('.flex-none');
      let scrollAmount = 324; // Default value

      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const parentGapStyle = getComputedStyle(firstCard.parentNode).getPropertyValue('gap');
        const gapMatch = parentGapStyle.match(/(\d+)px/);
        const gap = gapMatch ? parseFloat(gapMatch[1]) : 0;
        scrollAmount = cardWidth + gap;
      }

      slider.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Function to scroll the slider right
  const scrollRight = () => {
    if (slider) {
      const firstCard = slider.querySelector('.flex-none');
      let scrollAmount = 324; // Default value

      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const parentGapStyle = getComputedStyle(firstCard.parentNode).getPropertyValue('gap');
        const gapMatch = parentGapStyle.match(/(\d+)px/);
        const gap = gapMatch ? parseFloat(gapMatch[1]) : 0;
        scrollAmount = cardWidth + gap;
      }

      slider.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Attach event listeners for scrolling
  if (scrollLeftBtn) {
    scrollLeftBtn.addEventListener('click', scrollLeft);
  }
  if (scrollRightBtn) {
    scrollRightBtn.addEventListener('click', scrollRight);
  }

  // Initial render of properties when the DOM is ready
  renderProperties();
});
