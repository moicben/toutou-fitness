import React from 'react';
import { useRouter } from 'next/router';

export default function Confirmation() {
  const router = useRouter();
  const { orderId } = router.query;

  return (
    <div className="confirmation-container">
      <img src="/logo.svg" alt="Logo" className="logo" />
      <h2>Commande confirmée</h2>
        <p>Merci pour votre commande <strong>182F57</strong>,
        <br/>Votre commande est en cours de traitement.
        <br/>Vous recevrez sous peu, votre suivi par mail.
      </p>
      <a href="/"><button type="button">Retourner à la boutique</button></a>
    </div>
  );
}