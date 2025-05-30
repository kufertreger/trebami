import { translations, type Language } from "@/lib/i18n";
import { Facebook, Instagram, Twitter } from "lucide-react";

interface FooterProps {
  language: Language;
}

export function Footer({ language }: FooterProps) {
  const t = translations[language];

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Trebami.me</h3>
            <p className="text-background/80 mb-6 max-w-md">
              {language === "sr" 
                ? "Povezujemo ljude koji trebaju pomoć sa onima koji žele da pomognu. Gradimo snažniju lokalnu zajednicu kroz međusobnu podršku."
                : "Connecting people who need help with those who want to help. Building stronger local communities through mutual support."
              }
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              {language === "sr" ? "Korisni linkovi" : "Useful links"}
            </h4>
            <ul className="space-y-2 text-background/80">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  {language === "sr" ? "Kako funkcioniše" : "How it works"}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  {language === "sr" ? "Pravila korišćenja" : "Terms of use"}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  {language === "sr" ? "Privatnost" : "Privacy"}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  {language === "sr" ? "Kontakt" : "Contact"}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              {language === "sr" ? "Kategorije" : "Categories"}
            </h4>
            <ul className="space-y-2 text-background/80">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  {t.categories.childcare}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  {t.categories.household}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  {t.categories.transport}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  {t.categories.repair}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/70">
          <p>&copy; 2024 Trebami.me. {language === "sr" ? "Sva prava zadržana." : "All rights reserved."}</p>
        </div>
      </div>
    </footer>
  );
}
