const app = Vue.createApp({
  data() {
    return {
      listings: [],
      currentPage: 1,
      itemsPerPage: 5,
      totalResults: 0,

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
      return this.listings;
    },

    totalPages() {
      return Math.ceil(this.totalResults / this.itemsPerPage);
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
    
        fetch(`http://localhost:5000/api/listings?page=${this.currentPage}&limit=${this.itemsPerPage}&${params.toString()}`)
          .then(res => res.json())
          .then(data => {
            this.listings = data.results;
            this.totalResults = data.total;
            this.currentPage = data.page;
            this.searchTriggered = true;
            console.log("New totalResults:", this.totalResults);
        })
        .catch(err => console.error("API error:", err));
      },

    doSearch() {
      this.currentPage = 1;
      this.fetchListings();
    },

    setPage(newPage) {
    if (newPage !== '...' && newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.fetchListings();
    }
  }
  }

  
 // watch: {
 // currentPage(newPage) {
 //     this.fetchListings();
 // }
 // }
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

app.component('pagination-controls', {
  props: ['currentPage', 'totalPages'],
  emits: ['page-change'],
  computed: {
    pagesToShow() {
      const totalShown = 7; // number of buttons total (including first/last, ellipses, etc.)
      const pages = [];

      // Always show the first page
      pages.push(1);

      let start = Math.max(2, this.currentPage - 2);
      let end = Math.min(this.totalPages - 1, this.currentPage + 2);

      // Adjust window if at the start
      if (this.currentPage <= 4) {
        start = 2;
        end = Math.min(this.totalPages - 1, 6);
      }

      // Adjust window if near the end
      if (this.currentPage >= this.totalPages - 3) {
        start = Math.max(2, this.totalPages - 5);
        end = this.totalPages - 1;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Always show the last page
      if (this.totalPages > 1) pages.push(this.totalPages);

      return pages;
    }
  },
  template: `
    <div class="pagination-controls">
      <button @click="$emit('page-change', currentPage - 1)" :disabled="currentPage === 1">Prev</button>

      <button
        v-for="page in pagesToShow"
        :key="page"
        :class="{ active: page === currentPage, ellipsis: page === '...' }"
        @click="$emit('page-change', page)"
        :disabled="page === '...'"
      >
        {{ page }}
      </button>

      <button @click="$emit('page-change', currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
    </div>
  `
});
app.mount('#app')
