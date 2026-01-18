// premium script.js

// Function to implement smooth scrolling
function smoothScroll(target) {
  const element = document.querySelector(target);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Dynamic animations using Intersection Observer API
const observerOptions = {
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    } else {
      entry.target.classList.remove('animate');
    }
  });
}, observerOptions);

// Apply observer to elements
const animatedElements = document.querySelectorAll('.animate-on-scroll');
animatedElements.forEach((el) => observer.observe(el));

// Form handling with validation
function validateForm(form) {
  const inputs = form.querySelectorAll('input, textarea');
  let valid = true;

  inputs.forEach((input) => {
    if (!input.value) {
      valid = false;
      input.classList.add('error');
    } else {
      input.classList.remove('error');
    }
  });
  return valid;
}

// Event Listener for form submission
document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault();
  if (validateForm(this)) {
    // Process form submission here
    console.log('Form submitted!');
  }
});

// Interactive elements
document.querySelectorAll('.toggle').forEach(element => {
  element.addEventListener('click', () => {
    element.classList.toggle('active');
    const content = element.nextElementSibling;
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
  });
});

// Performance optimization: Debouncing scroll event
let timeout;
window.addEventListener('scroll', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    // Handle scroll events here, e.g., lazy load images or perform animations
  }, 200);
});
