import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertAdSchema } from "@shared/schema";
import { translations, type Language } from "@/lib/i18n";
import type { InsertAd } from "@shared/schema";

interface CreateAdProps {
  language: Language;
}

export function CreateAdPage({ language }: CreateAdProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = translations[language];

  const form = useForm<InsertAd>({
    resolver: zodResolver(insertAdSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "other",
      location: "",
      email: "",
      urgency: "medium",
    },
  });

  const createAdMutation = useMutation({
    mutationFn: async (data: InsertAd) => {
      const response = await apiRequest("POST", "/api/ads", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ads"] });
      toast({
        title: language === "sr" ? "Uspeh!" : "Success!",
        description: language === "sr" ? "Oglas je uspešno objavljen." : "Ad posted successfully.",
      });
      setLocation("/browse");
    },
    onError: (error: any) => {
      toast({
        title: language === "sr" ? "Greška" : "Error",
        description: error.message || (language === "sr" ? "Greška pri objavljivanju oglasa." : "Error posting ad."),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertAd) => {
    createAdMutation.mutate(data);
  };

  const categories = [
    { value: "childcare", label: t.categories.childcare },
    { value: "household", label: t.categories.household },
    { value: "transport", label: t.categories.transport },
    { value: "repair", label: t.categories.repair },
    { value: "cleaning", label: t.categories.cleaning },
    { value: "gardening", label: t.categories.gardening },
    { value: "shopping", label: t.categories.shopping },
    { value: "other", label: t.categories.other },
  ];

  const urgencyOptions = [
    { value: "low", label: t.create.urgencyLow, color: "bg-green-500" },
    { value: "medium", label: t.create.urgencyMedium, color: "bg-yellow-500" },
    { value: "high", label: t.create.urgencyHigh, color: "bg-red-500" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.create.title}</h1>
        <p className="text-muted-foreground">{t.create.subtitle}</p>
      </div>

      {/* Create Ad Form */}
      <Card>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.create.titleLabel}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t.create.titlePlaceholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.create.categoryLabel}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t.create.categoryPlaceholder} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.create.descriptionLabel}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t.create.descriptionPlaceholder}
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">{t.create.descriptionHint}</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.create.locationLabel}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t.create.locationPlaceholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.create.emailLabel}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t.create.emailPlaceholder}
                        {...field}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">{t.create.emailHint}</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Urgency */}
              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.create.urgencyLabel}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-3 gap-4"
                      >
                        {urgencyOptions.map((option) => (
                          <div key={option.value}>
                            <RadioGroupItem
                              value={option.value}
                              id={option.value}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={option.value}
                              className="flex items-center p-4 border border-muted rounded-lg cursor-pointer hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-colors"
                            >
                              <div className="flex items-center">
                                <div className={`w-3 h-3 ${option.color} rounded-full mr-3`}></div>
                                <span className="text-sm">{option.label}</span>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createAdMutation.isPending}
                >
                  {createAdMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {language === "sr" ? "Objavljivanje..." : "Posting..."}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Plus className="mr-2 h-4 w-4" />
                      {t.create.submit}
                    </div>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setLocation("/")}
                >
                  <X className="mr-2 h-4 w-4" />
                  {t.create.cancel}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
