// Vecturo Main JavaScript Engine
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMenuBtn = document.getElementById('close-mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      document.body.classList.toggle('overflow-hidden');
    });
  }

  if (closeMenuBtn && mobileMenu) {
    closeMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    });
  }

  // Close mobile menu on link click
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) {
        mobileMenu.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    });
  });

  // Sticky Navbar Blur and Shadow on Scroll
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-sm');
        header.classList.remove('bg-transparent');
      } else {
        header.classList.remove('bg-white/95', 'shadow-sm');
        header.classList.add('bg-transparent');
      }
    });
  }

  // Active Link Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('text-[#00D4B2]', 'font-semibold');
      link.classList.remove('text-slate-600');
    }
  });

  // Global Toast Notification Helper
  window.showToast = function(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white font-medium text-sm transition-all duration-300 transform translate-y-10 opacity-0 ${
      type === 'success' ? 'bg-[#0A2540] border border-[#00D4B2]' : 'bg-red-600'
    }`;
    toast.innerHTML = `
      <span class="w-2.5 h-2.5 rounded-full ${type === 'success' ? 'bg-[#00D4B2]' : 'bg-white'}"></span>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-y-10', 'opacity-0');
    }, 50);

    // Animate out
    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  // Newsletter / Lead capture form handler
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        window.showToast(`Thank you! Free local audit guide sent to ${emailInput.value}`);
        emailInput.value = '';
      }
    });
  });
});
