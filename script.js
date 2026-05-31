/* ================================================================
   SCRIPT.JS — Vivekananda Diagnostics and Medical Research
   Simple, beginner-friendly JavaScript
   No data is sent to any server. Everything stays on your laptop.
   ================================================================ */


/* ================================================================
   1. RUN EVERYTHING AFTER THE PAGE FULLY LOADS
      This wrapper makes sure our code runs only after all the
      HTML elements are ready on the page.
   ================================================================ */
document.addEventListener("DOMContentLoaded", function () {

  /* ==============================================================
     2. MOBILE MENU TOGGLE
        When the hamburger button is clicked, show or hide the
        navigation links on small screens.
  ============================================================== */

  // Get the hamburger button and the nav menu from the HTML
  var hamburger = document.getElementById("hamburger");
  var mainNav   = document.getElementById("main-nav");

  // Only run this code if both elements exist on the page
  if (hamburger && mainNav) {

    hamburger.addEventListener("click", function () {

      // Toggle the "open" class on both elements
      // CSS uses this class to show/hide the menu and animate the icon
      hamburger.classList.toggle("open");
      mainNav.classList.toggle("open");

    });

    // Close the mobile menu when any nav link is clicked
    // This gives a clean experience — menu closes after navigation
    var navLinks = mainNav.querySelectorAll(".nav-link");

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        hamburger.classList.remove("open");
        mainNav.classList.remove("open");
      });
    });

  }


  /* ==============================================================
     3. STICKY HEADER — ADD SHADOW ON SCROLL
        When the user scrolls down, add a shadow to the header
        so it stands out from the page content.
  ============================================================== */

  var siteHeader = document.getElementById("site-header");

  if (siteHeader) {

    window.addEventListener("scroll", function () {

      // If user has scrolled more than 60 pixels down
      if (window.scrollY > 60) {
        siteHeader.style.boxShadow = "0 4px 24px rgba(15, 111, 115, 0.18)";
      } else {
        siteHeader.style.boxShadow = "0 2px 16px rgba(15, 111, 115, 0.10)";
      }

    });

  }


  /* ==============================================================
     4. ACTIVE NAV LINK HIGHLIGHT
        As the user scrolls, highlight the nav link that matches
        the section currently visible on screen.
  ============================================================== */

  // List all the sections that have matching nav links
  var sections = document.querySelectorAll("section[id], footer[id]");
  var navLinkItems = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", function () {

    var currentSectionId = "";

    // Check each section — find the one currently in view
    sections.forEach(function (section) {
      var sectionTop = section.offsetTop - 100; // 100px offset for header height
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute("id");
      }
    });

    // Remove "active" from all links, then add it to the matching one
    navLinkItems.forEach(function (link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentSectionId) {
        link.classList.add("active");
      }
    });

  });


  /* ==============================================================
     5. SMOOTH SCROLLING FOR NAV LINKS
        When a nav link is clicked, scroll smoothly to that section
        instead of jumping instantly.
        Note: CSS already handles this via scroll-behavior: smooth,
        but this JS version also accounts for the sticky header height.
  ============================================================== */

  var allNavLinks = document.querySelectorAll('a[href^="#"]');

  allNavLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

      var targetId = link.getAttribute("href"); // e.g. "#about"

      // Make sure it's a real section link (not just "#")
      if (targetId === "#") return;

      var targetSection = document.querySelector(targetId);

      if (targetSection) {
        event.preventDefault(); // Stop the default jump behaviour

        // Calculate where to scroll — subtract header height so
        // the section heading isn't hidden behind the sticky header
        var headerHeight = siteHeader ? siteHeader.offsetHeight : 72;
        var targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }

    });

  });


  /* ==============================================================
     6. APPOINTMENT FORM — VALIDATION & THANK YOU MESSAGE
        When the form is submitted:
        - Check that required fields are filled in
        - Show a friendly thank-you message
        - NO data is sent anywhere — this is safe and offline
  ============================================================== */

  var appointmentForm = document.getElementById("appointment-form");
  var formSuccess     = document.getElementById("form-success");

  if (appointmentForm && formSuccess) {

    appointmentForm.addEventListener("submit", function (event) {

      // Always prevent the form from doing a real submit/page reload
      event.preventDefault();

      // --- Simple Validation ---
      // Get the values from the required fields
      var fullName  = document.getElementById("full-name").value.trim();
      var phone     = document.getElementById("phone").value.trim();
      var service   = document.getElementById("service").value;
      var apptDate  = document.getElementById("appt-date").value;

      // Check if any required field is empty
      if (fullName === "" || phone === "" || service === "" || apptDate === "") {

        // Show a simple alert message if something is missing
        alert("Please fill in all required fields:\n• Full Name\n• Phone Number\n• Service / Test\n• Preferred Date");
        return; // Stop here — do not show the success message
      }

      // Check that the phone number has at least 10 digits
      var phoneDigits = phone.replace(/\D/g, ""); // Remove non-digit characters
      if (phoneDigits.length < 10) {
        alert("Please enter a valid phone number with at least 10 digits.");
        return;
      }

      // Check that the selected date is not in the past
      var today     = new Date();
      today.setHours(0, 0, 0, 0); // Ignore time — compare dates only
      var chosenDate = new Date(apptDate);

      if (chosenDate < today) {
        alert("Please select today's date or a future date for your appointment.");
        return;
      }

      // --- All checks passed: show the thank-you message ---

      // Hide the submit button so the user doesn't click it again
      var submitButton = appointmentForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.style.display = "none";
      }

      // Show the success message div (defined in index.html, hidden by default)
      formSuccess.style.display = "flex";

      // Smoothly scroll the success message into view
      formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });

      // Optional: Reset the form fields after 6 seconds
      // This clears the form in case the user wants to book again
      setTimeout(function () {
        appointmentForm.reset();
        formSuccess.style.display = "none";
        if (submitButton) {
          submitButton.style.display = "flex";
        }
      }, 6000); // 6000 milliseconds = 6 seconds

    });

  }


  /* ==============================================================
     7. GALLERY LIGHTBOX
        When a gallery photo is clicked, show it in a large
        full-screen overlay with previous/next navigation.
  ============================================================== */

  var galleryItems  = document.querySelectorAll(".gallery-item");
  var lightbox      = document.getElementById("lightbox");
  var lightboxImg   = document.getElementById("lightbox-img");
  var lightboxCap   = document.getElementById("lightbox-caption");
  var lightboxClose = document.getElementById("lightbox-close");
  var lightboxPrev  = document.getElementById("lightbox-prev");
  var lightboxNext  = document.getElementById("lightbox-next");

  // Only run if all lightbox elements exist
  if (galleryItems.length > 0 && lightbox && lightboxImg) {

    var currentIndex = 0; // Track which photo is currently shown

    // --- Open lightbox when a gallery item is clicked ---
    galleryItems.forEach(function (item, index) {

      item.addEventListener("click", function () {
        currentIndex = index; // Remember which photo was clicked
        openLightbox(currentIndex);
      });

    });

    // Function to open the lightbox and show a specific photo
    function openLightbox(index) {
      var item    = galleryItems[index];
      var imgSrc  = item.getAttribute("data-img");
      var caption = item.getAttribute("data-caption");

      lightboxImg.setAttribute("src", imgSrc);
      lightboxImg.setAttribute("alt", caption);
      if (lightboxCap) lightboxCap.textContent = caption;

      lightbox.classList.add("active"); // CSS shows the lightbox
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    // Function to close the lightbox
    function closeLightbox() {
      lightbox.classList.remove("active");
      lightboxImg.setAttribute("src", ""); // Clear image to free memory
      document.body.style.overflow = ""; // Restore scrolling
    }

    // --- Close button ---
    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    // --- Close when clicking the dark background ---
    lightbox.addEventListener("click", function (event) {
      // Only close if the user clicked the background, not the image itself
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    // --- Previous photo button ---
    if (lightboxPrev) {
      lightboxPrev.addEventListener("click", function () {
        // Go to the previous image; wrap around to the last if at the first
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        openLightbox(currentIndex);
      });
    }

    // --- Next photo button ---
    if (lightboxNext) {
      lightboxNext.addEventListener("click", function () {
        // Go to the next image; wrap around to the first if at the last
        currentIndex = (currentIndex + 1) % galleryItems.length;
        openLightbox(currentIndex);
      });
    }

    // --- Keyboard navigation for the lightbox ---
    document.addEventListener("keydown", function (event) {
      // Only respond to keys when the lightbox is open
      if (!lightbox.classList.contains("active")) return;

      if (event.key === "Escape")     closeLightbox();
      if (event.key === "ArrowLeft")  lightboxPrev && lightboxPrev.click();
      if (event.key === "ArrowRight") lightboxNext && lightboxNext.click();
    });

  }


  /* ==============================================================
     8. SCROLL-TO-TOP BUTTON
        Show a small button in the bottom-left corner when the
        user scrolls down. Clicking it scrolls back to the top.
  ============================================================== */

  var scrollTopBtn = document.getElementById("scroll-top");

  if (scrollTopBtn) {

    // Show or hide the button based on scroll position
    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add("visible");    // CSS makes it visible
      } else {
        scrollTopBtn.classList.remove("visible"); // CSS hides it
      }
    });

    // Scroll to the very top when the button is clicked
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

  }


  /* ==============================================================
     9. SET MINIMUM DATE ON APPOINTMENT FORM
        Prevent the user from selecting a past date in the
        date picker by setting today as the minimum allowed date.
  ============================================================== */

  var dateInput = document.getElementById("appt-date");

  if (dateInput) {
    // Get today's date in YYYY-MM-DD format (required by HTML date inputs)
    var todayDate = new Date();
    var year  = todayDate.getFullYear();
    var month = String(todayDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    var day   = String(todayDate.getDate()).padStart(2, "0");

    dateInput.setAttribute("min", year + "-" + month + "-" + day);
  }


  /* ==============================================================
     10. SERVICE CARDS — SUBTLE ENTRANCE ANIMATION
         When service cards scroll into view, fade them in one
         by one. Uses the Intersection Observer API — no library needed.
  ============================================================== */

  var animatedCards = document.querySelectorAll(
    ".service-card, .testimonial-card, .package-card, .gallery-item"
  );

  // Check if the browser supports IntersectionObserver (all modern browsers do)
  if ("IntersectionObserver" in window && animatedCards.length > 0) {

    // Set initial state: cards start invisible and slightly lower
    animatedCards.forEach(function (card) {
      card.style.opacity  = "0";
      card.style.transform = "translateY(24px)";
      card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });

    // Create an observer that watches when elements enter the viewport
    var cardObserver = new IntersectionObserver(function (entries) {

      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Element is now visible — animate it in
          entry.target.style.opacity   = "1";
          entry.target.style.transform = "translateY(0)";
          // Stop watching this element once it has appeared
          cardObserver.unobserve(entry.target);
        }
      });

    }, {
      threshold: 0.12 // Trigger when 12% of the card is visible
    });

    // Add a small delay to each card so they appear one after another
    animatedCards.forEach(function (card, index) {
      // Each card waits a little longer than the previous one
      card.style.transitionDelay = (index % 4) * 0.08 + "s";
      cardObserver.observe(card);
    });

  }


}); // End of DOMContentLoaded