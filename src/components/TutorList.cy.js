import TutorList from './TutorList.vue'

describe('<TutorListNew />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(TutorList)
  })
})