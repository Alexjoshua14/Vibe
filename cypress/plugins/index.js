
// const { baseLoginConnect } = require('cypress-social-logins').plugins

// module.exports = (on, config) => {
//   on("task", {
//     customLogin(options) {

//       async function typeUsername({page, options} = {}) {
//         await page.waitForSelector('button[data-testid="google-login"]')
//         await page.click('button[dataid="google-login"]')

//         await page.waitForSelector('input[id="identifierId"]')
//         await page.type('input[id="username"]', options.username)
//         await page.keyboard.press('Enter')
//       }

//       async function typePassword({page, options}) {
//         await page.waitForSelector('input[type="password"]')
//         await page.type('input[type="password"]', options.password)
//         await page.keyboard.press('Enter')
//       }

//       return baseLoginConnect(typeUsername, typePassword, null, options)
//     }
//   })
// }