import React from 'react';
import Head from 'next/head';

const myHead = ({ title, description, favicon }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href={favicon} />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
  
      <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16883090550"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'AW-16883090550');
      </script>
    </Head>
  );
};

export default myHead;