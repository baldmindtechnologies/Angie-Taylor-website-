const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".site-menu");

if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    });
  });
}

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const status = document.getElementById("form-status");
  const button = document.getElementById("submit-button");

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";
    button.disabled = true;
    button.textContent = "Sending...";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        let message = "There was a problem sending your message. Please try again.";
        try {
          const data = await response.json();
          if (Array.isArray(data.errors) && data.errors.length) {
            message = data.errors.map((error) => error.message).join(" ");
          }
        } catch (_) {}
        throw new Error(message);
      }

      contactForm.reset();
      status.textContent = "Message sent successfully. Thank you!";
      button.textContent = "Message Sent";
      window.setTimeout(() => {
        status.textContent = "";
        button.textContent = "Send Message";
        button.disabled = false;
      }, 5000);
    } catch (error) {
      status.textContent = error.message || "Unable to send right now. Please check your connection and try again.";
      button.textContent = "Send Message";
      button.disabled = false;
    }
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      contactForm.reset();
      status.textContent = "";
      button.textContent = "Send Message";
      button.disabled = false;
    }
  });
}
