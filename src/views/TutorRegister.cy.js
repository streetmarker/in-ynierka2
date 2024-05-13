import TutorRegister from './TutorRegister.vue'

describe('<TutorRegister />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(TutorRegister)
  })
})