import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, User, Clock } from "lucide-react";
import { useAds } from "@/hooks/use-ads";
import { translations, type Language } from "@/lib/i18n";
import type { Ad } from "@/types/ad";

interface BrowseAdsProps {
  language: Language;
}

export function BrowseAdsPage({ language }: BrowseAdsProps) {
  const search = useSearch();
  const queryParams = new URLSearchParams(search);
  const initialCategory = queryParams.get("category") || "";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [locationFilter, setLocationFilter] = useState("");
  
  const { data: ads, isLoading, error } = useAds({
    search: searchQuery,
    category: selectedCategory,
    location: locationFilter,
  });

  const t = translations[language];

  const categories = [
    { value: "", label: t.browse.allCategories },
    { value: "childcare", label: t.categories.childcare },
    { value: "household", label: t.categories.household },
    { value: "transport", label: t.categories.transport },
    { value: "repair", label: t.categories.repair },
    { value: "cleaning", label: t.categories.cleaning },
    { value: "gardening", label: t.categories.gardening },
    { value: "shopping", label: t.categories.shopping },
    { value: "other", label: t.categories.other },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      childcare: "bg-primary/10 text-primary",
      household: "bg-secondary/10 text-secondary",
      transport: "bg-accent/10 text-accent",
      repair: "bg-purple-100 text-purple-600",
      cleaning: "bg-blue-100 text-blue-600",
      gardening: "bg-green-100 text-green-600",
      shopping: "bg-pink-100 text-pink-600",
      other: "bg-gray-100 text-gray-600",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-600";
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return language === "sr" ? "Manje od sata" : "Less than an hour";
    } else if (diffInHours < 24) {
      return language === "sr" ? `${diffInHours} ${diffInHours === 1 ? "sat" : "sati"}` : `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return language === "sr" ? `${diffInDays} ${diffInDays === 1 ? "dan" : "dana"}` : `${diffInDays} ${diffInDays === 1 ? "day" : "days"}`;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <CardContent className="text-center">
            <p className="text-destructive">
              {language === "sr" ? "Greška pri učitavanju oglasa" : "Error loading ads"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.browse.title}</h1>
        <p className="text-muted-foreground">{t.browse.subtitle}</p>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder={t.browse.searchPlaceholder}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-64">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t.browse.allCategories} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Filter */}
          <div className="lg:w-64">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder={t.browse.locationPlaceholder}
                className="pl-10"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          {isLoading ? (
            language === "sr" ? "Učitavanje..." : "Loading..."
          ) : (
            `${ads?.length || 0} ${t.browse.adsFound}`
          )}
        </p>
      </div>

      {/* Ads Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                  <div className="h-6 bg-muted rounded w-full"></div>
                  <div className="h-16 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : ads && ads.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {ads.map((ad) => (
            <Link key={ad.id} href={`/ad/${ad.id}`}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-gray-100 hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(ad.category)}`}>
                      {t.categories[ad.category as keyof typeof t.categories]}
                    </span>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{getTimeAgo(new Date(ad.createdAt))}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                    {ad.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {ad.description}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{ad.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-2" />
                      <span>{ad.email.split('@')[0]}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      {t.browse.contact}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-8">
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              {language === "sr" ? "Nema oglasa koji odgovaraju vašim kriterijumima." : "No ads match your criteria."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
