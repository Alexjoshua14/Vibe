import { defineConfig } from 'cypress'

const { GoogleSocialLogin } = require('cypress-social-logins').plugins

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      on("task", {
        GoogleSocialLogin,   
      })
    },
    baseUrl: 'http://localhost:3000',
    chromeWebSecurity: false,
    supportFile: false
  },
})
