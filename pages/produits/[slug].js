import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import content from '../../content.json';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Products from '../../components/Products';
import productsData from '../../products.json';
import Reviews from '../../components/Reviews';
import ProductDetails from '../../components/ProductDetails';

import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

// Event snippet for Clic "Ajouter au panier" conversion page
function gtag_report_conversion(url) {
  var callback = function () {
    if (typeof(url) != 'undefined') {
      window.location = url;
    }
  };

  // Compte 1 (Initial)
  gtag('event', 'conversion', {
      'send_to': 'AW-16916919273/hNu3CMaG7aoaEOnnzoI_',
      'value': 10.0,
      'currency': 'EUR',
      'event_callback': callback
  });

  return false;
}

export default function ProductDetail({ product, site, products, relatedProducts }) {
  const [cartCount, setCartCount] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [visibleImageIndex, setVisibleImageIndex] = useState(0);
  const [buttonText, setButtonText] = useState('Ajouter au panier');
  const [selectedOption, setSelectedOption] = useState(product.productOptions ? product.productOptions[0] : '');
  const sliderRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [timeLeft, setTimeLeft] = useState(() => {
    return 7 * 3600 + 37 * 60 + 20;
  });
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const cartDrawer = document.querySelector('.cart-drawer');
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        sessionStorage.setItem('timeLeft', JSON.stringify(newTime));
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 1.2) {
        setShowBanner(true);
      } else {
        setShowBanner(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  if (!product || !site) {
    return <div>Produit ou site non trouvé</div>;
  }

  const handleAddToCart = async () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id === product.id && item.selectedOption === selectedOption);

    if (productIndex !== -1) {
      cart[productIndex].quantity += quantity;
    } else {
      const productWithQuantity = { ...product, quantity, selectedOption };
      cart.push(productWithQuantity);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    setButtonText('Ajouté !');
    setTimeout(() => setButtonText('Ajouter au panier'), 3000);
    document.querySelector('.cart-container').click();

    gtag_report_conversion();
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleNextImages = () => {
    if (visibleImageIndex + 1 < images.length) {
      setVisibleImageIndex(visibleImageIndex + 1);
      setSelectedImageIndex(visibleImageIndex + 1);
    } else {
      setVisibleImageIndex(0);
      setSelectedImageIndex(0);
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  useEffect(() => {
    const largeImage = document.querySelector('.large-image');
    if (largeImage) {
      largeImage.style.setProperty('--mouse-x', `${mousePosition.x}%`);
      largeImage.style.setProperty('--mouse-y', `${mousePosition.y}%`);
    }
  }, [mousePosition]);

  const images = product.productImages || [];
  const visibleImages = images.slice(visibleImageIndex, visibleImageIndex + 4);
  if (visibleImages.length < 4) {
    visibleImages.push(...images.slice(0, 4 - visibleImages.length));
  }

  const discountedPrice = parseFloat(product.productPrice.replace('€', '').replace(',', '.')) * 0.85;

  return (
    <div className="container">
      <Head>
        <title>{`${product.productTitle} - ${site.shopName}`}</title>
      </Head>
      
      <main>
        <Header shopName={site.shopName} keywordPlurial={site.keywordPlurial} />
        
        <section className="product-hero">
          <div className="product-columns">
            <div className="product-image">
              {images[selectedImageIndex] && (
                <img
                  src={images[selectedImageIndex]}
                  alt={product.productTitle}
                  className="large-image"
                  onMouseMove={handleMouseMove}
                />
              )}
              <div className="thumbnail-container">
                {visibleImages.map((image, index) => (
                  image && (
                    <img
                      key={index + visibleImageIndex}
                      src={image}
                      alt={`${product.productTitle} ${index + 1}`}
                      onClick={() => handleImageClick(index + visibleImageIndex)}
                      className={`thumbnail ${selectedImageIndex === index + visibleImageIndex ? 'selected' : ''}`}
                    />
                  )
                ))}
                {images.length > 4 && (
                  <button className="next-button" onClick={handleNextImages}>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                )}
              </div>
            </div>
            <ProductDetails
              product={product}
              site={site}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
              discountedPrice={discountedPrice}
              buttonText={buttonText}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
          </div>
        </section>

        <Reviews product={product} />
  
        <section className="product-highlights">
          {/* <div className="wrapper advantages" dangerouslySetInnerHTML={{ __html: product.productAdvantages }}/> */}
          <div className="wrapper" dangerouslySetInnerHTML={{ __html: product.productHighlight1 }}/>
 
        </section>
  
        <Products title={`Nos autres ${product.productCategoryName}`} products={relatedProducts} showCategoryFilter={false} />
      </main>
      <Footer shopName={site.shopName} footerText={site.footerText} />

      {showBanner && (
        <div className="cta-banner">
          <div className="banner-content">
              <h3>{product.productTitle}</h3>
              <p className='price'>{product.productPrice}</p>
              <p className='info'>{product.productInfo}</p>
          </div>
          <button onClick={handleBuyNow}>Acheter maintenant</button>
       </div>
      )}
    </div>
  );

  function handleBuyNow() {
    handleAddToCart();
    window.location.href = '/paiement';
  }
}

export async function getStaticPaths() {
  const paths = productsData.products.map(product => ({
    params: { slug: product.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const product = productsData.products.find(p => p.slug === params.slug);
  const site = content.sites[0];
  const products = productsData.products.filter(p => p.siteId === site.id);
  const relatedProducts = productsData.products.filter(p => p.productCategorySlug === product.productCategorySlug && p.slug !== product.slug);

  return {
    props: {  
      product: product || null,
      site: site || null,
      products,
      relatedProducts,
    },
  };
}