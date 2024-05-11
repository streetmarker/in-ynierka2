<template>
  <div id="app" class="container">
    <div class="jumbotron text-center">
      <h1>Aplikacja do zarządzania korepetycjami</h1>
      <p>
        Zarządzaj swoimi korepetycjami w łatwy sposób, gdziekolwiek jesteś.
      </p>
    </div>
    <div id="features" class="row">
      <div class="jumbotron text-center">
        <h2>Planowanie zajęć</h2>
        <p>Zaplanuj i zarządzaj swoimi zajęciami w wygodny sposób.</p>
      </div>
      <div class="jumbotron text-center">
        <h2>Aplikacja mobilna</h2>
        <p>
          Korzystaj z naszej aplikacji mobilnej, aby mieć dostęp do swojego
          konta zawsze i wszędzie.
        </p>
      </div>
      <div class="jumbotron text-center">
        <h2>Automatyzacja procesów</h2>
        <p>
          Automatyzuj umawianie, odwoływanie i zarządzanie płatnościami.
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <h2>Lista korepetytorów</h2>
        <p>Tutaj możesz zobaczyć listę dostępnych korepetytorów.</p>
        <!-- Dodaj zrzut ekranu z widokiem listy korepetytorów -->
        <!-- <img style="width: 70vh;" src="https://firebasestorage.googleapis.com/v0/b/justfirstsite.appspot.com/o/front1.png?alt=media&token=86220662-3a15-4231-b00c-3e53f5c85682" alt="Lista korepetytorów"> -->
      </div>
      <div class="col-md-6">
        <h2>Umówienie wizyty</h2>
        <p>
          Skorzystaj z aplikacji, aby umówić wizytę z wybranym korepetytorem.
        </p>
        <!-- Dodaj zrzut ekranu z przykładowym umówieniem wizyty -->
        <!-- <img src="umowienie_wizyty.png" alt="Umówienie wizyty"> -->
      </div>
    </div>
    <img style="width: 70vh;" src="https://firebasestorage.googleapis.com/v0/b/justfirstsite.appspot.com/o/front1.png?alt=media&token=86220662-3a15-4231-b00c-3e53f5c85682" alt="Lista korepetytorów">

  </div>
</template>

<script>
// @ is an alias to /src
// import Dashboard from "@/components/WelcomePage.vue";

export default {
  name: "HomeView",
  // components: {
  //   Dashboard,
  // },
};
</script>


<!-- <style scoped>
/* Dodaj niestandardowe style CSS tutaj */
#app {
  background-color: #f0f0f0; /* Kolor tła */
  background-image: radial-gradient(circle, #ffffff 0%, #f0f0f0 100%); /* Gradient tła */
  padding: 20px;
}
</style> -->
