'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ZoekenPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to intake page (which now includes search functionality)
    router.push('/intake');
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="text-center py-12">
        <p className="text-gray-600">Doorverwijzen...</p>
      </div>
    </div>
  );
}
