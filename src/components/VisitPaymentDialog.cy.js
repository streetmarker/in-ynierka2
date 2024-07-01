import ClientMakeVisit from './VisitPaymentDialog.vue'

describe('<ClientMakeVisit />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(ClientMakeVisit)
  })
})