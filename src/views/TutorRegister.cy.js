import TutorRegister from './TutorRegister.vue';

describe('<TutorRegister />', () => {
  it('renders', () => {
    cy.mount(TutorRegister);
  });

  it('displays form elements', () => {
    cy.mount(TutorRegister);

    cy.get('form').should('exist');
    cy.get('input#firstName').should('exist');
    cy.get('input#lastName').should('exist');
    cy.get('input#birthDate').should('exist');
    cy.get('select#subject').should('exist');
    cy.get('select#level').should('exist');
    cy.get('input#hourRate').should('exist');
    cy.get('input#description').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('fills out and submits the form', () => {
    cy.mount(TutorRegister);

    cy.get('input#firstName').type('John');
    cy.get('input#lastName').type('Doe');
    cy.get('input#birthDate').type('2000-01-01');
    cy.get('select#subject').select('Matematyka');
    cy.get('select#level').select('Szkoła średnia');
    cy.get('input#hourRate').type('50');
    cy.get('input#description').type('Experienced math tutor.');

    cy.get('button[type="submit"]').click();

  });
});
