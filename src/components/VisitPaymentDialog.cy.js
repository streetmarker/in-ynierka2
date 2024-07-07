import VisitPaymentDialog from './VisitPaymentDialog.vue';

describe('<VisitPaymentDialog />', () => {
  const tutor = {
    data: {
      first: "John",
      last: "Doe",
      subject: "Mathematics",
      level: "High School",
      hourRate: 50
    },
    id: "tutor123"
  };

  const visitDate = new Date();

  const visitId = "visit123";

  it('renders', () => {
    cy.mount(VisitPaymentDialog, {
      props: {
        visitDate,
        tutor,
        visitId
      }
    });
  });

  it('displays correct tutor information', () => {
    cy.mount(VisitPaymentDialog, {
      props: {
        visitDate,
        tutor,
        visitId
      }
    });

    cy.get('.modal-body').should('contain', 'Dokonaj płatności za wizytę');
    cy.get('.modal-body').should('contain', `Korepetytor: ${tutor.data.first} ${tutor.data.last}`);
    cy.get('.modal-body').should('contain', `Przedmiot: ${tutor.data.subject}`);
    cy.get('.modal-body').should('contain', `Poziom: ${tutor.data.level}`);
    cy.get('.modal-body').should('contain', `Stawka godzinowa: ${tutor.data.hourRate}`);
    cy.get('.modal-body').should('contain', `Do zapłaty: ${tutor.data.hourRate} zł`);
  });

  it('initializes PayPal button on click', () => {
    cy.mount(VisitPaymentDialog, {
      props: {
        visitDate,
        tutor,
        visitId
      }
    });

    cy.get('button').contains('Opłać wizytę').click();
    cy.get('#paypal-btn').should('exist');
  });
});
