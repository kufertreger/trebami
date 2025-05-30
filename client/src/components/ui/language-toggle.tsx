import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import type { Language } from "@/lib/i18n";

interface LanguageToggleProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageToggle({ currentLanguage, onLanguageChange }: LanguageToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "sr" ? "en" : "sr";
    onLanguageChange(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLanguage}
        className="flex items-center space-x-1 text-sm hover:text-primary"
      >
        <Globe className="h-4 w-4" />
        <span>{currentLanguage.toUpperCase()}</span>
      </Button>
    </div>
  );
}
