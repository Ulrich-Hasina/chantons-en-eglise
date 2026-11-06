<template>
  <div class="application">
    <RouterView />
  </div>
</template>

<style>
/* Réinitialisation générale */
* {
  box-sizing: border-box;
}

html {
  min-width: 320px;
  min-height: 100%;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  background: #f7f9fc;
  color: #263238;
  transition:
    background 0.3s,
    color 0.3s;
}

button,
input,
textarea {
  font: inherit;
}

button {
  -webkit-tap-highlight-color: transparent;
}

.application {
  min-height: 100vh;
  width: 100%;
}

/* Mode sombre général */
html.mode-sombre body {
  background: #121826;
  color: #e5e7eb;
}

/* Tablettes et ordinateurs */
@media (min-width: 768px) {
  body {
    font-size: 16px;
  }
}

/* Petits téléphones */
@media (max-width: 360px) {
  body {
    font-size: 14px;
  }
}
</style>
