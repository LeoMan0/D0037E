const app = Vue.createApp({
  data() {
    return {
      listings: [],
      currentPage: 1,
      itemsPerPage: 5,

      formZip: '',
      formBedroomsMin: null,
      formBedroomsMax: null,
      formSqMMin: null,
      formSqMMax: null,
      formSortBy: '',
      formSortOrder: 'asc',

      searchTriggered: false
    };
  },

  created() {
    this.fetchListings();
  },

  computed: {
    paginatedListings() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.listings.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.listings.length / this.itemsPerPage);
    }
  },

  methods: {
    fetchListings() {
        const params = new URLSearchParams();
    
        if (this.formZip) params.append("zip", this.formZip);
        if (this.formBedroomsMin) params.append("min_bedrooms", this.formBedroomsMin);
        if (this.formBedroomsMax) params.append("max_bedrooms", this.formBedroomsMax);
        if (this.formSqMMin) params.append("min_sqm", this.formSqMMin);
        if (this.formSqMMax) params.append("max_sqm", this.formSqMMax);
        if (this.formSortBy) params.append("sort_by", this.formSortBy);
        if (this.formSortOrder) params.append("order", this.formSortOrder);
    
        fetch(`http://localhost:5000/api/listings?${params.toString()}`)
          .then(res => res.json())
          .then(data => {
            this.listings = data;
            this.currentPage = 1;
            this.searchTriggered = true;
          })
          .catch(err => console.error("API error:", err));
      },

    doSearch() {
      this.fetchListings();
    },
    resetPage() {
      this.currentPage = 1;
    }
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
        <div class="details">
          <h3> Acacia Avenue – {{listing.zip_code}} - $ {{listing.SalePrice}} </h3>
          <p>{{listing.Bedrooms}} Bedrooms • {{listing.SqMTotLiving}} total sqm • Built {{listing.YrBuilt}}</p>
        </div>
      </div>
    </section>
  `
});

app.mount('#app')
