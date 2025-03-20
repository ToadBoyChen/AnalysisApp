import React from 'react';
import "@/style/globals.css";
import { Button } from "@/Components/ui/button"
import { Separator } from "@/Components/ui/separator"
import Demo from "@/Components/Demo";
import Image from "next/image";

const Landing = () => {
  return (
    <section className='flex flex-row'>
      <div className='mt-10 p-10 w-[60%]'>
        <div className='text-7xl font-normal space-y-5 text-balance tracking-tighter w-full text-[var(--colour-text-primary)] mb-5'>
          <p>Effective, Easy <span className='text-5xl'>&</span> Insightful <span className='text-[var(--colour-accent-standard)]'>Trading Platform</span></p>
          <p>Free, Open Source and Secure</p>
        </div>
        <div className='flex'>
          <div className='flex flex-col'>
            <div className='mt-8 text-lg space-y-2'>
              <p><span className='text-[var(--colour-accent-standard)]'>3Z-Analysis</span> is a simulation trading platform, meaning no matter who 
              you are, or where your from, you choose how much money to invest, and when. The choice is yours. We are here to let people practise their skills
              and be able to apply them to real life. <span className='text-[var(--colour-accent-standard)]'>Money is Freedom</span>.</p> 
              <Separator />
            </div>
            <div className="mt-5 mb-5 text-center">
              <div className="mb-8 flex flex-col text-center">
                <p className="text-[var(--colour-accent-standard)] text-3xl">
                  Create an Account for Free
                </p> 
                <span className="text-lg">
                  log in or use our service as a guest.
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-6 mb-5">
                <Button className="bg-[var(--colour-accent-standard)] w-56 h-14 text-lg rounded-full transition-transform transform hover:scale-105 hover:bg-[var(--colour-accent-light)]">
                  Sign Up
                </Button>
                <span className="flex flex-col justify-center text-[var(--colour-text-secondary)]">or</span>
                <Button className="bg-[var(--colour-accent-standard)] w-56 h-14 text-lg rounded-full transition-transform transform hover:scale-105 hover:bg-[var(--colour-accent-light)]">
                  Log In
                </Button>
                <span className="flex flex-col justify-center text-[var(--colour-text-secondary)]">or</span>
                <Button className="bg-[var(--colour-accent-light)] w-56 h-14 text-lg rounded-full transition-transform transform hover:scale-105 hover:bg-[var(--colour-accent-lighter)]">
                  Guest
                </Button>
              </div>
              <p className="text-sm text-[var(--colour-text-secondary)]">
                To access extended features like setting money, saving trades, and more, you need an account.
              </p>
            </div>
            <Separator />
            <div>
              <Demo />
            </div>
            <Separator />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
              <div className="flex items-center justify-center w-full h-full bg-[var(--colour-background-secondary)] rounded-lg shadow-lg">
                <img src="/logos/react.svg" alt="React" className="w-24 h-24" />
              </div>
              <div className="flex items-center justify-center w-full h-full bg-[var(--colour-background-secondary)] rounded-lg shadow-lg">
                <img src="/logos/nextjs.svg" alt="Next.js" className="w-24 h-24" />
              </div>
              <div className="flex items-center justify-center w-full h-full bg-[var(--colour-background-secondary)] rounded-lg shadow-lg">
                <img src="/logos/tailwind.svg" alt="Tailwind" className="w-24 h-24" />
              </div>
              <div className="flex items-center justify-center w-full h-full bg-[var(--colour-background-secondary)] rounded-lg shadow-lg">
                <img src="/logos/typescript.svg" alt="TypeScript" className="w-24 h-24" />
              </div>
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
    </section>
  );
};

export default Landing;