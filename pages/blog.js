import React from 'react';
import Link from 'next/link';
import Head from '../components/Head';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Blog = ({ site, articles }) => {
  return (
    <div key={site.id} className="container">
      <Head title={`${site.shopName} - Blog`} />
      <main>
        <Header shopName={site.shopName} cartCount={0} keywordPlurial={site.keywordPlurial} />
        
        <section className="blog" id='blog'>
          <div className='wrapper'>
            <div className="blog-content">
              <h1>Guides et astuces {site.shopName}</h1>
              <div className="articles-list">
                {articles.map(article => (
                  <a href={`/blog/${article.slug}`} key={article.slug} className="article-item">
                    <img src={article.image} alt={article.title} />
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                    <span >Lire la suite</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer shopName={site.shopName} footerText={site.footerText} />
    </div>
  );
};

export async function getStaticProps() {
  const content = await import('../content.json');
  const articlesData = await import('../articles.json');

  return {
    props: {
      site: content.sites[0],
      articles: articlesData.articles,
    },
  };
}

export default Blog;