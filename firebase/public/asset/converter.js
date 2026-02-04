/**
 * InfoSoud URL Converter - JavaScript verze
 *
 * Převádí staré InfoSoud URL na nové
 */

import courtMapping from './court_mapping.json' with {type: 'json'};

/**
 * Převede parametry ze staré URL na nové
 * @param {URLSearchParams} params
 */
export function convertParameters(params) {
    const org = params.get('org') || '';
    const krajOrg = params.get('krajOrg') || 'VSECHNY_KRAJE';

    const newParams = new URLSearchParams();

    // 1. typOrganizace (vždy)
    newParams.set('typOrganizace', krajOrg || 'VSECHNY_KRAJE');

    // 2. druhOrganizace (logika podle typu soudu)
    const druhOrganizace = getDruhOrganizace(org, krajOrg);

    if (!druhOrganizace) {
        throw new Error(`Nelze určit druhOrganizace pro org: '${org}'.`)
    }

    newParams.set('druhOrganizace', druhOrganizace);

    // 3. okresniSoud (pouze pro okresní soudy)
    if (isOkresniSoud(org)) {
        newParams.set('okresniSoud', org);
    }

    // 4. Přímé převody
    const cisloSenatu = params.get('cisloSenatu');
    if (cisloSenatu) {
        newParams.set('cisloSenatu', cisloSenatu);
    }

    const druhVec = params.get('druhVec');
    if (druhVec) {
        // Pozor: druhVec -> druhVeci
        newParams.set('druhVeci', druhVec);
    }

    const bcVec = params.get('bcVec');
    if (bcVec) {
        newParams.set('bcVec', bcVec);
    }

    const rocnik = params.get('rocnik');
    if (rocnik) {
        newParams.set('rocnik', rocnik);
    }

    return newParams;
}

/**
 * Určí druhOrganizace podle typu soudu
 */
function getDruhOrganizace(org, krajOrg) {
    // Případ 1: org je prázdné -> insolvence -> použít krajOrg
    if (!org || org === '') {
        return krajOrg;
    }

    // Případ 2: org je krajský/městský/vrchní soud -> použít přímo org
    if (isKrajskySoud(org)) {
        return org;
    }

    // Případ 3: org je okresní soud -> vyhledat v mapování
    if (isOkresniSoud(org)) {
        const mapped = courtMapping[org];
        if (!mapped) {
            throw new Error(`Chybí mapování pro okresní soud: '${org}'.`);
        }

        return mapped;
    }

    // Neznámý typ soudu
    throw new Error(`Neznámý typ soudu: '${org}'.`);
}

/**
 * Kontrola, zda je kód okresní soud
 */
function isOkresniSoud(kod) {
    return kod && kod.startsWith('OS');
}

/**
 * Kontrola, zda je kód krajský/městský/vrchní soud
 */
function isKrajskySoud(kod) {
    return kod && (kod.startsWith('KS') || kod.startsWith('MS') || kod.startsWith('VS'));
}
