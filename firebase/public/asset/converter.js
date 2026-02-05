
/**
 * InfoSoud URL Converter - JavaScript verze
 *
 * Převádí staré InfoSoud URL na nové
 */

import courtMapping from './court_mapping.json' with {type: 'json'};

/**
 * Pomocná funkce pro vyřešení organizace (OS vs KS/MS/VS).
 * Vrací objekt s parametry pro URL.
 */
function resolveOrganizationLogic(orgValue) {
    const result = {
        druhOrganizace: null,
        okresniSoud: null
    };

    if (!orgValue) return result;

    if (orgValue.startsWith('OS')) {
        // Je to okresní soud -> musíme najít nadřízenou organizaci
        const parentOrg = courtMapping[orgValue];

        // Pokud nemáme mapování, použijeme org jako fallback, ale správně by to mělo být v mapě
        result.druhOrganizace = parentOrg || orgValue;
        result.okresniSoud = orgValue;
    } else {
        // Je to krajský/městský/vrchní soud -> použijeme přímo
        result.druhOrganizace = orgValue;
        result.okresniSoud = null; // U KS se okresní soud nepřidává
    }

    return result;
}

/**
 * Sdílená transformace základních parametrů, které jsou stejné pro obě URL.
 */
function applyCommonTransforms(oldParams, newParams) {
    // 1. Číslo senátu (beze změny)
    if (oldParams.has('cisloSenatu')) {
        newParams.set('cisloSenatu', oldParams.get('cisloSenatu'));
    }

    // 2. Bc věc (beze změny)
    if (oldParams.has('bcVec')) {
        newParams.set('bcVec', oldParams.get('bcVec'));
    }

    // 3. Ročník (beze změny)
    if (oldParams.has('rocnik')) {
        newParams.set('rocnik', oldParams.get('rocnik'));
    }

    // 4. Druh věci -> Druh věci (Změna názvu parametru!)
    if (oldParams.has('druhVec')) {
        newParams.set('druhVeci', oldParams.get('druhVec'));
    }
}

/**
 * Původní funkce pro DETAIL ŘÍZENÍ (search.do -> detail-rizeni)
 * @param {URLSearchParams} params
 */
export function convertDetailParameters(params) {
    const newParams = new URLSearchParams();

    // 1. Typ organizace (krajOrg -> typOrganizace)
    if (params.has('krajOrg')) {
        const krajOrg = params.get('krajOrg');
        // Pokud je krajOrg "VSECHNY_KRAJE" nebo jiná hodnota, použijeme ji
        newParams.set('typOrganizace', krajOrg === 'null' ? 'VSECHNY_KRAJE' : krajOrg);
    } else {
        // Default pokud chybí
        newParams.set('typOrganizace', 'VSECHNY_KRAJE');
    }

    // 2. Řešení ORG (Insolvence vs Soudy)
    const org = params.get('org');

    if (!org) {
        // Insolvence nebo nevyplněno -> vezmeme z krajOrg
        const krajOrg = params.get('krajOrg');
        if (krajOrg) {
            newParams.set('druhOrganizace', krajOrg);
        }
    } else {
        // Standardní soudy
        const orgInfo = resolveOrganizationLogic(org);
        if (orgInfo.druhOrganizace) newParams.set('druhOrganizace', orgInfo.druhOrganizace);
        if (orgInfo.okresniSoud) newParams.set('okresniSoud', orgInfo.okresniSoud);
    }

    // 3. Společné parametry
    applyCommonTransforms(params, newParams);

    return newParams;
}

/**
 * Nová funkce pro DETAIL UDÁLOSTI (list.do -> detail-udalosti)
 * @param {URLSearchParams} params
 */
export function convertEventParameters(params) {
    const newParams = new URLSearchParams();

    // 1. Typ organizace (kraj -> typOrganizace)
    // Pozor: Zde se parametr jmenuje 'kraj', nikoliv 'krajOrg'
    const kraj = params.get('kraj');
    if (kraj && kraj !== 'null') {
        newParams.set('typOrganizace', kraj);
    } else {
        newParams.set('typOrganizace', 'VSECHNY_KRAJE');
    }

    // 2. Řešení ORG a organizaceId
    const org = params.get('org');
    if (org) {
        const orgInfo = resolveOrganizationLogic(org);

        if (orgInfo.druhOrganizace) newParams.set('druhOrganizace', orgInfo.druhOrganizace);
        if (orgInfo.okresniSoud) newParams.set('okresniSoud', orgInfo.okresniSoud);

        // NOVINKA pro Událost: Vždy se přidává organizaceId rovné původnímu org
        newParams.set('organizaceId', org);
    }

    // 3. Specifické parametry události
    if (params.has('druhUdalosti')) {
        newParams.set('druhUdalosti', params.get('druhUdalosti'));
    }

    if (params.has('poradiUdalosti')) {
        newParams.set('poradiUdalosti', params.get('poradiUdalosti'));
    }

    // 4. Společné parametry
    applyCommonTransforms(params, newParams);

    return newParams;
}

/**
 * Převede parametry určené pro detail události na parametry pro detail řízení.
 * Předpokládá, že vstupem jsou již modernizované parametry z funkce convertEventParameters().
 * * @param {URLSearchParams} eventParams - Parametry po průchodu funkcí convertEventParameters
 */
export function convertEventToDetailParameters(eventParams) {
    // Vytvoříme kopii, abychom nezměnili původní objekt
    const detailParams = new URLSearchParams(eventParams);

    // 1. Odstraníme parametry, které detail řízení nezná
    // Tyto parametry jsou specifické jen pro konkrétní událost
    detailParams.delete('druhUdalosti');
    detailParams.delete('poradiUdalosti');

    // 2. Odstraníme 'organizaceId'
    // Detail řízení tento parametr nepoužívá (používá jen druhOrganizace/okresniSoud,
    // které už jsou v objektu správně nastaveny z předchozího kroku)
    detailParams.delete('organizaceId');

    // Vše ostatní (cisloSenatu, bcVec, rocnik, druhVeci, typOrganizace,
    // druhOrganizace, okresniSoud) necháme tak, jak je.

    return detailParams;
}
