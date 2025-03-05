document.addEventListener("DOMContentLoaded", () => {
  // Navbar scroll effect
  const navbar = document.querySelector(".navbar")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Back to top button
  const backToTopButton = document.querySelector(".back-to-top")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("active")
    } else {
      backToTopButton.classList.remove("active")
    }
  })

  backToTopButton.addEventListener("click", (e) => {
    e.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        const navbarHeight = document.querySelector(".navbar").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })

        // Close mobile menu if open
        const navbarToggler = document.querySelector(".navbar-toggler")
        const navbarCollapse = document.querySelector(".navbar-collapse")
        if (navbarCollapse.classList.contains("show")) {
          navbarToggler.click()
        }
      }
    })
  })

  // Portfolio filtering
  const portfolioFilters = document.querySelectorAll(".portfolio-filter button")
  const portfolioItems = document.querySelectorAll(".portfolio-item")

  portfolioFilters.forEach((filter) => {
    filter.addEventListener("click", function () {
      // Remove active class from all filters
      portfolioFilters.forEach((btn) => btn.classList.remove("active"))
      // Add active class to clicked filter
      this.classList.add("active")

      const filterValue = this.getAttribute("data-filter")

      portfolioItems.forEach((item) => {
        if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
          item.style.display = "block"
          setTimeout(() => {
            item.style.opacity = "1"
            item.style.transform = "scale(1)"
          }, 50)
        } else {
          item.style.opacity = "0"
          item.style.transform = "scale(0.8)"
          setTimeout(() => {
            item.style.display = "none"
          }, 300)
        }
      })
    })
  })

  // Form submission handling
  const quoteForm = document.getElementById("quoteForm")
  if (quoteForm) {
    quoteForm.addEventListener("submit", (e) => {
      e.preventDefault()
      alert("¡Gracias por solicitar una cotización! Te contactaremos pronto.")
      quoteForm.reset()
    })
  }

  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()
      alert("¡Gracias por tu mensaje! Te responderemos a la brevedad.")
      contactForm.reset()
    })
  }

  // Initialize Bootstrap tooltips and popovers.  The issue was likely that bootstrap wasn't imported or the bootstrap object wasn't available.  This assumes bootstrap is available globally.  If not, you'll need to import it.
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))

  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
  popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl))

  // Portfolio modal dynamic content
  const portfolioModal = document.getElementById("portfolioModal")
  if (portfolioModal) {
    portfolioModal.addEventListener("show.bs.modal", (event) => {
      const button = event.relatedTarget
      const card = button.closest(".portfolio-card")
      const title = card.querySelector(".card-title").textContent
      const image = card.querySelector("img").src
      const category = card.querySelector(".text-muted").textContent

      const modalTitle = portfolioModal.querySelector(".modal-title")
      const modalImage = portfolioModal.querySelector(".modal-body img")

      modalTitle.textContent = title
      modalImage.src = image
      modalImage.alt = title
    })
  }

  // Animate on scroll
  const animateElements = document.querySelectorAll(".animate-on-scroll")

  function checkIfInView() {
    const windowHeight = window.innerHeight
    const windowTopPosition = window.scrollY
    const windowBottomPosition = windowTopPosition + windowHeight

    animateElements.forEach((element) => {
      const elementHeight = element.offsetHeight
      const elementTopPosition = element.offsetTop
      const elementBottomPosition = elementTopPosition + elementHeight

      if (elementBottomPosition >= windowTopPosition && elementTopPosition <= windowBottomPosition) {
        element.classList.add("animate__animated", element.dataset.animation || "animate__fadeIn")
      }
    })
  }

  window.addEventListener("scroll", checkIfInView)
  window.addEventListener("resize", checkIfInView)
  window.addEventListener("load", checkIfInView)

  // Check if elements are in view on page load
  checkIfInView()
})

