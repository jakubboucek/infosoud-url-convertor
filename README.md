# InfoSoud URL Convertor

> **Automatické opravy nefunkčních odkazů na InfoSoud po migraci na novou doménu**

## 📋 O projektu

Ministerstvo spravedlnosti ČR v roce 2026 provedlo migraci aplikace InfoSoud z domény `infosoud.justice.cz` na novou doménu `infosoud.gov.cz`. Bohužel byla migrace provedena **bez zachování zpětné kompatibility** - staré odkazy přestaly fungovat.

Tento projekt řeší vzniklý problém tím, že **automaticky opravuje nefunkční odkazy** a přesměrovává je na správnou novou adresu.

## 🎯 Pro koho je to určeno

Pokud:
- Máte uložené záložky na InfoSoud, které přestaly fungovat
- Ve vašich dokumentech (Word, Excel, PDF) jsou odkazy na staré InfoSoud URL
- Pracujete s archivovanými materiály obsahujícími staré odkazy
- Dostáváte emaily se starými InfoSoud odkazy
- Potřebujete přístup ke konkrétním soudním řízením přes staré URL

**Toto rozšíření problém vyřeší** - při kliknutí na jakýkoliv starý odkaz budete automaticky přesměrováni na správnou stránku na nové doméně.

## ⚠️ Jaký problém to řeší

Migrace InfoSoudu ze strany Ministerstva na novou doménu bohužel zcela popírá smysl ukládání odkazů na konkrétní soudní řízení. **Celý smysl odkazů je ušetřit si opakované ruční vyhledávání** již dříve nalezené informace.

### Před instalací rozšíření:
```
❌ Kliknete na starý uložený odkaz na detail řízení 
   → Přesměrováno na úvodní stránku s prázdným vyhledávacím formulářem
   → Musíte ručně znovu vyplnit všechny údaje a hledat řízení
```

https://github.com/user-attachments/assets/cc874cbd-8373-4871-afcf-ffb856d01760


### Po instalaci rozšíření:
```
✅ Kliknete na starý odkaz 
   → Automaticky přesměrováno přímo na detail konkrétního řízení
   → Žádné ruční vyhledávání není potřeba
```

https://github.com/user-attachments/assets/d761a88d-c1ea-4abb-8a11-181caea35909


**Rozšíření zachovává původní funkčnost** - přímý přístup k detailu konkrétního soudního řízení, tak jak to bylo před migrací.

## 🚀 Instalace

Rozšíření není dostupné v Chrome Web Store, proto je nutné nainstalovat ho ručně:

### Krok 1: Stažení rozšíření

1. Přejděte na [stránku Releases](https://github.com/jakubboucek/infosoud-url-convertor/releases)
2. Stáhněte nejnovější verzi (soubor `infosoud-url-fixer.zip`)
3. Rozbalte stažený ZIP soubor do libovolné složky na vašem počítači

### Krok 2: Instalace do Chrome

1. Otevřete Chrome a přejděte na `chrome://extensions/`
2. V pravém horním rohu **zapněte "Režim pro vývojáře"** (Developer mode)
3. Klikněte na tlačítko **"Načíst rozšíření bez balíčku"** (Load unpacked)
4. Vyberte složku, do které jste rozbalili ZIP soubor
5. Rozšíření se nainstaluje a začne automaticky fungovat

### Krok 3: Ověření funkčnosti

Vyzkoušejte jakýkoliv starý InfoSoud odkaz, například:
```
https://infosoud.justice.cz/InfoSoud/public/search.do?type=spzn&typSoudu=os&krajOrg=KSZPCPM&org=OSZPCPM&cisloSenatu=32&druhVec=T&bcVec=61&rocnik=2025&spamQuestion=23&agendaNc=CIVIL
```

Měli byste být **automaticky přesměrováni** na novou adresu na doméně `infosoud.gov.cz`.

## 🔧 Jak to funguje

1. **Rozšíření zachytí** váš pokus o otevření staré stránky InfoSoudu 
2. **Přesměruje vás** na zprostředkující stránku ([infosoud-fixer.web.app](https://infosoud-fixer.web.app/))
3. **Zprostředkující stránka**:
   - Analyzuje původní URL
   - Převede staré parametry na nové
   - Okamžitě vás přesměruje na správnou novou adresu

Celý proces trvá zlomek sekundy a je plně automatický.

## 📊 Co rozšíření podporuje

- ✅ **Všechny okresní soudy** (86 soudů) - automatické mapování na nadřízené organizace
- ✅ **Krajské soudy** - včetně odvolacích řízení
- ✅ **Městské soudy**
- ✅ **Insolvence** - správné zpracování insolvenčních řízení
- ✅ **Všechny typy řízení** - civilní, trestní, obchodní, exekuční, atd.

## 🔒 Soukromí a bezpečnost

- Rozšíření **neshromažďuje žádné osobní údaje**
- Veškeré zpracování probíhá lokálně ve vašem prohlížeči nebo na otevřeném endpointu
- Zdrojový kód je **plně otevřený** a dostupný ke kontrole
- Rozšíření vyžaduje pouze minimální oprávnění nutná pro funkčnost

## 🆘 Řešení problémů

### Rozšíření nefunguje

1. Zkontrolujte, že je rozšíření **zapnuté** na stránce `chrome://extensions/`
2. Zkuste rozšíření **obnovit** (klikněte na ikonu reload u rozšíření)
3. Zkontrolujte, že nemáte žádné **chyby** u rozšíření (klikněte na "Chyby")

### Některé odkazy se nepřesměrovávají

1. Zkontrolujte, že odkaz skutečně vede na `infosoud.justice.cz`
2. Ujistěte se, že URL obsahuje cestu `/InfoSoud/public/search.do`
3. Nahlaste problém v [Issues](https://github.com/jakubboucek/infosoud-url-convertor/issues)

### Přesměrování nefunguje v jiném prohlížeči

Rozšíření je vytvořeno **pouze pro Google Chrome** a prohlížeče založené na Chromium (Edge, Brave, Opera). Ve Firefoxu nebo Safari nefunguje.

## 💬 Hlášení chyb a návrhy

Pokud narazíte na problém nebo máte návrh na vylepšení:

1. Zkontrolujte, zda problém už není nahlášen v [Issues](https://github.com/jakubboucek/infosoud-url-convertor/issues)
2. Pokud ne, vytvořte nový issue s detailním popisem problému
3. Ideálně přiložte:
   - Původní nefunkční URL
   - Na jakou URL byste měli být přesměrováni
   - Screenshot nebo popis chyby

## 🤝 Přispění do projektu

Projekt je otevřený a vítáme jakékoliv příspěvky:

- 🐛 Hlášení chyb
- 💡 Návrhy na vylepšení
- 🔧 Pull requesty s opravami nebo novými funkcemi
- 📖 Vylepšení dokumentace

## 📜 Licence

Projekt je licencován pod [MIT licencí](LICENSE).

## 👤 Autor

**Jakub Bouček**
- Web: [jakub-boucek.cz](https://www.jakub-boucek.cz/)
- GitHub: [@jakubboucek](https://github.com/jakubboucek)

## ⚖️ Prohlášení

Tento projekt **není oficiální součástí** aplikace InfoSoud ani Ministerstva spravedlnosti ČR. Jedná se o **nezávislé komunitní řešení** vzniklého problému po migraci aplikace.

Projekt byl vytvořen jako reakce na nedostatečně provedenou migraci ze strany státních orgánů, kdy nebyla zachována zpětná kompatibilita se starými odkazy.

Všechny stránky soudních řízení převedené přes tento nástroj prochází přes pomocnou webovou stránku
([infosoud-fixer.web.app](https://infosoud-fixer.web.app/)), která je provozována autorem rozšíření a není součástí InfoSoudu. Tato stránka slouží pouze k přesměrování na správné nové URL a neukládá žádnádata o uživatelích. Toto přesměrování přes *prostředníka* je nezbytné, protože rozšíření v prohlížeči nemůže přímo měnit URL na základě složitých pravidel migrace (tuto možnost prohlížeče [přestaly podporovat v roce 2024](https://www.root.cz/zpravicky/google-zacne-za-nekolik-dni-vypinat-starsi-rozsireni-pro-chrome/)).

---

**Pokud vám projekt pomohl, dejte mu ⭐ na GitHubu!**
