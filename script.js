$(document).ready(function () {
    let products = [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Fetch product data from products.json
    $.getJSON('products.json', function (data) {
        products = data;
        displayProducts(products);
    });

    // Function to display products
    function displayProducts(items) {
        let productList = $('#product-list');
        productList.empty();

        items.forEach(product => {
            let isFavorite = favorites.includes(product.id);
            productList.append(`
                <div class="product-card" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Price: ${product.price.toFixed(2)}</p>
                    <button class="details-btn">View Details</button>
                    <div class="fav-btn">
                        ${isFavorite ? 
                            `<button class="remove-btn" title="Remove from Favorites"><i class="fas fa-trash"></i></button>` :
                            `<button class="fav-icon" title="Add to Favorites"><i class="far fa-heart"></i></button>`}
                    </div>
                </div>
            `);
        });
    }

    // Search functionality
    $('#search-bar').on('keyup', function () {
        let searchQuery = $(this).val().toLowerCase();
        let filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchQuery));
        displayProducts(filteredProducts);
    });

    // Sort functionality
    $('#sort-options').on('change', function () {
        let sortBy = $(this).val();
        let sortedProducts = [...products].sort((a, b) => {
            if (sortBy === 'price') {
                return a.price - b.price;
            } else {
                return a.name.localeCompare(b.name);
            }
        });
        displayProducts(sortedProducts);
    });

    // Add to favorites
    $(document).on('click', '.fav-icon', function () {
        let productId = $(this).closest('.product-card').data('id');
        favorites.push(productId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayProducts(products); // Refresh product display to reflect changes
    });

    // Remove from favorites
    $(document).on('click', '.remove-btn', function () {
        let productId = $(this).closest('.product-card').data('id');
        favorites = favorites.filter(id => id !== productId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayProducts(products); // Refresh product display to reflect changes
    });

    // Product details modal
    $(document).on('click', '.details-btn', function () {
        let productId = $(this).closest('.product-card').data('id');
        let product = products.find(p => p.id === productId);
        $('#product-modal').html(`
            <div class="modal-content">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>Price: ${product.price.toFixed(2)}</p>
                <button id="close-modal">Close</button>
            </div>
        `).fadeIn();
    });

    // Close modal
    $(document).on('click', '#close-modal', function () {
        $('#product-modal').fadeOut();
    });

    // Toggle button
    $('.toggle-button').on('click', function () {
        $('.header-icons').toggle(); // Toggle visibility of icons
    });
});
