import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaShoppingCart, FaBars, FaTimes, FaRegTrashAlt } from 'react-icons/fa';


const Header = ({ shopName, keywordPlurial }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const cartDrawerRef = useRef(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartDrawerRef.current && !cartDrawerRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen]);

  const handleRemoveFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = quantity;
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  useEffect(() => {
    const cartDrawer = document.querySelector('.cart-drawer');
    if (isCartOpen) {
      // Attendre que le composant soit monté pour ajouter la classe
      setTimeout(() => cartDrawer.classList.add('open'), 25);
    } else {
      //cartDrawer.classList.remove('open');
    }
  }, [isCartOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    const nav = document.querySelector('.header .nav ul');
    if (!isMenuOpen) {
      nav.classList.add('open');
    } else {
      nav.classList.remove('open');
    }
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  };

  return (
    <>
      <section className="sub">
        Solde de Février : -15% sur tous nos produits avec le code : "<span style={{ fontWeight: 600 }}>FEVRIER15</span>" !
      </section>
      <header className="header">
          <a className="logo-header" href="/"><img src='/logo.svg' alt="Logo"/></a>
          <nav className="nav">
            <ul>
              <li><a href="/boutique">TOUS LES équipements</a></li>
              <li><a href="/velos-appartement">Vélos d'appartement</a></li>
              <li><a href="/tapis-de-course">Tapis de course</a></li>
              <li><a href="/rameurs-interieur">Rameurs d'intérieur</a></li>
            </ul>
          </nav>
          <div className="cart-container" onClick={toggleCart}>
            <FaShoppingCart className="cart-icon" />
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </div>
          <span className="burger-icon" onClick={toggleMenu}>{isMenuOpen ? <FaTimes /> : <FaBars />} </span>
      </header>
      {isCartOpen && (
        <div className="cart-drawer" ref={cartDrawerRef}>
          <h2>Panier</h2>
          {cart.length === 0 ? (
            <p>Votre panier est vide</p>
          ) : (
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                <img src={item.productImages[0]} alt={item.productTitle} />
                <div>
                  <h3>{item.productTitle}</h3>
                  <p>{item.productPrice}</p>
                  <div className="quantity-selector">
                    <button onClick={() => handleQuantityChange(index, item.quantity > 1 ? item.quantity - 1 : 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(index, item.quantity + 1)}>+</button>
                  </div>
                  <button className="delete" onClick={() => handleRemoveFromCart(index)}>
                    <FaRegTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="total">
            <h4>Total dû :</h4>
            <p>{cart.reduce((total, item) => total + parseFloat(item.productPrice.replace('€', '').replace(',', '.')) * item.quantity, 0).toFixed(2)} €</p>
        </div>
        <button className="close" onClick={toggleCart}>+</button>
        <a href='/paiement'><button className="checkout">Passer à la caisse</button></a>
      </div>
        )}
    </>
  );
};

export default Header;