import { createMollieClient } from '@mollie/api-client';

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_TEST_KEY });

export default async (req, res) => {
  if (req.method === 'POST') {
    const { cardToken } = req.body;

    try {
      const payment = await mollieClient.payments.create({
        method: 'creditcard',
        amount: {
          currency: 'EUR',
          value: '11.00'
        },
        description: 'Order #12346',
        redirectUrl: 'https://webshop.example.org/order/12345/',
        webhookUrl: 'https://webshop.example.org/payments/webhook/',
        cardToken: cardToken
      });

      // Redirect to confirmation page after successful payment
      res.redirect(303, '/confirmation');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};