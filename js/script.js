document.addEventListener("DOMContentLoaded", () => {
  // Fixed header scroll effect
  const header = document.querySelector(".fixed-header")

  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    })
  }

  // Mobile menu toggle with animation
  const mobileMenuButton = document.getElementById("mobile-menu-button")
  const mobileMenu = document.getElementById("mobile-menu")
  const body = document.body

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")
      mobileMenuButton.classList.toggle("open")
      body.classList.toggle("menu-open")

      // Create overlay if it doesn't exist
      let overlay = document.querySelector(".mobile-menu-overlay")
      if (!overlay) {
        overlay = document.createElement("div")
        overlay.className = "mobile-menu-overlay"
        document.body.appendChild(overlay)

        // Close menu when clicking overlay
        overlay.addEventListener("click", () => {
          mobileMenu.classList.add("hidden")
          mobileMenuButton.classList.remove("open")
          body.classList.remove("menu-open")
          overlay.classList.remove("active")
        })
      }

      // Toggle overlay
      overlay.classList.toggle("active")
    })
  }

  // Mobile programs submenu toggle with animation
  const mobileProgramsButton = document.getElementById("mobile-programs-button")
  const mobileProgramsMenu = document.getElementById("mobile-programs-menu")
  const mobileProgramsIcon = document.getElementById("mobile-programs-icon")

  if (mobileProgramsButton && mobileProgramsMenu && mobileProgramsIcon) {
    mobileProgramsButton.addEventListener("click", () => {
      mobileProgramsMenu.classList.toggle("hidden")
      mobileProgramsIcon.classList.toggle("rotate-180")
    })
  }

  // Animation on scroll
  const animateElements = document.querySelectorAll(".aos-animate")

  if (animateElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in")
          }
        })
      },
      {
        threshold: 0.1,
      },
    )

    animateElements.forEach((element) => {
      observer.observe(element)
    })
  }

  // FAQ accordion
  const faqButtons = document.querySelectorAll(".faq-button")

  if (faqButtons.length > 0) {
    faqButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const content = button.nextElementSibling
        content.classList.toggle("hidden")
        const icon = button.querySelector("i")
        if (icon) {
          icon.classList.toggle("fa-chevron-down")
          icon.classList.toggle("fa-chevron-up")
        }
      })
    })
  }

  // Testimonial slider
  const testimonialSlider = document.getElementById("testimonial-slider")
  const testimonialItems = document.querySelectorAll(".testimonial-item")
  let currentSlide = 0

  if (testimonialSlider && testimonialItems.length > 0) {
    const showSlide = (index) => {
      testimonialItems.forEach((item, i) => {
        item.style.display = i === index ? "block" : "none"
      })
    }

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % testimonialItems.length
      showSlide(currentSlide)
    }

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + testimonialItems.length) % testimonialItems.length
      showSlide(currentSlide)
    }

    // Initialize slider
    showSlide(currentSlide)

    // Auto slide every 5 seconds
    setInterval(nextSlide, 5000)

    // Add navigation buttons if they exist
    const nextButton = document.getElementById("testimonial-next")
    const prevButton = document.getElementById("testimonial-prev")

    if (nextButton) {
      nextButton.addEventListener("click", nextSlide)
    }

    if (prevButton) {
      prevButton.addEventListener("click", prevSlide)
    }
  }

  // Smooth scroll for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]')

  if (anchorLinks.length > 0) {
    anchorLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href")
        if (targetId !== "#") {
          const targetElement = document.querySelector(targetId)
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80, // Adjusted for fixed header
              behavior: "smooth",
            })
          }
        }
      })
    })
  }

  // Parallax effect for background images
  const parallaxElements = document.querySelectorAll(".parallax")

  if (parallaxElements.length > 0) {
    window.addEventListener("scroll", () => {
      parallaxElements.forEach((element) => {
        const scrollPosition = window.pageYOffset
        const speed = element.dataset.speed || 0.5
        element.style.transform = `translateY(${scrollPosition * speed}px)`
      })
    })
  }

  // Animate numbers on scroll
  const numberElements = document.querySelectorAll(".animate-number")

  if (numberElements.length > 0) {
    const animateNumber = (element) => {
      const target = Number.parseInt(element.getAttribute("data-target"))
      const duration = 2000 // 2 seconds
      const step = target / (duration / 16) // 60fps
      let current = 0

      const timer = setInterval(() => {
        current += step
        if (current >= target) {
          element.textContent = target
          clearInterval(timer)
        } else {
          element.textContent = Math.floor(current)
        }
      }, 16)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateNumber(entry.target)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 },
    )

    numberElements.forEach((element) => {
      observer.observe(element)
    })
  }
})

// Main JavaScript file for Premium Preversity

document.addEventListener("DOMContentLoaded", () => {
  // Fixed header behavior on scroll
  const header = document.querySelector(".fixed-header")

  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    })
  }

  // Mobile menu functionality
  const mobileMenuButton = document.getElementById("mobile-menu-button")
  const mobileMenu = document.getElementById("mobile-menu")
  const mobileMenuClose = document.getElementById("mobile-menu-close")
  const mobileProgramsButton = document.getElementById("mobile-programs-button")
  const mobileProgramsMenu = document.getElementById("mobile-programs-menu")
  const mobileProgramsIcon = document.getElementById("mobile-programs-icon")

  // Mobile menu toggle
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")
      mobileMenuButton.classList.toggle("open")
      document.body.classList.toggle("menu-open")
    })
  }

  // Mobile menu close button
  if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener("click", () => {
      mobileMenu.classList.add("hidden")
      mobileMenuButton.classList.remove("open")
      document.body.classList.remove("menu-open")
    })
  }

  // Mobile programs dropdown
  if (mobileProgramsButton && mobileProgramsMenu) {
    mobileProgramsButton.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      mobileProgramsMenu.classList.toggle("hidden")
      if (mobileProgramsIcon) {
        mobileProgramsIcon.classList.toggle("rotate-180")
      }
    })
  }

  // Close mobile menu on window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && mobileMenu) {
      mobileMenu.classList.add("hidden")
      if (mobileMenuButton) mobileMenuButton.classList.remove("open")
      document.body.classList.remove("menu-open")
    }
  })

  // AOS-like animations
  const animatedElements = document.querySelectorAll(".aos-animate")

  if (animatedElements.length > 0) {
    const checkIfInView = () => {
      animatedElements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect()
        const windowHeight = window.innerHeight

        if (elementPosition.top < windowHeight * 0.9) {
          element.classList.add("fade-in")
        }
      })
    }

    window.addEventListener("scroll", checkIfInView)
    window.addEventListener("resize", checkIfInView)
    window.addEventListener("load", checkIfInView)

    // Initial check
    checkIfInView()
  }
})


                var url = 'https://wati-integration-prod-service.clare.ai/v2/watiWidget.js?9021';
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = url;
                var options = {
                "enabled":true,
                "chatButtonSetting":{
                    "backgroundColor":"#00e785",
                    "ctaText":"Chat with us",
                    "borderRadius":"25",
                    "marginLeft": "0",
                    "marginRight": "20",
                    "marginBottom": "20",
                    "ctaIconWATI":false,
                    "position":"right"
                },
                "brandSetting":{
                    "brandName":"Premium Preversity",
                    "brandSubTitle":"undefined",
                    "brandImg":"https://www.premiumpreversityng.com/images/logo.png",
                    "welcomeText":"Hi there!\nHow can I help you?",
                    "messageText":"",
                    "backgroundColor":"#00e785",
                    "ctaText":"Chat with us",
                    "borderRadius":"25",
                    "autoShow":false,
                    "phoneNumber":"2347067866444"
                }
                };
                s.onload = function() {
                    CreateWhatsappChatWidget(options);
                };
                var x = document.getElementsByTagName('script')[0];
                x.parentNode.insertBefore(s, x);
          
