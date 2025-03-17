'use client';

let isPhantomLoaded = false;

export function loadPhantomScript(): Promise<void> {
  if (isPhantomLoaded) {
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    try {
      // Check if Phantom is already installed
      // @ts-expect-error - Phantom is injected into the window object
      if (window.phantom?.solana) {
        isPhantomLoaded = true;
        resolve();
        return;
      }
      
      // If not, load the script
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js';
      script.async = true;
      script.onload = () => {
        isPhantomLoaded = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });
} 