import React, { useState, useEffect, useRef } from 'react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

const productCaracters = ({ product, site, handleAddToCart, handleBuyNow, discountedPrice, buttonText }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [descriptionHeight, setDescriptionHeight] = useState(0);
  const [selectedOption, setSelectedOption] = useState(product.productOptions ? product.productOptions[0] : '');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const descriptionRef = useRef(null);

  useEffect(() => {
    if (descriptionRef.current) {
      setDescriptionHeight(descriptionRef.current.scrollHeight);
    }
  }, [product]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getDeliveryDate = (deliveryType) => {
    const today = new Date();
    let deliveryDays;
    if (deliveryType === 'Express') {
      deliveryDays = 2;
    } else if (deliveryType === 'Fast') {
      deliveryDays = 3;
    } else if (deliveryType === 'Normal') {
      deliveryDays = 5;
    } else {
      return '';
    }
    const deliveryDate = addDays(today, deliveryDays);
    return format(deliveryDate, 'EEE dd MMM', { locale: fr });
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  return (
    <div className={`product-info ${product.productBestseller ? 'best-seller' : ''}`}>
      <div className='infos-row'>
        <p className='info'>{product.productInfo}</p>
        {product.productBestseller && <span className='best-wrap'>🏆 Top vente</span>}
      </div>
      <h1>{product.productTitle}</h1>
      {product.productDiscounted ? (
        <>
          <p className='product-price new'>{product.productPrice}<span className='initial-price'>{product.productDiscounted}</span></p>
        </>
      ) : (
        <p className="product-price">{product.productPrice}</p>
      )}
      <p className={`stock ${product.productStock.startsWith('Plus que') ? 'low' : ''}`}>
        <span>⋅</span>{product.productStock}
      </p>
      <p className='delivery'>Livraison estimée : {getDeliveryDate(product.productDelivery)}</p>

      {product.productOptions && (
        <div className="options">
          <label htmlFor="options">Taille</label>
          <select id="options" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
            {product.productOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
          {product.productSizeImg && (
            <button className='guide-btn' onClick={togglePopup}>
              <i className="fas fa-ruler"></i>Guide des tailles
            </button>
          )}
        </div>
        
      )}
      {isPopupVisible && (
        <div className="guide-overlay" onClick={togglePopup}>
          <div className="guide-content" onClick={(e) => e.stopPropagation()}>
            <img src={product.productSizeImg} alt="Guide des tailles" />
            <button className="close-guide" onClick={togglePopup}>X Fermer le guide</button>
          </div>
        </div>
      )}

      <div 
        className={`product-description ${isExpanded ? 'expanded' : ''}`}
        ref={descriptionRef}
        style={{ maxHeight: isExpanded ? 'none' : '160px', overflow: 'hidden' }}
        dangerouslySetInnerHTML={{ __html: product.productDescription }}
      />
      {descriptionHeight > 160 && ( 
        <a className="toggle-description" onClick={toggleExpand}>
          <i className={`fas fa-chevron-down icon ${isExpanded ? 'rotated' : ''}`}></i><span>{isExpanded ? 'Voir moins' : 'Voir plus'}</span>
        </a>
      )}

      <article className="purchase-row">
        <p className='comptor'>Promo fin-hiver : -15%</p>
        <button className='buy-now' onClick={() => handleBuyNow(selectedOption)}>Acheter pour {discountedPrice.toFixed(2)}€</button>
        <button onClick={() => handleAddToCart(selectedOption)}>{buttonText}</button>
      </article>
      <ul className='product-features'>
        <li>
          <span><i className="fas fa-lock"></i>Paiement Sécurisé</span><img src='/card-badges.png' alt={"paiement " + site.keyword} />
        </li>
        <li>
          <span><i className="fas fa-check"></i>En stock, expédié sous 24/48h</span>
        </li>
        <li>
          <span><i className="fas fa-truck"></i>Livraison Suivie OFFERTE</span>
        </li>
      </ul>
      <div className='gift-container'>
        <div className='cover'></div>
        <h4>JOYEUSE ANNÉE 2025 !</h4>
        <h5>AVEC {site.shopName.toUpperCase()}</h5>
        <p>- 15% de réduction avec le code "<strong>YEAR15</strong>"</p>
        <p>- Livraison gratuite sans minimum d'achat</p>
        <p>- Retours étendus jusqu'au 14/03/2025 </p>
      </div>
      <details>
        <summary>Détails techniques du produit</summary>
        <div className="product-content" dangerouslySetInnerHTML={{ __html: product.productCaracters }} />
      </details>
      <details>
        <summary>Paiement, livraison et retours</summary>
        <div className="product-content">
          <span>Moyen de paiement :</span> cartes bancaires (Visa, MasterCard, AMEX), PayPal et virement bancaire.
          <br /><br />
          <span>Expédition :</span> les commandes sont expédiées sous 24 à 48h ouvrées avec un suivi en temps réel.
          <br /><br />
          <span>Suivi :</span> les délais de livraison varient entre 2 et 5 jours ouvrés selon votre localisation. Vous recevrez par mail un numéro de suivi dès l’expédition.
          <br /><br />
          <span>Retours :</span>Si un équipement ne vous convient pas, vous disposez de 60 jours après réception pour le retourner gratuitement. Une fois le colis reçu en parfait état, nous procédons au remboursement sous 2 à 5 jours ouvrés.
          <br /><br />
          <span>Support :</span> Disponible 7j/7 via formulaire en ligne ou par mail à support@{site.domain}.
          <br /><br />
        </div>
      </details>

      
    </div>
  );
};

export default productCaracters;