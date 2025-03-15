import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import emailjs from 'emailjs-com';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Products from '../components/Products'; 
import Testimonials from '../components/Testimonials';
import About from '../components/About';
import Reviews from '../components/Reviews';
import Head from '../components/Head';

import content from '../content.json';
import productsData from '../products.json';

const Home = ({ site, products }) => {
  const [cartCount, setCartCount] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(storedCart.length);
  }, []);

  useEffect(() => {
    emailjs.init("8SL7vzVHt7qSqEd4i");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());

    emailjs.send('gmail-benedikt', 'new-contact', formObject)
      .then(() => {
        setFormSubmitted(true);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
      });

    e.target.reset();
  };

  return (
    <div key={site.id} className="container">
      <Head title={`${site.shopName} - ${site.keywordPlurial}`}/>
      
      <main>

        <Header shopName={site.shopName} cartCount={cartCount} keywordPlurial={site.keywordPlurial}/>
        
        <section className="hero">
            <h1>{site.heroTitle}</h1>
            <p>{site.heroDescription}</p>
            <a href="/boutique"><button>Découvrir nos produits</button></a>
            <div className='filter'></div>
            <img src='/images/hero.jpg' alt={site.sourceCategory} />
        </section>
        
        <section className="intro">
          <div className='wrapper'>
            <h2>{site.introTitle}</h2>
            <p>{site.introDescription}</p>
          </div>
        </section>

        <Products title={`Les tapis de course ${site.keyword} !`} products={products} />
        
        <About site={site}/>
        
        <Reviews site={site} product={products[0]}/>
        
        
      </main>
      <Footer shopName={site.shopName} footerText={site.footerText} />
    </div>
  );
}

export async function getStaticProps() {
  const content = await import('../content.json');
  const productsData = await import('../products.json');

  return {
    props: {
      site: content.sites[0],
      products: productsData.products,
    },
  };
}

export default Home;