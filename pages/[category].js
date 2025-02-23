import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/router';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Products from '../components/Products';
import About from '../components/About';
import Testimonials from '../components/Testimonials';

const Category = ({ site, category, products }) => {
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const { categoryName } = router.query;

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(storedCart.length);
  }, []);

  return (
    <div key={site.id} className="container">
      <Head>
        <title>{`${categoryName} - ${site.shopName}`}</title>
      </Head>
      <main>
        <Header shopName={site.shopName} cartCount={cartCount} keywordPlurial={site.keywordPlurial} />
        <Products title={`${categoryName} Tous les équipements`} products={products} description={category.description} />
        <About site={site} />
        <Testimonials site={site} />
      </main>
      <Footer shopName={site.shopName} footerText={site.footerText} />
    </div>
  );
};

export async function getStaticPaths() {
  const content = await import('../content.json');
  const paths = content.categories.map(category => ({
    params: { categoryName: category.name },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const content = await import('../content.json');
  const productsData = await import('../products.json');
  const category = content.categories.find(cat => cat.name === params.categoryName);
  const products = productsData.products.filter(product => product.category === params.categoryName);

  return {
    props: {
      site: content.sites[0],
      category,
      products,
    },
  };
}

export default Category;