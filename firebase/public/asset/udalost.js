import {convertEventParameters, convertEventToDetailParameters} from './converter.js';

await new Promise((resolve, reject) => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        resolve();
        return;
    }
    document.addEventListener('DOMContentLoaded', () => {
        resolve();
    });
});

const udalostUrlPrefix = 'https://infosoud.gov.cz/InfoSoud/detail-udalosti';
const detailUrlBase = 'https://infosoud.gov.cz/InfoSoud/detail-rizeni';

const url = new URL(window.location.href);
const params = url.searchParams;

const container = document.querySelector('.container');
const msg = document.querySelector('#fallback-msg');

try {
    if (params.has('stop')) throw new Error('Převod zastaven parametrem stop.');

    const udalostParams = convertEventParameters(params);

    console.log('Převedené parametry události:', Array.from(udalostParams.entries()));

    const udalostUrl = new URL(udalostUrlPrefix);
    udalostUrl.search = udalostParams.toString();

    const fallbackUrl = new URL(detailUrlBase);
    fallbackUrl.search = convertEventToDetailParameters(udalostParams).toString();

    const template = document.importNode(document.getElementById('result').content, true);

    const udalostLink = template.querySelector('#udalost-link');
    udalostLink.href = udalostUrl.toString();
    const detailLink = template.querySelector('#detail-link');
    detailLink.href = fallbackUrl.toString();

    const progressBar = document.getElementById('progress');

    const done = () => {
        msg.replaceChildren(template);
        detailLink.focus();
        container.classList.add('done');
        progressBar.style.width = "100%";
    }

    setTimeout(done, 200);
} catch (e) {
    console.error('Chyba při převodu URL události:', e);

    msg.textContent = 'Došlo k chybě při převodu URL: ' + e.message;
    container.classList.add('error');
}
