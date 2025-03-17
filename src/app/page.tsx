import dynamic from 'next/dynamic';

// Use dynamic import to prevent hydration errors with the wallet connection
const CombinedHomePage = dynamic(
  () => import('@/app/combined-home'),
  { 
    ssr: false,
    loading: () => <div className="flex h-screen items-center justify-center">Loading...</div>
  }
);

export default function Home() {
  return <CombinedHomePage />;
}
