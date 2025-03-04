import puppeteer from 'puppeteer-core';

(async () => {
  // Se connecter à une fenêtre Edge déjà ouverte
  const browser = await puppeteer.connect({
    browserURL: 'http://localhost:9223', // Permet de contrôler un navigateur Edge déjà lancé
    defaultViewport: null
  });

  // Ouvrir un nouvel onglet dans la fenêtre existante
  const page = await browser.newPage();

  // Forcer la détection de langue étrangère
  await page.setExtraHTTPHeaders({
    "Accept-Language": "de-DE,de;q=0.9"
  });

  // Aller sur la page cible
  await page.goto('https://www.christopeit-sport.com/ergometer-al-2-s-digital-silver/30-2497', { waitUntil: 'networkidle2' });

  // Supprimer le cache et les cookies
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach(c => document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"));
  });

  // Recharger la page après suppression des cookies
  await page.reload({ waitUntil: "networkidle2" });

  // Attendre un instant pour laisser Edge détecter la langue
  await page.waitForTimeout(3000);

  // Vérifier et cliquer sur le bouton de traduction si présent
  await page.evaluate(() => {
    const translateButton = document.querySelector('button[aria-label="Traduire"]');
    if (translateButton) {
      translateButton.click();
    }
  });

  // Attendre quelques secondes pour voir si la traduction s'affiche
  await page.waitForTimeout(5000);

  console.log("Vérifie si la traduction a été proposée");

})();
