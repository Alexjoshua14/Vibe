

// describe("Login page", () => {
//   before(() => {
//     cy.log(`Visiting https://localhost:3000`)
//     cy.visit("/")
//   })

//   it("Login with Spotify", () => {
//     const username = Cypress.env("GOOGLE_USER")
//     const password = Cypress.env("GOOGLE_PW")
//     const loginUrl = Cypress.env("SITE_NAME")
//     const cookieName = Cypress.env("COOKIE_NAME")

//     const socialLoginOptions = {
//       username,
//       password,
//       loginUrl,
//       headless: false,
//       logs: true,
//       isPopup: true,
//       loginSelector: `a[href="${Cypress.env("SITE_NAME")}/api/auth/signin/spotify"]`,
//       postLoginSelector: "Welcome Home!"
//     }

//   return cy
//     .task("customLogin", socialLoginOptions)
//     .then(({ cookies }) => {
//       cy.clearCookies()
      
//       const cookie = cookies
//         .filter((cookie) => cookie.name === cookieName)
//         .pop()
//       if (cookie) {
//         cy.setCookie(cookie.name, cookie.value, {
//           domain: cookie.domain,
//           expiry: cookie.expires,
//           httpOnly: cookie.httpOnly,
//           path: cookie.path,
//           secure: cookie.secure,
//         })

//         Cypress.Cookies.defaults({
//           preserve: cookieName,
//         })

//         cy.visit("/api/auth/signout")
//         cy.get("form").submit()
//       }

//     })
// })
// })