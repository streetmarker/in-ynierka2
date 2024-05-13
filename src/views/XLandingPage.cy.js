import XLandingPage from './XLandingPage.vue'

describe('<XLandingPage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(XLandingPage)
  })
})