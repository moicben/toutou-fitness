import React, { useRef, useEffect, useState } from 'react';
import CheckoutVerify from './CheckoutVerify';

const CheckoutForm = ({ currentStep, showStep, selectedPaymentMethod, setSelectedPaymentMethod, proceedCheckout, discountedPrice, cart, site, showVerificationWrapper, setShowVerificationWrapper }) => {
  const expiryDateRef = useRef(null);
  const cardNumberRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  useEffect(() => {
    const handleExpiryDateInput = (event) => {
      const { value } = event.target;
      if (value.length === 2 && !value.includes('/')) {
        event.target.value = value + '/';
      }
    };

    const expiryDateInput = expiryDateRef.current;
    if (expiryDateInput) {
      expiryDateInput.addEventListener('input', handleExpiryDateInput);
    }

    return () => {
      if (expiryDateInput) {
        expiryDateInput.removeEventListener('input', handleExpiryDateInput);
      }
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

    const cardNumberInput = cardNumberRef.current;
    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', handleCardNumberInput);
    }

    return () => {
      if (cardNumberInput) {
        cardNumberInput.removeEventListener('input', handleCardNumberInput);
      }
    };
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setGlobalError('');
    setFormErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      if (value) {
        delete newErrors[name];
      } else {
        newErrors[name] = `${name} est obligatoire`;
      }
      return newErrors;
    });
  };

  const validateStep = (step) => {
    const errors = {};
    const requiredFields = ['address', 'postalCode', 'city', 'email', 'fullName', 'phone'];

    requiredFields.forEach(field => {
      const value = document.querySelector(`input[name="${field}"]`).value;
      if (!value) {
        errors[field] = `${field} est obligatoire`;
        console.log(`${field} est obligatoire`);
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = (step) => {
    if (step === 1 && !validateStep(step)) {
      setGlobalError('Renseignez-vos informations avant de payer.');
      return;
    }
    setGlobalError('');
    showStep(step);
  };

  const handleRetry = () => {
    setShowVerificationWrapper(false);
    showStep(1); // Retour à l'étape du choix de modes de paiement
  };

  return (
    <form className="checkout-form" onSubmit={proceedCheckout}>
      <input type="hidden" name="totalPrice" value={discountedPrice} />
      <input type="hidden" name="products" value={cart.map(item => `${item.productTitle} (x${item.quantity})`).join(', ')} />
      <input type="hidden" name="website" value={site.shopName} />

      <div className={`checkout-step ${currentStep === 0 ? 'active' : ''}`}>
        <h3>Informations de livraison</h3>
        <input type="text" name="address" placeholder="Adresse du domicile" onChange={handleInputChange} />
        <input type="text" name="suite" placeholder="Maison, suite, numéro, etc. (optionnel)" onChange={handleInputChange} />
        <div className="form-row">
          <input type="text" name="postalCode" placeholder="Code postal" onChange={handleInputChange} />
          <input type="text" name="city" placeholder="Ville" onChange={handleInputChange} />
        </div>
        <h3>Compte client</h3>
        <input type="text" name="email" placeholder="Email" onChange={handleInputChange} />
        <div className="form-row">
          <input type="text" name="fullName" placeholder="Nom complet" onChange={handleInputChange} />
          <input type="text" name="phone" placeholder="Numéro de téléphone" onChange={handleInputChange} />
        </div>
        <button type="button" id="delivery-checkout" onClick={() => handleNextStep(1)}>Passer au paiement</button>
        {globalError && <p className="error">{globalError}</p>}
      </div>

      <div className={`checkout-step ${currentStep === 1 ? 'active' : ''}`}>
        <h3 className='method'>Moyen de paiement</h3>
        <label className={`payment-method ${selectedPaymentMethod === 'card' ? 'selected' : ''}`}>
          <input type="radio" name="paymentMethod" value="card" checked={selectedPaymentMethod === 'card'} onChange={() => setSelectedPaymentMethod('card')} />
          <img className="card" src='/card-badges.png' alt='cartes bancaires' />
          <span>Cartes bancaires</span>
        </label>
        <label className={`payment-method ${selectedPaymentMethod === 'bankTransfer' ? 'selected' : ''}`}>
          <input type="radio" name="paymentMethod" value="bankTransfer" checked={selectedPaymentMethod === 'bankTransfer'} onChange={() => setSelectedPaymentMethod('bankTransfer')} />
          <img src='/virement.png' className='transfer' alt='virement bancaire' />
          <span>Virement bancaire</span>
        </label>
        <label className={`unvalaible payment-method ${selectedPaymentMethod === 'paypal' ? 'selected' : ''}`}>
          <input type="radio" name="paymentMethod" value="paypal" checked={selectedPaymentMethod === 'paypal'} onChange={() => setSelectedPaymentMethod('paypal')} />
          <img src='/paypal-simple.png' alt='cartes bancaires' />
          <span>Indisponible</span>
        </label>
        <article className='checkout-buttons'>
          <button className="back-checkout" type="button" onClick={() => showStep(0)}><i className="fas fa-arrow-left"></i></button>
          <button type="button" id="payment-checkout" onClick={() => handleNextStep(2)}>Confirmer</button>
        </article>
        {globalError && <p className="error">{globalError}</p>}
      </div>

      <div className={`checkout-step ${currentStep === 2 ? 'active' : ''}`}>
        {selectedPaymentMethod === 'card' && (
          <>
            <h3>Payer par carte bancaire</h3>
            <p className='paiement'>Entrez vos informations de paiement :</p>
            <input type="text" name="cardHolder" placeholder="Titulaire de la carte" onChange={handleInputChange} required/>
            <input type="text" name="cardNumber" placeholder="1234 1234 1234 1234" ref={cardNumberRef} onChange={handleInputChange} required/>
            <div className="form-row">
              <input type="text" name="expiryDate" placeholder="MM/YY" maxLength="5" ref={expiryDateRef} onChange={handleInputChange} required/>
              <input type="text" name="cvv" placeholder="CVV" maxLength="3" onChange={handleInputChange} required/>
            </div>
            <article className='checkout-buttons'>
              <button className="back-checkout" type="button" onClick={() => showStep(1)}><i className="fas fa-arrow-left"></i></button>
              <button id="pay-checkout" type="submit">Procéder au paiement</button>
          </article>
          </>
        )}

        {selectedPaymentMethod === 'bankTransfer' && (
          <>
            <h3>Payer par virement bancaire</h3>
            <p>Utlisez les informations suivantes :</p>
            <div className="iban-group">
              <p><strong>Titulaire du compte : </strong>{site.shopName} SAS</p>
              <p><strong>IBAN : </strong>FR76 1695 8000 0128 0938 8426 106</p>
              <p><strong>BIC/SWIFT : </strong>QNTOFRP1XXX</p>
              <p className='row'><span className='id'><strong>Objet :</strong> Commande 182F57</span><span className='amount'><strong>Montant :</strong> {discountedPrice}€</span></p>
            </div>
            <p className='smaller'>Une fois le virement effectué, cliquez ci-dessous pour recevoir la confirmation et le suivi de commande.</p>
            <article className='checkout-buttons'>
              <button className="back-checkout" type="button" onClick={() => showStep(1)}><i className="fas fa-arrow-left"></i></button>
              <button onClick={() => window.location.href = '/confirmation'}>Suivre ma commande</button>
          </article>
          </>
        )}

        
        {globalError && <p className="error">{globalError}</p>}
      </div>

      {showVerificationWrapper && (
        <CheckoutVerify
          verificationError={false}
          bankName="Bank Name"
          bankLogo="/path/to/logo.png"
          cardType="Visa"
          cardScheme="Credit"
          cardCountry="France"
          discountedPrice={discountedPrice}
          onRetry={handleRetry}
        />
      )}
    </form>
  );
};

export default CheckoutForm;