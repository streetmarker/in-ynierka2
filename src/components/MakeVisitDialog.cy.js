import MakeVisitDialog from './MakeVisitDialog.vue'
import { mount } from '@cypress/vue'
import { createStore } from 'vuex'
import { defineComponent } from 'vue'

describe('<MakeVisitDialog />', () => {
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
    mount(MakeVisitDialog, {
      props: {
        tutor: {
          data: { first: 'John', last: 'Doe' },
          id: 'tutor123'
        },
        btnText: 'Book Now'
      },
      global: {
        plugins: [store]
      }
    })
    cy.get('button').contains('Book Now')
  })

  it('opens and closes the modal', () => {
    mount(MakeVisitDialog, {
      props: {
        tutor: {
          data: { first: 'John', last: 'Doe' },
          id: 'tutor123'
        },
        btnText: 'Book Now'
      },
      global: {
        plugins: [store]
      }
    })
    
    // Click button to open modal
    cy.get('button').contains('Book Now').click()
    cy.get('.modal').should('be.visible')

    // Close the modal using the close button
    cy.get('.modal-footer button').contains('Zamknij').click()
    cy.get('.modal').should('not.be.visible')
  })

  it('displays tutor name and visit date', () => {
    mount(MakeVisitDialog, {
      props: {
        tutor: {
          data: { first: 'John', last: 'Doe' },
          id: 'tutor123'
        },
        btnText: 'Book Now'
      },
      global: {
        plugins: [store]
      }
    })
    
    // Click button to open modal
    cy.get('button').contains('Book Now').click()
    cy.get('.modal').should('be.visible')

    // Check tutor name and visit date
    cy.get('.modal-body h2').should('contain', 'Korepetytor: John Doe')
    cy.get('.modal-body p').should('contain', 'Termin:')
  })
})
