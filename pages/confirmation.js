import React from 'react';
import { useRouter } from 'next/router';

export default function Confirmation() {
  const router = useRouter();
  const { orderId } = router.query;

  return (
    <div className="confirmation-container">
      <h2>Commande confirmée</h2>
      <p>Merci pour votre commande, {orderId}.</p>
      <p>Nous vous remercions pour votre confiance.</p>
      <p>Comptez environ 3 jours ouvrés avant réception de votre commande à bon port !</p>
      <a href="/"><button type="button">Retour à la boutique</button></a>
    </div>
  );
}