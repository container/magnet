import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

export const languages = ["sl", "en"] as const;
export type Language = (typeof languages)[number];

const defaultLanguage: Language = "sl";

const dictionary = {
  sl: {
    "site.brandSubtitle": "Dom ustvarjalnih skupnosti",
    "nav.presentation": "Predstavitev",
    "nav.spaces": "Prostori",
    "nav.events": "Dogodki",
    "nav.programmes": "Programi",
    "nav.community": "Skupnost",
    "nav.news": "Novice",
    "nav.contact": "Kontakt",
    "presentation.history": "Zgodovina DOMA",
    "presentation.access": "Dostop",
    "presentation.renovation": "Prenova",
    "presentation.cafe": "Kavarna",
    "presentation.partners": "Partnerji",
    "presentation.media": "Mediji",
    "nav.memberLogin": "Prijava za člane",
    "cta.rentSpace": "Najemi prostor",
    "language.label": "Jezik",
    "language.sl": "SL",
    "language.en": "EN",
    "language.switchTo": "Preklopi jezik na",
    "footer.summary": "Prostori, dogodki, programi in skupnost v DOM.",
    "footer.visitTitle": "Kontakt in lokacija",
    "footer.contact": "Kontakt",
    "footer.location": "Kako do nas",
    "footer.hoursTitle": "Odpiralni čas",
    "footer.hoursText": "Pon-pet: 9:00-20:00. Sob: 10:00-14:00.",
    "footer.newsletterTitle": "E-obveščanje",
    "footer.newsletterText": "Prejemajte obvestila o dogodkih, programih in novicah DOM.",
    "footer.newsletterEmail": "E-mail",
    "footer.newsletterConsent": "S prijavo soglašate s prejemanjem obvestil. Odjava bo mogoča v vsakem sporočilu.",
    "footer.newsletterSubmit": "Prijavi se",
    "footer.newsletterSaved": "Hvala. V pravem sistemu bi prijavo obdelal izbrani newsletter ponudnik.",
    "footer.socialTitle": "Sledi nam",
    "footer.fundingTitle": "Partnerji",
    "footer.fundingText": "Več o financiranju prenove in vsebin.",
    "footer.shopTitle": "Trgovina",
    "footer.shopLink": "Obišči trgovino",
    "footer.legalTitle": "Pogoji",
    "footer.terms": "Pogoji uporabe",
    "footer.privacy": "Varstvo zasebnosti",
    "legal.termsTitle": "Pogoji uporabe",
    "legal.termsText": "Stran bo vsebovala pogoje uporabe spletnega mesta, pravila uporabe vsebin in osnovne informacije za obiskovalce.",
    "legal.privacyTitle": "Varstvo zasebnosti",
    "legal.privacyText": "Stran bo vsebovala informacije o obdelavi osebnih podatkov, kontaktnih obrazcih, e-obveščanju in piškotkih.",
    "home.heroEyebrow": "DOM Celje",
    "home.heroTitle": "DOM je prostor za ustvarjalne skupnosti, dogodke, programe in sodelovanja v Celju.",
    "home.heroText": "Spoznajte prostore, prihajajoče dogodke, programe skupnosti in možnosti sodelovanja.",
    "home.eventsTitle": "Prihajajoči dogodki",
    "home.allEvents": "Vsi dogodki",
    "home.spacesTitle": "Prostori v DOM",
    "home.spacesOverview": "Pregled prostorov",
    "home.programmesTitle": "Programi",
    "home.allProgrammes": "Vsi programi",
    "home.newsTitle": "Zadnje novice",
    "home.allNews": "Vse novice",
    "cta.viewEvents": "Poglej dogodke",
    "card.spaceDetail": "Več o prostoru",
    "card.eventDetail": "Podrobnosti",
    "card.programmeDetail": "Odpri program",
    "card.newsDetail": "Preberi",
    "notFound.title": "Stran ni najdena",
    "notFound.text": "Ta stran ne obstaja ali ni objavljena.",
    "notFound.back": "Nazaj"
  },
  en: {
    "site.brandSubtitle": "Home for creative communities",
    "nav.presentation": "About",
    "nav.spaces": "Spaces",
    "nav.events": "Events",
    "nav.programmes": "Programmes",
    "nav.community": "Community",
    "nav.news": "News",
    "nav.contact": "Contact",
    "presentation.history": "DOM history",
    "presentation.access": "Access",
    "presentation.renovation": "Renovation",
    "presentation.cafe": "Cafe",
    "presentation.partners": "Partners",
    "presentation.media": "Media",
    "nav.memberLogin": "Member login",
    "cta.rentSpace": "Rent a space",
    "language.label": "Language",
    "language.sl": "SL",
    "language.en": "EN",
    "language.switchTo": "Switch language to",
    "footer.summary": "Spaces, events, programmes and community at DOM.",
    "footer.visitTitle": "Contact and location",
    "footer.contact": "Contact",
    "footer.location": "How to get here",
    "footer.hoursTitle": "Opening hours",
    "footer.hoursText": "Mon-Fri: 9:00-20:00. Sat: 10:00-14:00.",
    "footer.newsletterTitle": "Newsletter",
    "footer.newsletterText": "Receive updates about DOM events, programmes and news.",
    "footer.newsletterEmail": "Email",
    "footer.newsletterConsent": "By subscribing, you agree to receive updates. Unsubscribe will be available in every message.",
    "footer.newsletterSubmit": "Subscribe",
    "footer.newsletterSaved": "Thank you. In the real system, the selected newsletter provider would process this subscription.",
    "footer.socialTitle": "Follow us",
    "footer.fundingTitle": "Partners",
    "footer.fundingText": "More about renovation and programme funding.",
    "footer.shopTitle": "Shop",
    "footer.shopLink": "Visit the shop",
    "footer.legalTitle": "Terms",
    "footer.terms": "Terms of use",
    "footer.privacy": "Privacy",
    "legal.termsTitle": "Terms of use",
    "legal.termsText": "This page will contain website terms of use, content usage rules and basic information for visitors.",
    "legal.privacyTitle": "Privacy",
    "legal.privacyText": "This page will contain information about personal data processing, contact forms, newsletter subscriptions and cookies.",
    "home.heroEyebrow": "DOM Celje",
    "home.heroTitle": "DOM is a place for creative communities, events, programmes and collaborations in Celje.",
    "home.heroText": "Explore spaces, upcoming events, community programmes and ways to take part.",
    "home.eventsTitle": "Upcoming events",
    "home.allEvents": "All events",
    "home.spacesTitle": "Spaces at DOM",
    "home.spacesOverview": "Spaces overview",
    "home.programmesTitle": "Programmes",
    "home.allProgrammes": "All programmes",
    "home.newsTitle": "Latest news",
    "home.allNews": "All news",
    "cta.viewEvents": "View events",
    "card.spaceDetail": "More about this space",
    "card.eventDetail": "Details",
    "card.programmeDetail": "Open programme",
    "card.newsDetail": "Read",
    "notFound.title": "Page not found",
    "notFound.text": "This page does not exist or is not published.",
    "notFound.back": "Back"
  }
} satisfies Record<Language, Record<string, string>>;

export type TranslationKey = keyof (typeof dictionary)["sl"];

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const language = normalizeLanguage(searchParams.get("lang"));

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: (nextLanguage) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set("lang", nextLanguage);
        setSearchParams(nextParams);
      },
      t: (key) => dictionary[language][key] ?? dictionary.sl[key] ?? key
    }),
    [language, searchParams, setSearchParams]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}

export function withLanguageFlag(to: string, language: Language) {
  const [pathAndSearch, hash = ""] = to.split("#");
  const [pathname, search = ""] = pathAndSearch.split("?");
  const params = new URLSearchParams(search);
  params.set("lang", language);
  const query = params.toString();
  return `${pathname}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

function normalizeLanguage(value: string | null): Language {
  return languages.includes(value as Language) ? (value as Language) : defaultLanguage;
}
