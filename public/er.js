import { saveErrorInDb } from "../src/firebaseInitializer";

const originalError = console.error;  // Zachowaj oryginalne console.error

// Przypisz nową funkcję do console.error
console.error = (...args) => {
  saveErrorInDb(args)  // Wykonaj swoją funkcję
  originalError.apply(console, args);  // Wywołaj oryginalne console.error
};
