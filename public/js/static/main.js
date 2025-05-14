document.addEventListener("DOMContentLoaded", () => {
  // Cookie consent functionality
  const acceptAllCookiesBtn = document.getElementById("acceptAllCookies")
  const rejectCookiesBtn = document.getElementById("rejectCookies")
  const manageCookiesBtn = document.getElementById("manageCookies")

  if (acceptAllCookiesBtn) {
    acceptAllCookiesBtn.addEventListener("click", () => {
      // Set cookie consent to accepted
      setCookieConsent("accepted")
      // Hide cookie banner if it exists
      const cookieInfo = document.querySelector(".cookie-info")
      if (cookieInfo) {
        cookieInfo.style.display = "none"
      }
    })
  }

  if (rejectCookiesBtn) {
    rejectCookiesBtn.addEventListener("click", () => {
      // Set cookie consent to rejected
      setCookieConsent("rejected")
      // Hide cookie banner if it exists
      const cookieInfo = document.querySelector(".cookie-info")
      if (cookieInfo) {
        cookieInfo.style.display = "none"
      }
    })
  }

  if (manageCookiesBtn) {
    manageCookiesBtn.addEventListener("click", () => {
      // Open cookie preferences modal (to be implemented)
      alert("Çerez tercihlerinizi yönetme özelliği yakında eklenecektir.")
    })
  }

  // Language selector functionality
  const languageSelector = document.querySelector(".language-selector")
  if (languageSelector) {
    languageSelector.addEventListener("click", () => {
      // Language selection functionality (to be implemented)
      alert("Dil seçenekleri yakında eklenecektir.")
    })
  }

  // Function to set cookie consent
  function setCookieConsent(status) {
    const expiryDate = new Date()
    expiryDate.setMonth(expiryDate.getMonth() + 6) // Cookie consent valid for 6 months

    document.cookie = `cookie_consent=${status}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`
    console.log(`Cookie consent set to: ${status}`)
  }

  // Check if cookie consent is already set
  function checkCookieConsent() {
    const cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.startsWith("cookie_consent=")) {
        const cookieInfo = document.querySelector(".cookie-info")
        if (cookieInfo) {
          cookieInfo.style.display = "none"
        }
        return
      }
    }
  }

  // Check cookie consent on page load
  checkCookieConsent()
})
