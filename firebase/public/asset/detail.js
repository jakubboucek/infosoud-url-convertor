import {convertParameters} from './converter.js';

await new Promise((resolve, reject) => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        resolve();
        return;
    }

    document.addEventListener('DOMContentLoaded', () => {
        resolve();
    });
});

const NewUrlPrefix = 'https://infosoud.gov.cz/InfoSoud/detail-rizeni';

const url = new URL(window.location.href);
const params = url.searchParams;

const container = document.querySelector('.container');
const msg = document.querySelector('#fallback-msg');


try {
    if (params.has('stop')) throw new Error('Převod zastaven parametrem stop.');

    const newParams = convertParameters(params);

    console.log('Předené parametry:', Array.from(newParams.entries()));

    const newUrl = new URL(NewUrlPrefix);
    newUrl.search = newParams.toString();

    const a = document.createElement('a');
    url.search = newParams.toString();
    a.href = newUrl.toString();
    a.textContent = 'Nalezen nový odkaz na detail řízení. Klikněte zde pro přesměrování.';
    msg.innerHTML = a.outerHTML;

    const progressBar = document.getElementById('progress');

    progressBar.style.width = "100%";

    progressBar.addEventListener('transitionend', () => {
        window.location.assign(newUrl.href);
    });
} catch (e) {
    console.error('Chyba při převodu URL:', e);

    const msg = document.querySelector('#fallback-msg');
    msg.textContent = 'Došlo k chybě při převodu URL: ' + e.message;
    container.classList.add('error');
}
