import React from 'react';

const ProductDetails = ({ product }) => {
  return (
    <section className="product-details">
      <div className="wrapper advantages" dangerouslySetInnerHTML={{ __html: product.productAdvantages }} />
      <div className="wrapper" dangerouslySetInnerHTML={{ __html: product.productHighlight1 }} />
      <div className="wrapper" dangerouslySetInnerHTML={{ __html: product.productHighlight2 }} />
      <div className="wrapper" dangerouslySetInnerHTML={{ __html: product.productHighlight3 }} />
      <div className="wrapper" dangerouslySetInnerHTML={{ __html: product.productHighlight4 }} />
    </section>
  );
};

export default ProductDetails;