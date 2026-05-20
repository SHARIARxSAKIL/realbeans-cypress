const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://r1011605-realbeans.myshopify.com',
    setupNodeEvents(on, config) {},
    projectId: 'dhex4q',
  },
})