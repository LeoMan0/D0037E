const app = Vue.createApp({})

app.component('site-header', {
  template: `
    <header>
      <div class="logo">
        <img src="Logo.png" alt="House Spy Logo">
        <span>House Spy</span>
      </div>
      <nav>
        <a href="index.html">Home</a>
        <a href="#">Buy</a>
        <a href="#">Sell</a>
        <a href="#">About</a>
      </nav>
    </header>
  `
})

app.mount('#app')
