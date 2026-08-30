/**
 * InfoDeska URL Converter
 *
 * Converts old InfoDeska URLs (infodeska.justice.cz) to new ones (infodeska.gov.cz).
 * The new system uses path-based URLs, so the functions return a path string
 * instead of URLSearchParams.
 */

/**
 * Reads a required parameter or throws a user-facing (Czech) error.
 * @param {URLSearchParams} params
 * @param {string} name
 * @returns {string}
 */
function requireParam(params, name) {
    const value = params.get(name);
    if (!value) {
        throw new Error(`V adrese chybí povinný parametr „${name}“.`);
    }
    return value;
}

/**
 * Board of a subject (subjekt.aspx -> uredni-deska/organizace)
 * @param {URLSearchParams} params
 * @returns {string} path on the new domain
 */
export function convertSubjektPath(params) {
    const subjkod = requireParam(params, 'subjkod');
    return `/eudpub/uredni-deska/organizace/${encodeURIComponent(subjkod)}`;
}

/**
 * Published document (vyveseni.aspx -> uredni-deska/organizace/{org}/vyveseni)
 *
 * The old URL does not carry the organization code required by the new URL,
 * but the new system accepts 0 as a wildcard organization segment.
 * @param {URLSearchParams} params
 * @returns {string} path on the new domain
 */
export function convertVyveseniPath(params) {
    const vyveseniId = requireParam(params, 'vyveseniid');
    return `/eudpub/uredni-deska/organizace/0/vyveseni/${encodeURIComponent(vyveseniId)}`;
}
