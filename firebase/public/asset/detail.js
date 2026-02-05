import {convertDetailParameters} from './converter.js';

await new Promise((resolve, reject) => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        resolve();
        return;
    }
    document.addEventListener('DOMContentLoaded', () => {
        resolve();
    });
});

const detailUrlBase = 'https://infosoud.gov.cz/InfoSoud/detail-rizeni';

const url = new URL(window.location.href);
const params = url.searchParams;

const container = document.querySelector('.container');
const msg = document.querySelector('#fallback-msg');

try {
    if (params.has('stop')) throw new Error('Převod zastaven parametrem stop.');

    const newParams = convertDetailParameters(params);

    console.log('Převedené parametry detailu:', Array.from(newParams.entries()));

    const newUrl = new URL(detailUrlBase);
    newUrl.search = newParams.toString();

    const a = document.createElement('a');
    a.href = newUrl.toString();
    a.textContent = 'Nalezen nový odkaz na detail řízení. Klikněte zde pro přesměrování.';
    msg.replaceChildren(a);

    const progressBar = document.getElementById('progress');

    const go = () =>window.location.assign(newUrl.href);

    progressBar.addEventListener('transitionend', go);
    // Fallback
    setTimeout(go, 1000);

    progressBar.style.width = "100%";
} catch (e) {
    console.error('Chyba při převodu URL detailu řízení:', e);

    const msg = document.querySelector('#fallback-msg');
    msg.textContent = 'Došlo k chybě při převodu URL: ' + e.message;
    container.classList.add('error');
}
