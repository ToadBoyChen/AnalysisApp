"use client";

import React from 'react';
import "@/style/globals.css";
import { Button } from "@/Components/ui/button"
import { Separator } from "@/Components/ui/separator"
import Demo from "@/Components/StockListLineGraph";
import LiveTicker from "@/Components/dashboard/LiveTicker";
import MarketIndices from "@/Components/dashboard/MarketIndices";
import Image from "next/image";
import Link from "next/link"

const Landing = () => {
  return (
    <section className='flex flex-col'>
      <div className='flex flex-row'>
        <div className='mt-10 p-10 w-[60%]'>
          <div className='text-7xl font-normal space-y-5 text-balance tracking-tighter w-full text-[var(--colour-text-primary)] mb-5'>
            <p>Effective, Easy <span className='text-5xl'>&</span> Insightful <span className='text-[var(--colour-accent-standard)]'>Trading Platform</span></p>
            <p>Free, Open Source and Secure</p>
          </div>
          <div className='flex'>
            <div className='flex flex-col'>
              <div className='mt-8 text-lg space-y-2'>
                <p><span className='text-[var(--colour-accent-standard)]'>3Z-Analysis</span> is a simulation trading platform, meaning no matter who 
                you are, or where your from, you choose how much money to invest, and when. The choice is yours. <span className='text-[var(--colour-accent-standard)]'>Money is Freedom</span>.</p> 
                <Separator />
              </div>
              <div className="mt-5 mb-5 text-center">
                <div className="mb-8 flex flex-col">
                  <p className="text-[var(--colour-accent-standard)] text-3xl">
                    Create an Account for Free
                  </p> 
                  <span className="text-lg">
                    log in or use our service as a guest.
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-6 mb-5">
                  <Link href="/sign-up">
                    <Button className="bg-[var(--colour-accent-standard)] w-56 h-14 text-lg rounded-full transition-transform transform hover:scale-105 hover:bg-[var(--colour-accent-light)]">
                      Sign Up
                    </Button>
                  </Link>
                  <span className="flex flex-col justify-center text-[var(--colour-text-secondary)]">or</span>
                  <Link href="/sign-in">
                    <Button className="bg-[var(--colour-accent-standard)] w-56 h-14 text-lg rounded-full transition-transform transform hover:scale-105 hover:bg-[var(--colour-accent-light)]">
                      Log In
                    </Button>
                  </Link>
                  <span className="flex flex-col justify-center text-[var(--colour-text-secondary)]">or</span>
                  <Link href="/home">
                    <Button className="bg-[var(--colour-accent-light)] w-56 h-14 text-lg rounded-full transition-transform transform hover:scale-105 hover:bg-[var(--colour-accent-lighter)]">
                      Guest
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-[var(--colour-text-secondary)]">
                  To access extended features like setting money, saving trades, and more, you need an account.
                </p>
              </div>
            </div>
          </div>      
        </div> 
        <div className="w-[40%] overflow-hidden mt-40">
          <Image 
            src="/ez-money-home-cropped-2.svg" 
            alt="Trading platform illustration"
            width={800}
            height={400}
            className="block object-cover translate-x-[5%] border-8 border-[var(--colour-background-tertiary)] rounded-lg"
          />
        </div>
      </div>
      <Separator className='mt-5'/>
      
      {/* Live Market Data Section */}
      <div className='p-10'>
        <LiveTicker />
        <MarketIndices />
      </div>
      
      <Separator/>
      <div className='p-10 mt-5 mb-5 flex flex-row'>
        <div className='w-[50%]'>
          <p className='text-[var(--colour-accent-standard)] text-3xl'>How does 3Z Analysis Work?</p>
          <p className='p-4'>3Z is a powerful financial tool coded in Python. I combine technical indicators with AI, global news and modelling to push our users the best possible trades. Best of all, its completely free. The back end uses Python to power actionable predictions, that work. I do all the heavy lifting so you can reap the benefits and return a profit.</p>
          <p className='text-[var(--colour-accent-standard)] text-3xl'>But why should I use 3Z?</p>
          <p className='p-4'>I believe that tangible results can be achieved alone on data analysis. Whether this is calculating means or generating weights based on the news, its possible, and maybe best, left to a computer. Consider the real worked example ahead.</p>
        </div>
        <div className='w-[50%] ml-5'>
          <Demo/>
        </div>
      </div>
      <Separator/>
      <div className='p-10 w-full mt-5 mb-5'>
        <p className='text-[var(--colour-accent-standard)] text-3xl'>Thank you</p>
        <p>This project makes use of smart solutions developed by various teams and people, of which all tools are free. I must also state 
          that this is my first endeavour into using a tech-stack for web development. One may see my <Link href="https://toadboychen.github.io/" className='text-[var(--colour-accent-standard)]'>personal website </Link>
           as an idea to how much of a big project this is for me. This project brings many of my passions together, these being software development, trading and mathematics. I hope you can find some use out of it!</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 mb-20">
          {[
            { href: "https://react.dev", src: "/react.svg", alt: "React", description: "UI Library" },
            { href: "https://nextjs.org", src: "/next.svg", alt: "Next.js", description: "React Framework" },
            { href: "https://tailwindcss.com", src: "/tailwindcss.svg", alt: "Tailwind CSS", description: "CSS Framework" },
            { href: "https://ui.shadcn.com", src: "/shadcn.ico", alt: "Shadcn UI", description: "Component Library" },
          ].map(({ href, src, alt, description }) => (
            <Link key={alt} href={href} target="_blank" rel="noopener noreferrer">
              <div className="group flex flex-col items-center justify-center p-6 bg-[var(--colour-background-secondary)] rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-[var(--colour-background-primary)] border-2 border-transparent hover:border-[var(--colour-accent-standard)]">
                <div className="w-16 h-16 mb-3 transition-transform duration-300 group-hover:scale-110">
                  <img src={src} alt={alt} className="w-full h-full object-contain" />
                </div>
                <p className="text-sm font-semibold text-[var(--colour-text-primary)] mb-1">{alt}</p>
                <p className="text-xs text-[var(--colour-text-secondary)] text-center">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Landing;
