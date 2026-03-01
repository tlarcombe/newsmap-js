/** @type {Map<string, string>} */
const cache = new Map();

/**
 * Translate a single piece of text to English using Google's translate API.
 * Results are cached for the session.
 * @param {string} text
 * @returns {Promise<string>}
 */
async function translateTitle(text) {
    if (!text || !text.trim()) return text;
    if (cache.has(text)) return /** @type {string} */ (cache.get(text));

    try {
        const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=' + encodeURIComponent(text);
        const r = await fetch(url);
        const data = await r.json();
        const translated = data[0].map((/** @type {any[]} */ t) => t[0]).join('');
        cache.set(text, translated);
        return translated;
    } catch {
        return text;
    }
}

/**
 * Translate all titles in an array of articles.
 * @param {import('./Components/Edition.jsx').Article[]} articles
 * @returns {Promise<import('./Components/Edition.jsx').Article[]>}
 */
export async function translateArticles(articles) {
    return Promise.all(articles.map(async article => ({
        ...article,
        title: await translateTitle(article.title),
        sources: await Promise.all(article.sources.map(async source => ({
            ...source,
            title: await translateTitle(source.title),
        }))),
    })));
}
