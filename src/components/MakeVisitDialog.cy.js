import MakeVisitDialog from './MakeVisitDialog.vue'

describe('<MakeVisitDialog />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(MakeVisitDialog)
  })
})