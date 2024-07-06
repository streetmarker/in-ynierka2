<template>
  <div class="container">
    <div class="jumbotron text-center">
      <h1>Aplikacja do zarządzania korepetycjami</h1>
      <div class="jumbotron text-center">
        <img style="width: 25%" class="img-fluid rounded" src="../../public/front_img.svg" alt="Lista korepetytorów">
      </div>
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

  </div>
</template>

<script>
export default {
  name: "LandingPage",
};
</script>

<style scoped>
/* Dodatkowe style dla obrazków */
.img-fluid {
  width: 70vh; 
  margin-bottom: 20px; 
}

.rounded {
  border: 5px solid #ddd;
  border-radius: 10px; /* Zaokrąglenie krawędzi */
  padding: 0;
}
</style>
