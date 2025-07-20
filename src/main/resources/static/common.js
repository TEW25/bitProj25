$(function(){
    $("#navbar-placeholder, #nav-bar").load("/nav.html", function() {
        // Set the active class on the correct nav item.
        const currentPage = window.location.pathname.toLowerCase() || "/";
        
        $('.navbar-nav .nav-link').each(function(){
            // Normalize both href and currentPage for comparison
            let href = (this.getAttribute('href') || '').toLowerCase().trim();
            // Highlight for /Category-Brand or /category_subcategory.html
            if (
                (href === "/category-brand" && (currentPage === "/category-brand" || currentPage.includes("category_subcategory"))) ||
                href === currentPage
            ) {
                $(this).addClass('active');
                $(this).attr('aria-current', 'page');
            }
        });
    });
});
