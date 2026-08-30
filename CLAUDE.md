# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Jazyková pravidla

- Dokumentace a komunikace s uživatelem: **česky**.
- Vše spojené s kódem (názvy souborů, proměnných, tříd, komentáře v kódu, commit messages): **anglicky**.

## O projektu

**InfoSoud URL Fixer** — Chrome rozšíření (Manifest V3), které opravuje nefunkční odkazy na InfoSoud a InfoDesku po migraci Ministerstva spravedlnosti ČR z domén `infosoud.justice.cz` / `infodeska.justice.cz` na `infosoud.gov.cz` / `infodeska.gov.cz` (2026). Migrace neproběhla zpětně kompatibilně, staré odkazy vedou jen na prázdný vyhledávací formulář.

Projekt má dvě části, které spolupracují:

1. **`extension/`** — Chrome rozšíření. Používá pouze `declarativeNetRequest` (žádný background script, žádný kód). Statická pravidla přesměrují staré URL na zprostředkující web:
   - `infosoud.justice.cz/InfoSoud/public/search.do` → `https://infosoud-fixer.web.app/detail`
   - `infosoud.justice.cz/InfoSoud/public/list.do` → `https://infosoud-fixer.web.app/udalost`
   - `infodeska.justice.cz/subjekt.aspx` → `https://infosoud-fixer.web.app/infodeska/subjekt`
   - `infodeska.justice.cz/vyveseni.aspx` → `https://infosoud-fixer.web.app/infodeska/vyveseni`
   - `infodeska.justice.cz/soubor.aspx` → `https://infosoud-fixer.web.app/infodeska/soubor`

   Přesměrování přes prostředníka je nutné — MV3 neumožňuje přepisovat URL podle složitých pravidel (query parametry se při redirect transformaci zachovávají, ale nelze je mapovat).

2. **`firebase/`** — Firebase Hosting (projekt `infosoud-fixer`, web `infosoud-fixer.web.app`). Statické stránky, které v prohlížeči analyzují query parametry starého URL, převedou je na nové a přesměrují na `infosoud.gov.cz`.

## Architektura konverze URL

Jádro logiky je [firebase/public/asset/converter.js](firebase/public/asset/converter.js) (ES module, bez závislostí a bez build kroku):

- `convertDetailParameters(params)` — detail řízení: `search.do` → `detail-rizeni`. Přemapování parametrů (`krajOrg` → `typOrganizace`, `druhVec` → `druhVeci`, …).
- `convertEventParameters(params)` — detail události: `list.do` → `detail-udalosti`. Parametr se jmenuje `kraj` (ne `krajOrg`), navíc přidává `organizaceId`.
- `convertEventToDetailParameters(eventParams)` — fallback z události na detail řízení (soud při migraci přečísloval `poradiUdalosti`, takže odkaz na událost nemusí sedět — stránka `udalost.html` proto nepřesměrovává automaticky, ale nabídne uživateli obě možnosti).
- [court_mapping.json](firebase/public/asset/court_mapping.json) — mapování všech 86 okresních soudů (`OS*`) na nadřízené krajské organizace (`KS*`). Nové URL vyžaduje u okresního soudu i parametr nadřízené organizace (`druhOrganizace`), který ve starém URL nebyl.

Konverze InfoDesky je v [firebase/public/asset/infodeska-converter.js](firebase/public/asset/infodeska-converter.js) — nový systém používá path-based URL, funkce proto vrací cestu (string), ne URLSearchParams:

- `convertSubjektPath(params)` — `subjekt.aspx?subjkod=X` → `/eudpub/uredni-deska/organizace/X`.
- `convertVyveseniPath(params)` — `vyveseni.aspx?vyveseniid=X` → `/eudpub/uredni-deska/organizace/0/vyveseni/X` (staré URL nenese kód organizace, nový systém ale akceptuje `0` jako zástupný segment).
- Odkazy na soubory (`soubor.aspx?souborid=X`) **převést nelze** — nový systém používá neodvoditelné UUID identifikátory.

Vstupní stránky:
- [detail.html](firebase/public/detail.html) + [detail.js](firebase/public/asset/detail.js) — automatický redirect s progress barem (transitionend + 1s fallback timeout).
- [udalost.html](firebase/public/udalost.html) + [udalost.js](firebase/public/asset/udalost.js) — kvůli přečíslování událostí nepřesměrovává automaticky, zobrazí volbu (událost vs. přehled řízení).
- [infodeska/subjekt.html](firebase/public/infodeska/subjekt.html) a [infodeska/vyveseni.html](firebase/public/infodeska/vyveseni.html) — automatický redirect podle vzoru detail.html.
- [infodeska/soubor.html](firebase/public/infodeska/soubor.html) — čistě statická stránka bez JS: vysvětlení, že odkaz nelze opravit, s tlačítkem na novou InfoDesku.
- Query parametr `?stop` na stránkách s převodem zastaví převod (debug).
- Pozor: vedle složky `firebase/public/infodeska/` nesmí vzniknout soubor `infodeska.html` (kolize s `cleanUrls`).

## Vývoj a nasazení

Projekt nemá package.json, build ani testy — čisté statické soubory.

**Lokální vývoj Firebase části** (emulátor na portu 5000, viz `rules-dev.json`):
```bash
cd firebase && firebase serve
```

**Přepnutí rozšíření na lokální endpoint:** v [extension/manifest.json](extension/manifest.json) prohodit `enabled` u `ruleset_1` (prod) a `ruleset_2` (dev, míří na `http://127.0.0.1:5000`). Před releasem vrátit zpět!

**Nasazení hostingu:**
```bash
cd firebase && firebase deploy
```

**Testování rozšíření:** načíst složku `extension/` přes `chrome://extensions/` → „Load unpacked". Testovací staré URL je v README (sekce Instalace, krok 3).

**Release rozšíření:** verze se udržuje v `manifest.json` (`version`), taguje se `vX.Y.Z`, distribuce přes Chrome Web Store + ZIP v GitHub Releases. Složka `extension/_metadata/` je artefakt Chromu a je v `.gitignore`.

## Konvence

- Commit messages anglicky, krátké, lowercase prefix podle oblasti je běžný (např. `readme: …`).
- UI texty stránek i rozšíření (description v manifestu) jsou česky — cílová skupina jsou čeští uživatelé.
- Soukromí je klíčový závazek projektu (viz [PRIVACY.md](PRIVACY.md)): žádný sběr dat, žádná analytika, vše se zpracovává v prohlížeči. Nepřidávat nic, co by odesílalo data třetím stranám.
