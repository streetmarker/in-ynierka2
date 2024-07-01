var admin = require("firebase-admin");

var serviceAccount = require("./justfirstsite-firebase-adminsdk-a9bgt-65782bfe44.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://justfirstsite-default-rtdb.europe-west1.firebasedatabase.app"
});

// Uzyskanie referencji do Firestore
const db = admin.firestore();

async function insertTestDoc() {
  try {
    // Utworzenie nowego dokumentu w kolekcji "visit"
    var today = new Date();
    var visitDate = new Date();
    visitDate.setDate(today.getDate()+1)
    await db.collection('visit').add({
        id: Math.random()*100,
        clientId: 'kHndvF2np9gd9VS6Vgrkguv6kvy1',
        tutorId: 'ixT4M6bLXUURjfOz3kWB',
        reciveDate: today,
        visitDate: visitDate,
        status: 'active',
    });

    // Pobranie utworzonego dokumentu
    const snapshot = await db.collection('visit').get();

    // Wyświetlenie danych dokumentu
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });

    console.log('Pobranie dokumentu zakończone sukcesem.');

  } catch (error) {
    console.error('Błąd podczas testowania reguł Firestore:', error);
  }
}
async function getTestDoc() {
    try {
      // Pobranie utworzonego dokumentu
      const snapshot = await db.collection('visit').get();
  
      // Wyświetlenie danych dokumentu
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
      });
  
      console.log('Pobranie dokumentu zakończone sukcesem.');
  
    } catch (error) {
      console.error('Błąd podczas testowania reguł Firestore:', error);
    }
  }
  

// insertTestDoc();
getTestDoc();