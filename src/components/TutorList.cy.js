import TutorListNew from './TutorListNew.vue'
import { mount } from '@cypress/vue'
import { createStore } from 'vuex'
import { ref } from 'vue'

describe('<TutorListNew />', () => {
  let store

  beforeEach(() => {
    store = createStore({
      state() {
        return {
          tmpVisitDate: new Date(),
          user: { id: 'user123' }
        }
      }
    })
  })

  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    mount(TutorListNew, {
      global: {
        plugins: [store]
      }
    })
    cy.get('input[placeholder="Przedmiot"]').should('exist')
    cy.get('input[placeholder="Lokalizacja"]').should('exist')
  })

  it('filters tutors by subject', () => {
    mount(TutorListNew, {
      global: {
        plugins: [store]
      },
      data() {
        return {
          tutors: ref([
            { id: '1', data: { first: 'John', last: 'Doe', subject: 'Math', hourRate: 50 } },
            { id: '2', data: { first: 'Jane', last: 'Smith', subject: 'English', hourRate: 60 } }
          ])
        }
      }
    })

    cy.get('input[placeholder="Przedmiot"]').type('Math')
    cy.get('button').contains('Szczegóły').should('have.length', 1)
    cy.get('button').contains('Szczegóły').parent().parent().parent().should('contain', 'John Doe')
  })

  it('opens tutor details', () => {
    mount(TutorListNew, {
      global: {
        plugins: [store]
      },
      data() {
        return {
          tutors: ref([
            { id: '1', data: { first: 'John', last: 'Doe', subject: 'Math', hourRate: 50 } }
          ])
        }
      }
    })

    cy.get('button').contains('Szczegóły').click()
    cy.get('.offcanvas').should('be.visible')
    cy.get('.offcanvas').should('contain', 'John Doe')
  })
})
