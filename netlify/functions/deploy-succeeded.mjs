// Fonction déclenchée par Netlify après chaque déploiement réussi (nom de fichier réservé).
// Elle signale les pages du sitemap à IndexNow, que relaient Bing, Yandex, Seznam, Naver…
// La clé est prouvée par le fichier public/<clé>.txt servi à la racine du site.

const SITE_URL = 'https://quizzpermis.byj6n.fr';
const INDEXNOW_KEY = '0a3a9dddb52ac10a464a27f5bafdd78a';

export const handler = async (event) => {
    const {payload} = JSON.parse(event.body ?? '{}');

    // Les deploy previews et branch deploys ne doivent pas être soumis.
    if (payload?.context !== 'production') {
        return {statusCode: 200, body: `IndexNow ignoré (contexte : ${payload?.context})`};
    }

    const sitemap = await fetch(`${SITE_URL}/sitemap.xml`).then(res => res.text());
    const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].trim());
    if (!urlList.length) {
        return {statusCode: 200, body: 'IndexNow ignoré : aucune URL dans le sitemap'};
    }

    const res = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        body: JSON.stringify({
            host: new URL(SITE_URL).host,
            key: INDEXNOW_KEY,
            keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
            urlList
        })
    });

    // 200 : reçu ; 202 : reçu, clé en cours de validation. Le reste est journalisé dans Netlify.
    const message = `IndexNow ${res.status} pour ${urlList.length} URL : ${await res.text()}`;
    console.log(message);
    return {statusCode: 200, body: message};
};
