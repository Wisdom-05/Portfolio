/* ================================================================
   SCRIPT.JS — Portfolio Website JavaScript
   Author: John Wisdom Deguit

   This file handles all the interactive behavior of the website.
   Each section is clearly explained for learning purposes.

   FEATURES:
   1. Navbar scroll effect & active link highlighting
   2. Mobile hamburger menu
   3. Typing animation in the hero section
   4. Scroll animations (fade-in on scroll)
   5. Skill progress bar animation
   6. Contact form handling
   7. Back-to-top button
   8. Auto-updating copyright year
   ================================================================ */


/* ================================================================
   HELPER: Wait for the page to fully load before running any code.
   'DOMContentLoaded' fires when the HTML is parsed and ready.
   ================================================================ */
document.addEventListener('DOMContentLoaded', function () {

  // ── Grab references to elements we'll use throughout the script ──
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');
  const yearSpan = document.getElementById('year');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');


  /* ==============================================================
     1. NAVBAR SCROLL EFFECT
     When the user scrolls down more than 50px:
     - The navbar gets a solid/blurred background (via CSS class)
     When the user scrolls back to the top:
     - The navbar becomes transparent again
     ============================================================== */
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Run once on load and then on every scroll event
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll);


  /* ==============================================================
     2. ACTIVE NAV LINK HIGHLIGHTING
     As the user scrolls through sections, the corresponding nav
     link gets the 'active' class (which adds an underline).

     How it works:
     - We define which sections exist
     - On each scroll, we check which section is currently visible
     - We highlight that section's nav link
     ============================================================== */
  function updateActiveNavLink() {
    // All section IDs that correspond to nav links
    const sections = ['home', 'about', 'skills', 'projects', 'contact'];
    let currentSection = 'home';

    sections.forEach(function (id) {
      const section = document.getElementById(id);
      if (!section) return;

      // getBoundingClientRect gives the element's position relative to viewport
      const rect = section.getBoundingClientRect();

      // If the top of the section is within the upper half of the screen
      if (rect.top <= window.innerHeight / 2) {
        currentSection = id;
      }
    });

    // Remove 'active' from all nav links
    allNavLinks.forEach(function (link) {
      link.classList.remove('active');
    });

    // Add 'active' to the matching nav link (using href attribute)
    const activeLink = document.querySelector('.nav-link[href="#' + currentSection + '"]');
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink(); // Run once on load


  /* ==============================================================
     3. MOBILE HAMBURGER MENU
     Clicking the hamburger button toggles the mobile menu open/closed.
     We add/remove CSS classes that control visibility.
     ============================================================== */
  hamburger.addEventListener('click', function () {
    // Toggle the 'open' class on both hamburger and nav links
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close the mobile menu when a nav link is clicked
  allNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });


  /* ==============================================================
     4. TYPING ANIMATION
     This simulates a "typewriter" effect by adding one character
     at a time to the text, then deleting it and typing the next string.

     HOW TO CUSTOMIZE:
     - Add or remove phrases from the 'phrases' array below
     ============================================================== */
  const typedTextSpan = document.getElementById('typed-text');

  // The phrases to cycle through
  const phrases = [
    'Aspiring Web Developer',
    'IT Student',
    'Problem Solver',
    'QA Enthusiast',
    'Future Software Developer',
  ];

  let phraseIndex = 0; // Which phrase we're on
  let charIndex = 0; // Which character within the phrase
  let isDeleting = false; // Whether we're currently deleting

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      // Remove one character
      typedTextSpan.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Add one character
      typedTextSpan.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    // Determine the next delay
    let delay = isDeleting ? 60 : 100; // Delete faster than typing

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Finished typing → wait 1.5 seconds before deleting
      delay = 1500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting → move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length; // Loop back to start
      delay = 400; // Small pause before typing next phrase
    }

    setTimeout(typeEffect, delay);
  }

  // Start the typing animation
  typeEffect();


  /* ==============================================================
     5. SCROLL ANIMATION (Intersection Observer)
     Elements with the class 'observe-me' will fade in when they
     become visible in the viewport.

     The IntersectionObserver API is a modern way to detect when
     an element enters or exits the visible area of the screen.
     ============================================================== */

  // Add 'observe-me' class to the elements we want to animate
  const animatableSelectors = [
    '.skill-card',
    '.project-card',
    '.stat-card',
    '.contact-item',
    '.about-content',
    '.section-header',
  ];

  animatableSelectors.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.classList.add('observe-me');
      el.style.opacity = '0'; // Hidden initially
    });
  });

  // Create the observer
  const fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry, index) {
        if (entry.isIntersecting) {
          // Add a small staggered delay based on position in the list
          const delay = (index % 4) * 100; // ms
          setTimeout(function () {
            entry.target.classList.add('animate-in');
            entry.target.style.opacity = '1';
          }, delay);

          // Stop observing once animated (only animate once)
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15, // Trigger when 15% of element is visible
      rootMargin: '0px 0px -40px 0px', // Trigger slightly before element fully enters
    }
  );

  // Observe all elements we marked
  document.querySelectorAll('.observe-me').forEach(function (el) {
    fadeObserver.observe(el);
  });


  /* ==============================================================
     6. SKILL PROGRESS BAR ANIMATION
     When a skill card enters the viewport, its progress bar
     animates from 0% to its target value (set via CSS variable).
     ============================================================== */
  const skillProgressBars = document.querySelectorAll('.skill-progress');

  const barObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const bar = entry.target;
          // Get the target percentage from the inline CSS variable
          // e.g. style="--progress: 70%;"
          const targetWidth = getComputedStyle(bar).getPropertyValue('--progress').trim();
          // Apply it to the width property (the CSS transition does the animation)
          bar.style.width = targetWidth;
          barObserver.unobserve(bar); // Only animate once
        }
      });
    },
    { threshold: 0.5 }
  );

  skillProgressBars.forEach(function (bar) {
    barObserver.observe(bar);
  });


  /* ==============================================================
     7. CONTACT FORM — REAL EMAIL SENDING via EmailJS
     ─────────────────────────────────────────────────────────────
     EmailJS lets you send emails straight from browser JavaScript
     with NO backend server needed. It's free for up to 200 emails/month.

     ✅ SETUP STEPS (do this once, takes ~5 minutes):
     ─────────────────────────────────────────────────
     1. Go to https://www.emailjs.com and click "Sign Up Free"
     2. Add a Gmail service:
        Dashboard → Email Services → Add New Service → Gmail
        → Connect your johnwisdomdeguit@gmail.com account → Copy the "Service ID"
     3. Create an email template:
        Dashboard → Email Templates → Create New Template
        Paste this template content:
        ───────────────────────────────────────────
        Subject:  New Portfolio Message from {{from_name}}
        Body:
          Name:    {{from_name}}
          Email:   {{from_email}}
          Subject: {{subject}}
          Message: {{message}}
        ───────────────────────────────────────────
        Set "To Email" to: johnwisdomdeguit@gmail.com
        → Save → Copy the "Template ID"
     4. Get your Public Key:
        Dashboard → Account → General → Public Key → Copy it
     5. Paste the three values into the constants below ↓
     ============================================================== */

  // ── ⚠️  PASTE YOUR EMAILJS CREDENTIALS HERE ──────────────────
  const EMAILJS_SERVICE_ID = 'service_3k5i4qd';   // e.g. 'service_abc123'
  const EMAILJS_TEMPLATE_ID = 'template_8439xqu';  // e.g. 'template_xyz456'
  const EMAILJS_PUBLIC_KEY = 'Ac9Ssz_wyW9Vl9mQq';   // e.g. 'aBcDeFgHiJkLmNoPq'
  // ─────────────────────────────────────────────────────────────

  // Initialize EmailJS with your public key (always runs)
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault(); // Stop the page from reloading

      const submitBtn = document.getElementById('submit-btn');

      // Read form field values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      // ── Basic Validation ──────────────────────────────────────
      if (!name || !email || !message) {
        showFormStatus('error', '⚠️ Please fill in your Name, Email, and Message.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormStatus('error', '⚠️ Please enter a valid email address.');
        return;
      }

      // ── Check if EmailJS credentials have been set ────────────
      if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
        showFormStatus('error',
          '⚙️ Email not configured yet. See the setup steps in script.js to connect EmailJS.'
        );
        return;
      }

      // ── Loading state on the button ───────────────────────────
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      // ── Build the template parameters ─────────────────────────
      // These variable names must match the {{placeholders}} in your EmailJS template
      const templateParams = {
        from_name: name,
        from_email: email,
        subject: subject || '(No subject)',
        message: message,
        to_email: 'johnwisdomdeguit@gmail.com',
      };

      // ── Send the email via EmailJS ────────────────────────────
      emailjs
        .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function () {
          // SUCCESS ✅
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          contactForm.reset();
          showFormStatus('success',
            '✅ Message sent! I\'ll get back to you at ' + email + ' soon.'
          );
        })
        .catch(function (error) {
          // ERROR ❌
          console.error('EmailJS error:', error);
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          showFormStatus('error',
            '❌ Oops! Something went wrong. Please email me directly at johnwisdomdeguit@gmail.com'
          );
        });
    });
  }

  /**
   * Helper function to show the form status message.
   * @param {string} type - 'success' or 'error'
   * @param {string} message - The message to display
   */
  function showFormStatus(type, message) {
    formStatus.textContent = message;
    formStatus.className = 'form-status ' + type; // Set the visual style

    // Auto-hide after 5 seconds
    setTimeout(function () {
      formStatus.className = 'form-status';
      formStatus.textContent = '';
    }, 5000);
  }


  /* ==============================================================
     8. BACK-TO-TOP BUTTON
     Shows a floating button when the user scrolls down 400px.
     Clicking it smoothly scrolls back to the top of the page.
     ============================================================== */
  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTop);

  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ==============================================================
     9. AUTO-UPDATE COPYRIGHT YEAR
     Automatically sets the year in the footer so you never have
     to manually update it each year.
     ============================================================== */
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }


  /* ==============================================================
     10. SMOOTH SCROLL FOR ANCHOR LINKS
     This ensures all links pointing to page sections (like #about)
     scroll smoothly. The CSS 'scroll-behavior: smooth' handles most
     cases, but this JS handles edge cases in some browsers.
     ============================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      const targetId = this.getAttribute('href');

      // '#' alone means scroll to top; don't prevent that
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


}); // End of DOMContentLoaded
