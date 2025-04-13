const app = Vue.createApp({

data() {
    return {
      listings: []  // filled via fetch
    };
  },
  created() {
    fetch('listings.json')
      .then(res => res.json())
      .then(data => {
        this.listings = data;
      });
  }

});


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
});

app.component('property-list', {
  props: ['listings'],
  template: `
    <section class="listings">
      <div
        v-for="listing in listings"
        :key="listing.SalesID"
        class="listing-card"
      >
        <img
          :src="'houseImages/' + listing.Image + '.jpg'"
          :alt="'House ' + listing.SalesID"
          class="listing-image"
        >
      </div>
    </section>
  `
});

app.mount('#app')
