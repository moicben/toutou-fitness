import React, { useState, useRef } from 'react';

const Products = ({ title, products, description, showCategoryFilter = true, initialCategoryFilter = 'all' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('az'); // État pour le type de tri
  const [priceRange, setPriceRange] = useState('all'); // État pour le filtre de prix
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter); // État pour le filtre de catégorie
  const productsPerPage = 16;
  const productListRef = useRef(null);

  // Filtrer les produits en fonction de la tranche de prix et de la catégorie
  const filteredProducts = products.filter(product => {
    const price = parseFloat(product.productPrice.replace('€', '').replace(',', '.'));
    const priceMatch = (priceRange === '100-200' && price >= 100 && price < 200) ||
                       (priceRange === '200-300' && price >= 200 && price < 300) ||
                       (priceRange === '300-400' && price >= 300 && price < 400) ||
                       (priceRange === '400+' && price >= 400) ||
                       (priceRange === 'all');
    const categoryMatch = categoryFilter === 'all' || product.productCategory === categoryFilter;
    return priceMatch && categoryMatch;
  });

  // Trier les produits en fonction du type de tri et des best-sellers
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (a.productBestseller && !b.productBestseller) {
      return -1;
    }
    if (!a.productBestseller && b.productBestseller) {
      return 1;
    }

    const priceA = parseFloat(a.productPrice.replace('€', '').replace(',', '.'));
    const priceB = parseFloat(b.productPrice.replace('€', '').replace(',', '.'));
    const titleA = a.productTitle.toLowerCase();
    const titleB = b.productTitle.toLowerCase();

    if (sortOrder === 'asc') {
      return priceA - priceB;
    } else if (sortOrder === 'desc') {
      return priceB - priceA;
    } else if (sortOrder === 'az') {
      return titleA.localeCompare(titleB);
    } else if (sortOrder === 'za') {
      return titleB.localeCompare(titleA);
    }
  });

  // Calculer les produits à afficher sur la page actuelle
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Gérer le changement de page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: productListRef.current.offsetTop - 100,
      behavior: 'smooth'
    });
  };

  // Gérer le changement de tri
  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  // Gérer le changement de filtre de prix
  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
  };

  // Gérer le changement de filtre de catégorie
  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
  };

  return (
    <section className="products">
      <div className='wrapper'>
        <h2>{title}</h2>
        <h4>{description}</h4>
        <div className='product-filters'>
          {showCategoryFilter && (
            <div className="sort-dropdown">
              <label htmlFor="categoryFilter">Catégorie : </label>
              <select
                id="categoryFilter"
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="all">Tous produits</option>
                <option value="velos-appartement">Vélos</option>
                <option value="tapis-de-course">Tapis</option>
                <option value="rameurs-interieur">Rameurs</option>
              </select>
            </div>
          )}
          <div className="sort-dropdown">
            <label htmlFor="sortOrder">Trier par : </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="az">Nom (A-Z)</option>
              <option value="za">Nom (Z-A)</option>
              <option value="asc">Prix croissant</option>
              <option value="desc">Prix décroissant</option>
              
            </select>
          </div>
          <div className="sort-dropdown">
            <label htmlFor="priceRange">Tranche de prix : </label>
            <select
              id="priceRange"
              value={priceRange}
              onChange={(e) => handlePriceRangeChange(e.target.value)}
            >
              <option value="all">Tous les prix</option>
              <option value="100-200">100 à 200€</option>
              <option value="200-300">200 à 300€</option>
              <option value="300-400">300 à 400€</option>
              <option value="400+">400€ et +</option>
            </select>
          </div>
        </div>
        <div className="product-list" ref={productListRef}>
          {currentProducts.map(product => (
            <a href={`/produits/${product.slug}`} key={product.id} className={`product-item ${product.productBestseller ? 'best-seller' : ''}`}>
              <span className='best-wrap'>🏆 TOP VENTE</span>
              <img src={product.productImages[0]} alt={product.productTitle} />
              <h3>{product.productTitle}</h3>
              <p>{product.productPrice}</p>
            </a>
          ))}
        </div>
        {products.length > productsPerPage && (
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Précédent
            </button>
            <span>{currentPage} sur {totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Suivant
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;