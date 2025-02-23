import React, { useState, useRef } from 'react';

const Products = ({ title, products, description }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;
  const productListRef = useRef(null);

  // Calculer les produits à afficher sur la page actuelle
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Gérer le changement de page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: productListRef.current.offsetTop - 100,
      behavior: 'smooth'
    });
  };

  return (
    <section className="products">
      <div className='wrapper'>
        <h2>{title}</h2>
        <h4>{description}</h4>
        <div className="product-list" ref={productListRef}>
          {currentProducts.map(product => (
            <a href={`/produits/${product.slug}`} key={product.id} className="product-item">
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