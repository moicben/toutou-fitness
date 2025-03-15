import React, { useState, useRef } from 'react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

const Products = ({ title, products, description, categories = [], showCategoryFilter = true, initialCategoryFilter = 'all', disablePagination = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('az'); // État pour le type de tri
  const [priceRange, setPriceRange] = useState('all'); // État pour le filtre de prix
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter); // État pour le filtre de catégorie
  const productsPerPage = 12;
  const productListRef = useRef(null);

  // Filtrer les produits en fonction de la tranche de prix et de la catégorie
  const filteredProducts = products.filter(product => {
    const price = parseFloat(product.productPrice.replace('€', '').replace(',', '.'));
    const priceMatch = (priceRange === '100-200' && price >= 100 && price < 200) ||
                       (priceRange === '200-300' && price >= 200 && price < 300) ||
                       (priceRange === '300-400' && price >= 300 && price < 400) ||
                       (priceRange === '400+' && price >= 400) ||
                       (priceRange === 'all');
    const categoryMatch = categoryFilter === 'all' || product.productCategorySlug === categoryFilter;
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
  const currentProducts = disablePagination ? sortedProducts : sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

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

  // Calculer la date de livraison estimée
  const getDeliveryDate = (deliveryType) => {
    const today = new Date();
    let deliveryDays;
    if (deliveryType === 'Express') {
      deliveryDays = 2;
    } else if (deliveryType === 'Fast') {
      deliveryDays = 3;
    } else if (deliveryType === 'Normal') {
      deliveryDays = 5;
    } else {
      return '';
    }
    const deliveryDate = addDays(today, deliveryDays);
    
    return format(deliveryDate, 'EEE dd MMM', { locale: fr });
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
                <option value="all">N'importe</option>
                {categories.map(category => (
                  <option key={category.slug} value={category.slug}>{category.name}</option>
                ))}
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
              
              <img src={product.productImages[0]} alt={product.productTitle} />
              <div className='infos-row'>
                <p className='info'>{product.productInfo}</p>
                {product.productBestseller && <span className='best-wrap'>🏆 Top vente</span>}
              </div>
              <h3>{product.productTitle}</h3>
              
              <p className={`stock ${product.productStock.startsWith('Plus que') ? 'low' : ''}`}>
                <span>⋅</span>{product.productStock}
              </p>
              <p className='delivery'>Livraison estimée : {getDeliveryDate(product.productDelivery)}</p>
              <p className='price'>
                {product.productDiscounted ? (
                  <>
                    <span className='initial-price'>{product.productDiscounted}</span>
                    <span className='new-price'>{product.productPrice}</span>
                  </>
                ) : (
                  product.productPrice
                )}
              </p>
              
            </a>
          ))}
        </div>
        {!disablePagination && products.length > productsPerPage && (
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