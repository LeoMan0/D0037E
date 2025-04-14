const app = Vue.createApp({
  data() {
    return {
      listings: [],
      currentPage: 1,
      itemsPerPage: 5,

      // Filters and search
      sortBy: '',
      sortOrder: 'asc',
      filterZip: '',
      filterBedroomsMin: null,
      filterBedroomsMax: null,
      filterSqMMin: null,
      filterSqMMax: null,


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
    fetch('listings.json')
      .then(res => res.json())
      .then(data => {
        this.listings = data;
      });
  },

  computed: {
    filteredListings() {
      if (!this.searchTriggered) return this.listings;

      let result = [...this.listings];

      // Exact ZIP match
      if (this.filterZip) {
        result = result.filter(h => h.zip_code.toString() === this.filterZip);
      }

      // Bedrooms
      if (this.filterBedroomsMin !== null && this.filterBedroomsMin !== '') {
        result = result.filter(h => h.Bedrooms >= this.filterBedroomsMin);
      }
      if (this.filterBedroomsMax !== null && this.filterBedroomsMax !== '') {
        result = result.filter(h => h.Bedrooms <= this.filterBedroomsMax);
      }

      // SqM
      if (this.filterSqMMin !== null && this.filterSqMMin !== '') {
        result = result.filter(h => h.SqMTotLiving >= this.filterSqMMin);
      }
      if (this.filterSqMMax !== null && this.filterSqMMax !== '') {
        result = result.filter(h => h.SqMTotLiving <= this.filterSqMMax);
      }

      // Sorting
      if (this.sortBy === 'price') {
        result.sort((a, b) => this.sortOrder === 'asc'
          ? a.SalePrice - b.SalePrice
          : b.SalePrice - a.SalePrice);
      } else if (this.sortBy === 'year') {
        result.sort((a, b) => this.sortOrder === 'asc'
          ? a.YrBuilt - b.YrBuilt
          : b.YrBuilt - a.YrBuilt);
      }

      return result;
    },

    paginatedListings() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredListings.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.filteredListings.length / this.itemsPerPage);
    }
  },

  methods: {
    doSearch() {
      this.searchTriggered = true;
      this.currentPage = 1;
      this.filterZip = this.formZip;
      this.filterBedroomsMin = this.formBedroomsMin;
      this.filterBedroomsMax = this.formBedroomsMax;
      this.filterSqMMin = this.formSqMMin;
      this.filterSqMMax = this.formSqMMax;
      this.sortBy = this.formSortBy;
      this.sortOrder = this.formSortOrder;
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
