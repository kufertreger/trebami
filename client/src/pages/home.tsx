import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Users, Handshake, Baby, Home, Car, Wrench } from "lucide-react";
import { translations, type Language } from "@/lib/i18n";

interface HomeProps {
  language: Language;
}

export function HomePage({ language }: HomeProps) {
  const t = translations[language];

  const categoryIcons = {
    childcare: Baby,
    household: Home,
    transport: Car,
    repair: Wrench,
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl text-white">
            <Handshake />
          </div>
          <div className="absolute top-32 right-16 text-4xl text-white">
            <Users />
          </div>
          <div className="absolute bottom-20 left-1/4 text-5xl text-white">
            <Users />
          </div>
          <div className="absolute bottom-10 right-10 text-3xl text-white">
            <Handshake />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t.hero.title}
              <br />
              <span className="text-white/90">{t.hero.subtitle}</span>
            </h1>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/create">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-50 px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Edit className="mr-3 h-5 w-5" />
                  {t.hero.needHelp}
                </Button>
              </Link>
              <Link href="/browse">
                <Button
                  size="lg"
                  className="bg-accent text-white hover:bg-accent/90 px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Users className="mr-3 h-5 w-5" />
                  {t.hero.offerHelp}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t.howItWorks.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 bg-primary/5 hover:bg-primary/10 transition-colors border-primary/20">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Edit className="text-white text-2xl h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {t.howItWorks.step1.title}
                </h3>
                <p className="text-muted-foreground">
                  {t.howItWorks.step1.description}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-secondary/5 hover:bg-secondary/10 transition-colors border-secondary/20">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="text-white text-2xl h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {t.howItWorks.step2.title}
                </h3>
                <p className="text-muted-foreground">
                  {t.howItWorks.step2.description}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-accent/5 hover:bg-accent/10 transition-colors border-accent/20">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Handshake className="text-white text-2xl h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {t.howItWorks.step3.title}
                </h3>
                <p className="text-muted-foreground">
                  {t.howItWorks.step3.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t.categories.title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.categories.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(categoryIcons).map(([category, Icon]) => (
              <Link key={category} href={`/browse?category=${category}`}>
                <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-gray-100 hover:border-primary/20">
                  <CardContent className="text-center p-0">
                    <Icon className="text-3xl text-primary mb-4 h-12 w-12 mx-auto" />
                    <h3 className="font-semibold text-foreground">
                      {t.categories[category as keyof typeof t.categories]}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
