"use client";

import React, { useState } from 'react';
import "@/style/globals.css";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Separator } from "@/Components/ui/separator";
import Nav from "@/Components/Nav";
import Image from "next/image";
import Link from "next/link";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Sign in form submitted:', formData);
  };

  const handleSocialSignIn = (provider: string) => {
    // Handle social sign in logic here
    console.log(`Sign in with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-[var(--colour-background-primary)]">
      <Nav />
      
      <div className="pt-20 flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[var(--colour-text-primary)] mb-2">
                Welcome Back
              </h1>
              <p className="text-[var(--colour-text-secondary)] text-lg">
                Sign in to your 3Z-Analysis account
              </p>
            </div>

            {/* Social Sign In Options */}
            <div className="space-y-4">
              <Button
                onClick={() => handleSocialSignIn('Google')}
                className="w-full h-12 bg-white border-2 border-[var(--colour-background-tertiary)] text-[var(--colour-text-primary)] hover:bg-[var(--colour-background-secondary)] transition-all duration-300 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button
                onClick={() => handleSocialSignIn('Apple')}
                className="w-full h-12 bg-black text-white hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </Button>

              <Button
                onClick={() => handleSocialSignIn('Microsoft')}
                className="w-full h-12 bg-[#0078d4] text-white hover:bg-[#106ebe] transition-all duration-300 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                </svg>
                Continue with Microsoft
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--colour-background-primary)] text-[var(--colour-text-secondary)]">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--colour-text-primary)] mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-12 border-2 border-[var(--colour-background-tertiary)] focus:border-[var(--colour-accent-standard)] transition-colors"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[var(--colour-text-primary)] mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-12 border-2 border-[var(--colour-background-tertiary)] focus:border-[var(--colour-accent-standard)] transition-colors"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[var(--colour-accent-standard)] focus:ring-[var(--colour-accent-standard)] border-[var(--colour-background-tertiary)] rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-[var(--colour-text-secondary)]">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="text-[var(--colour-accent-standard)] hover:underline">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[var(--colour-accent-standard)] hover:bg-[var(--colour-accent-light)] text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Sign In
              </Button>
            </form>

            <div className="text-center">
              <p className="text-[var(--colour-text-secondary)]">
                Don't have an account?{' '}
                <Link href="/sign-up" className="text-[var(--colour-accent-standard)] hover:underline font-medium">
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="text-center">
              <Link href="/" className="text-[var(--colour-text-secondary)] hover:text-[var(--colour-accent-standard)] transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="w-full lg:w-1/2 bg-[var(--colour-background-secondary)] flex items-center justify-center p-8">
          <div className="max-w-lg">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-[var(--colour-text-primary)] mb-4">
                Welcome Back to 3Z-Analysis
              </h2>
              <p className="text-[var(--colour-text-secondary)] text-lg">
                Continue your trading journey with advanced analytics and real-time market data
              </p>
            </div>
            
            <div className="relative">
              <Image 
                src="/ez-money-home.svg" 
                alt="Trading platform analytics preview"
                width={600}
                height={400}
                className="rounded-lg border-4 border-[var(--colour-background-tertiary)] shadow-lg"
              />
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center p-4 bg-[var(--colour-background-primary)] rounded-lg">
                <div className="w-3 h-3 bg-[var(--colour-buy)] rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-[var(--colour-text-primary)]">Real-time Market Data</div>
                  <div className="text-sm text-[var(--colour-text-secondary)]">Live stock prices and market updates</div>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-[var(--colour-background-primary)] rounded-lg">
                <div className="w-3 h-3 bg-[var(--colour-accent-standard)] rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-[var(--colour-text-primary)]">Advanced Analytics</div>
                  <div className="text-sm text-[var(--colour-text-secondary)]">AI-powered trading insights and predictions</div>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-[var(--colour-background-primary)] rounded-lg">
                <div className="w-3 h-3 bg-[var(--colour-sell)] rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-[var(--colour-text-primary)]">Portfolio Management</div>
                  <div className="text-sm text-[var(--colour-text-secondary)]">Track and manage your investments</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
