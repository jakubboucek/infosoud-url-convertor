/**
 * InfoSoud URL Converter - JavaScript version
 *
 * Converts old InfoSoud URLs to new ones
 */

import courtMapping from './court_mapping.json' with {type: 'json'};

/**
 * Helper function to resolve organization (OS vs KS/MS/VS).
 * Returns an object with parameters for the URL.
 */
function resolveOrganizationLogic(orgValue) {
    const result = {
        druhOrganizace: null,
        okresniSoud: null
    };

    if (!orgValue) return result;

    if (orgValue.startsWith('OS')) {
        // It's a district court -> we must find the parent organization
        const parentOrg = courtMapping[orgValue];

        // If we don't have a mapping, use org as a fallback, although it should be in the map
        result.druhOrganizace = parentOrg || orgValue;
        result.okresniSoud = orgValue;
    } else {
        // It's a regional/city/superior court -> use it directly
        result.druhOrganizace = orgValue;
        result.okresniSoud = null; // For KS the okresniSoud is not added
    }

    return result;
}

/**
 * Shared transformation of basic parameters that are the same for both URLs.
 */
function applyCommonTransforms(oldParams, newParams) {
    // 1. Senate number (unchanged)
    if (oldParams.has('cisloSenatu')) {
        newParams.set('cisloSenatu', oldParams.get('cisloSenatu'));
    }

    // 2. Bc case (unchanged)
    if (oldParams.has('bcVec')) {
        newParams.set('bcVec', oldParams.get('bcVec'));
    }

    // 3. Year (unchanged)
    if (oldParams.has('rocnik')) {
        newParams.set('rocnik', oldParams.get('rocnik'));
    }

    // 4. Type of case -> Case type (parameter name change!)
    if (oldParams.has('druhVec')) {
        newParams.set('druhVeci', oldParams.get('druhVec'));
    }
}

/**
 * Original function for CASE DETAIL (search.do -> detail-rizeni)
 * @param {URLSearchParams} params
 */
export function convertDetailParameters(params) {
    const newParams = new URLSearchParams();

    // 1. Organization type (krajOrg -> typOrganizace)
    if (params.has('krajOrg')) {
        const krajOrg = params.get('krajOrg');
        // If krajOrg is "VSECHNY_KRAJE" or another value, use it
        newParams.set('typOrganizace', krajOrg === 'null' ? 'VSECHNY_KRAJE' : krajOrg);
    } else {
        // Default if missing
        newParams.set('typOrganizace', 'VSECHNY_KRAJE');
    }

    // 2. ORG resolution (Insolvence vs Courts)
    const org = params.get('org');

    if (!org) {
        // Insolvency or not filled -> take from krajOrg
        const krajOrg = params.get('krajOrg');
        if (krajOrg) {
            newParams.set('druhOrganizace', krajOrg);
        }
    } else {
        // Standard courts
        const orgInfo = resolveOrganizationLogic(org);
        if (orgInfo.druhOrganizace) newParams.set('druhOrganizace', orgInfo.druhOrganizace);
        if (orgInfo.okresniSoud) newParams.set('okresniSoud', orgInfo.okresniSoud);
    }

    // 3. Common parameters
    applyCommonTransforms(params, newParams);

    return newParams;
}

/**
 * New function for EVENT DETAIL (list.do -> detail-udalosti)
 * @param {URLSearchParams} params
 */
export function convertEventParameters(params) {
    const newParams = new URLSearchParams();

    // 1. Organization type (kraj -> typOrganizace)
    // Note: here the parameter is named 'kraj', not 'krajOrg'
    const kraj = params.get('kraj');
    if (kraj && kraj !== 'null') {
        newParams.set('typOrganizace', kraj);
    } else {
        newParams.set('typOrganizace', 'VSECHNY_KRAJE');
    }

    // 2. ORG resolution and organizaceId
    const org = params.get('org');
    if (org) {
        const orgInfo = resolveOrganizationLogic(org);

        if (orgInfo.druhOrganizace) newParams.set('druhOrganizace', orgInfo.druhOrganizace);
        if (orgInfo.okresniSoud) newParams.set('okresniSoud', orgInfo.okresniSoud);

        // NEW for Event: always add organizaceId equal to the original org
        newParams.set('organizaceId', org);
    }

    // 3. Event-specific parameters
    if (params.has('druhUdalosti')) {
        newParams.set('druhUdalosti', params.get('druhUdalosti'));
    }

    if (params.has('poradiUdalosti')) {
        newParams.set('poradiUdalosti', params.get('poradiUdalosti'));
    }

    // 4. Common parameters
    applyCommonTransforms(params, newParams);

    return newParams;
}

/**
 * Converts parameters meant for event detail into parameters for case detail.
 * Assumes the input is already modernized parameters from convertEventParameters().
 * * @param {URLSearchParams} eventParams - Parameters after passing through convertEventParameters
 */
export function convertEventToDetailParameters(eventParams) {
    // Create a copy so we don't modify the original object
    const detailParams = new URLSearchParams(eventParams);

    // 1. Remove parameters that case detail does not know
    // These parameters are specific only to the particular event
    detailParams.delete('druhUdalosti');
    detailParams.delete('poradiUdalosti');

    // 2. Remove 'organizaceId'
    // Case detail does not use this parameter (it uses only druhOrganizace/okresniSoud,
    // which are already correctly set in the object from the previous step)
    detailParams.delete('organizaceId');

    // Everything else (cisloSenatu, bcVec, rocnik, druhVeci, typOrganizace,
    // druhOrganizace, okresniSoud) we leave as-is.

    return detailParams;
}
