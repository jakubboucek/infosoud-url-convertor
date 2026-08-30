import {convertSubjektPath} from './infodeska-converter.js';

await new Promise((resolve, reject) => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        resolve();
        return;
    }
    document.addEventListener('DOMContentLoaded', () => {
        resolve();
    });
});

const infodeskaOrigin = 'https://infodeska.gov.cz';

const url = new URL(window.location.href);
const params = url.searchParams;

const container = document.querySelector('.container');
const msg = document.querySelector('#fallback-msg');

try {
    if (params.has('stop')) throw new Error('Převod zastaven parametrem stop.');

    const newUrl = new URL(convertSubjektPath(params), infodeskaOrigin);

    console.log('Převedená adresa úřední desky subjektu:', newUrl.toString());

    const a = document.createElement('a');
    a.href = newUrl.toString();
    a.textContent = 'Nalezen nový odkaz na úřední desku. Klikněte zde pro přesměrování.';
    msg.replaceChildren(a);

    const progressBar = document.getElementById('progress');

    const go = () => window.location.assign(newUrl.href);

    progressBar.addEventListener('transitionend', go);
    // Fallback
    setTimeout(go, 1000);

    progressBar.style.width = "100%";
} catch (e) {
    console.error('Chyba při převodu URL úřední desky:', e);

    msg.textContent = 'Došlo k chybě při převodu URL: ' + e.message;
    container.classList.add('error');
}
