// This file contains type declarations for modules that don't have their own type definitions
import { ReactNode } from 'react';

declare module 'next';
declare module 'next/font/google';
declare module 'react';

// Add global type declarations for JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  type ReactNode = ReactNode;
}