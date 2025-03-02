import { useRouter } from "next/router";
import productsData from "../products.json";
import categoriesData from "../categories.json";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Products from '../components/Products';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Head from 'next/head';

const CategoryPage = ({ category, filteredProducts, site }) => {
  if (!category) {
    return <h1>Erreur 404 - Catégorie non trouvée</h1>;
  }

  return (
    <div key={site.id} className="container">
      <Head>
        <title>{`${category.seoTitle} - ${site.shopName}`}</title>
      </Head>

      <main>
        <Header shopName={site.shopName} cartCount={0} keywordPlurial={site.keywordPlurial} />
        <Products title={`Tous les ${category.name}`} products={filteredProducts} description={category.seoDescription} initialCategoryFilter={category.slug} />
        <About site={site} />
        <Testimonials site={site} />
      </main>
      <Footer shopName={site.shopName} footerText={site.footerText} />
    </div>
  );
};

// 🔹 Génération des pages dynamiques
export async function getStaticPaths() {
  const paths = categoriesData.categories.map((category) => ({
    params: { category: category.slug },
  }));

  return { paths, fallback: false };
}

// 🔹 Préchargement des données côté serveur
export async function getStaticProps({ params }) {
  const category = categoriesData.categories.find((cat) => cat.slug === params.category);
  const filteredProducts = productsData.products.filter(
    (product) => product.productCategory === params.category
  );

  if (!category) {
    return { notFound: true };
  }

  const content = await import('../content.json');

  return {
    props: { category, filteredProducts, site: content.sites[0] },
  };
}

export default CategoryPage;