import React, { useState, useEffect } from 'react';
import Head from '../components/Head';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Contact = ({ site = { contactDescription: '' } }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(storedCart.length);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    setFormSubmitted(true);
  };

  return (
    <div key={site.id} className="container">
      <Head title={`${site.shopName} - ${site.keywordPlurial}`}/>
      <main>

        <Header shopName={site.shopName} cartCount={cartCount} keywordPlurial={site.keywordPlurial}/>
        
        <section className="contact" id='contact'>
          <div className='wrapper'>
            <div className="contact-content">
              <h2>À Votre disposition 7j/7</h2>
              <p>Pour toute question ou suggestion, n'hésitez pas à nous contacter. Notre équipe est à votre écoute et se fera un plaisir de vous répondre rapidement.</p>
              <div className="contact-info">
                <h3>Horaires d'ouverture</h3>
                <p>Lundi - Vendredi: 9h00 - 20h00</p>
                <p>Samedi: 10h00 - 19h00</p>
                <p>Dimanche: 10h00 - 16h00</p>
                <h3>Support client</h3>
                <p>support@{site.domain}</p>
              </div>
            </div>
            <div className="contact-form">
              {formSubmitted ? (
                <p className='confirmation'>Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.</p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <label htmlFor="name">Nom complet</label>
                  <input placeholder="Paul Dupont" type="text" id="name" name="name" required />
                  
                  <div className='row-form'>
                    <label htmlFor="email"><span>Email</span>
                      <input placeholder='exemple@gmail.com' type="email" id="email" name="email" required />
                    </label>
                    <label htmlFor="phone"><span>Téléphone</span>
                      <input placeholder='07 12 34 56 78' type="text" id="phone" name="phone" required />
                    </label>
                  </div>

                  <label htmlFor="message">Votre demande</label>
                  <textarea placeholder="Écrivez votre demande ici..." id="message" name="message" required></textarea>
                  
                  <button type="submit">Envoyer</button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer shopName={site.shopName} footerText={site.footerText} />
    </div>
  );
};

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

export default Contact;