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

  if (!categoryName) {
    return <div>Loading...</div>;
  }

  return (
    <div key={site.id} className="container">
      <Head>
        <title>{category.seoTitle}</title>
        <meta name="description" content={category.seoDescription} />
      </Head>
      <main>
        <Header shopName={site.shopName} cartCount={cartCount} keywordPlurial={site.keywordPlurial} />
        <Products title={`${category.name} Tous les équipements`} products={products} description={category.description} />
        <About site={site} />
        <Testimonials site={site} />
      </main>
      <Footer shopName={site.shopName} footerText={site.footerText} />
    </div>
  );
};

export async function getStaticPaths() {
  const categoriesData = await import('../categories.json');
  const paths = categoriesData.categories.map(category => ({
    params: { categoryName: category.slug },
  }));

  // Ajout d'une chaîne de caractères de test
  paths.push({ params: { categoryName: 'tapis-de-course' } });

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const content = await import('../content.json');
  const productsData = await import('../products.json');
  const categoriesData = await import('../categories.json');
  const category = categoriesData.categories.find(cat => cat.slug === params.categoryName);
  const products = productsData.products.filter(product => product.productCategory === params.categoryName);

  return {
    props: {
      site: content.sites[0],
      category,
      products,
    },
  };
}

export default Category;