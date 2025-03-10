"use client";

/**
 * Home Component
 *
 * This component renders the homepage with hero, features, AI highlights, and CTAs.
 * It utilizes Next.js' client-side rendering, custom hooks, and the AuthContext.
 */

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowBigUp,
  BookmarkPlus,
  ChefHat,
  Sparkles,
  Star,
} from "lucide-react";

/**
 * A reusable feature card component.
 * @param {React.ElementType} icon - Lucide icon component.
 * @param {string} title - Title of the feature.
 * @param {string} description - Description of the feature.
 */
const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="glass-card p-6 rounded-lg transition-all duration-300 hover:shadow-xl">
      <div className="w-12 h-12 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Home = () => {
  // Hooks
  const { user, loading, login } = useAuth();

  // If there's a saved URL, redirect to it after login
  if (user && localStorage.getItem("lastUrl")) {
    const redirectUrl = localStorage.getItem("lastUrl");
    localStorage.removeItem("lastUrl");
    console.log("Redirecting to:", redirectUrl);
    redirect(redirectUrl);
  }

  return (
    <div className="bg-white">
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="hero-gradient min-h-[100vh] px-4 py-20 flex items-center justify-center">
          <div className="container max-w-6xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-primary font-medium">
                Cooking made simple
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 slide-up">
              Create, Share, and Discover
              <span className="text-primary"> Amazing Recipes</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto slide-up">
              Your personal cooking companion powered by AI. Create, save, and
              rate recipes while getting intelligent suggestions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center slide-up">
              {!user && !loading && (
                <Button
                  size="lg"
                  className="text-lg"
                  onClick={async () => await login()}
                >
                  Sign Up Now
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="text-lg"
                onClick={() => redirect("/recipes")}
              >
                Explore Recipes
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Everything you need to create amazing meals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={ChefHat}
                title="Create Recipes"
                description="Share your culinary masterpieces with our easy-to-use recipe creator"
              />
              <FeatureCard
                icon={BookmarkPlus}
                title="Save Favorites"
                description="Build your personal cookbook with your favorite recipes"
              />
              <FeatureCard
                icon={Star}
                title="Rate & Review"
                description="Help others discover great recipes with your ratings and reviews"
              />
              <FeatureCard
                icon={Sparkles}
                title="AI Generated"
                description="Get personalized recipe suggestions powered by AI"
              />
            </div>
          </div>
        </section>

        {/* AI Highlight Section */}
        <section
          className="py-24 px-4"
          style={{
            background:
              "linear-gradient(184.1deg, rgba(249,255,182,1) 44.7%, rgba(226,255,172,1) 67.2%)",
          }}
        >
          <div className="container max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-primary font-medium">
                    AI-Powered Cooking
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Let AI Transform Your
                  <span className="text-primary block mt-2">
                    Cooking Experience
                  </span>
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground">
                  <p>
                    Get personalized recipe suggestions based on your
                    preferences, dietary restrictions, and available
                    ingredients.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                        <span className="text-primary text-sm">✓</span>
                      </div>
                      <span>Intelligent recipe recommendations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                        <span className="text-primary text-sm">✓</span>
                      </div>
                      <span>Automatic ingredient substitutions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                        <span className="text-primary text-sm">✓</span>
                      </div>
                      <span>Smart meal planning assistance</span>
                    </li>
                  </ul>
                </div>
                <Button
                  size="lg"
                  className="text-lg"
                  onClick={() => {
                    redirect("/ai-rcmd");
                  }}
                >
                  Try AI Recipe Generator
                </Button>
              </div>
              <div className="order-1 lg:order-2">
                <div className="glass-card p-8 rounded-2xl space-y-6">
                  <div className="bg-white/80 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="font-medium">AI Suggestion</span>
                    </div>
                    <p className="text-muted-foreground">
                      Based on your ingredients (eggs, spinach, feta), try
                      making a Mediterranean Frittata!
                    </p>
                  </div>
                  <div className="bg-white/80 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="font-medium">Smart Substitution</span>
                    </div>
                    <p className="text-muted-foreground">
                      No heavy cream? Use Greek yogurt for a healthier
                      alternative with similar texture.
                    </p>
                  </div>
                  <div className="bg-white/80 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="font-medium">Meal Planning</span>
                    </div>
                    <p className="text-muted-foreground">
                      This recipe fits your low-carb diet and meal prep schedule
                      for the week.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 py-20 px-4">
          <div className="container max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to start your culinary journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our community of food lovers and start creating amazing
              recipes today.
            </p>
            <Button size="lg" className="text-lg" onClick={() => login()}>
              Get Started Now
            </Button>
          </div>
        </section>
      </div>

      {/* Scroll-to-top button */}
      <ArrowBigUp
        size={50}
        className="fixed bottom-10 right-5 md:right-10 2xl:right-[100px] p-2 bg-white text-gray-600 rounded-full cursor-pointer z-20"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
};

export default Home;
