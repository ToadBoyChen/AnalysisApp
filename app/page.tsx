import React from 'react';
import "@/style/globals.css";
import { Button } from "@/Components/ui/button"
import { Separator } from "@/Components/ui/separator"


const Landing = () => {
  return (
    <section className='flex flex-col'>
      <div className='p-10'>
        <div className='text-6xl font-normal space-y-5 text-balance tracking-tighter w-full'>
          <p>Effective, Easy <span className='text-5xl'>&</span> Insightful <span className='text-[var(--colour-accent-standard)]'>Trading Platform</span></p>
          <p>Free, Open Source and Secure</p>
          <p>Why wait?</p>
        </div>
        <div className='flex'>
          <div className='flex flex-col w-3/5'>
            <div className='mt-8 text-lg space-y-2'>
              <p>What is <span className='text-[var(--colour-accent-standard)]'>EZ Analysis</span>? To put it simply, </p>
              <Separator />
            </div>
            <div className='mt-5 mb-5'>
              <Button className='bg-[var(--colour-accent-standard)] w-56 h-14 text-base rounded-full'>Sign In</Button>
            </div>
            <Separator />
            <div>
              DEMO
            </div>
            <Separator />
            <div>
              TECH STACK
            </div>
          </div>
          <div className='flex flex-col w-2/5'>
            PHOTOS
          </div>
        </div>      
      </div>  
    </section>
  );
};

export default Landing;