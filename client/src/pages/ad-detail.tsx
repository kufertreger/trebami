import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, MapPin, User, Clock, Send, Shield } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { translations, type Language } from "@/lib/i18n";
import type { Ad } from "@/types/ad";

interface AdDetailProps {
  language: Language;
}

const contactSchema = z.object({
  name: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
  email: z.string().email("Molimo unesite valjan email"),
  message: z.string().min(10, "Poruka mora imati najmanje 10 karaktera"),
});

type ContactForm = z.infer<typeof contactSchema>;

export function AdDetailPage({ language }: AdDetailProps) {
  const [, params] = useRoute("/ad/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const t = translations[language];

  const adId = params?.id ? parseInt(params.id) : null;

  const { data: ad, isLoading, error } = useQuery<Ad>({
    queryKey: [`/api/ads/${adId}`],
    enabled: !!adId,
  });

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      const response = await apiRequest("POST", `/api/ads/${adId}/contact`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: language === "sr" ? "Uspeh!" : "Success!",
        description: language === "sr" ? "Poruka je uspešno poslata." : "Message sent successfully.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: language === "sr" ? "Greška" : "Error",
        description: error.message || (language === "sr" ? "Greška pri slanju poruke." : "Error sending message."),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

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

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      low: "bg-green-500",
      medium: "bg-yellow-500",
      high: "bg-red-500",
    };
    return colors[urgency as keyof typeof colors] || "bg-gray-500";
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return language === "sr" ? "pre manje od sata" : "less than an hour ago";
    } else if (diffInHours < 24) {
      return language === "sr" ? `pre ${diffInHours} ${diffInHours === 1 ? "sat" : "sati"}` : `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return language === "sr" ? `pre ${diffInDays} ${diffInDays === 1 ? "dan" : "dana"}` : `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-32 mb-6"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="h-6 bg-muted rounded w-24"></div>
                    <div className="h-8 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-32 bg-muted rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-10 bg-muted rounded w-full"></div>
                    <div className="h-10 bg-muted rounded w-full"></div>
                    <div className="h-24 bg-muted rounded w-full"></div>
                    <div className="h-10 bg-muted rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8">
          <CardContent className="text-center">
            <p className="text-destructive">
              {language === "sr" ? "Greška pri učitavanju oglasa ili oglas ne postoji." : "Error loading ad or ad doesn't exist."}
            </p>
            <Button
              variant="outline"
              onClick={() => setLocation("/browse")}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.detail.back}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setLocation("/browse")}
        className="mb-6 text-primary hover:text-primary/80"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t.detail.back}
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Ad Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(ad.category)}`}>
                  {t.categories[ad.category as keyof typeof t.categories]}
                </span>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{t.detail.postedAgo} {getTimeAgo(new Date(ad.createdAt))}</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-4">{ad.title}</h1>

              <div className="flex items-center text-muted-foreground mb-6 space-x-6">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{ad.location}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{ad.email.split('@')[0]}</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {t.detail.description}
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {ad.description}
                </p>
              </div>

              {/* Urgency Indicator */}
              <div className="flex items-center">
                <span className="text-sm font-semibold text-foreground mr-3">
                  {t.detail.urgency}
                </span>
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${getUrgencyColor(ad.urgency)} rounded-full mr-2`}></div>
                  <span className="text-sm text-muted-foreground">
                    {t.urgencyLevels[ad.urgency as keyof typeof t.urgencyLevels]}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                {t.detail.contact}
              </h3>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.detail.yourName}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.detail.yourEmail}</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.detail.message}</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder={t.detail.messagePlaceholder}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {language === "sr" ? "Slanje..." : "Sending..."}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        {t.detail.sendMessage}
                      </div>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="text-center text-sm text-muted-foreground mt-4">
                <Shield className="inline h-4 w-4 mr-1" />
                {t.detail.privacy}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
