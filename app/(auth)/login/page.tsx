'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import { signInWithGoogle, supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkUser();
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error: signInError } = await signInWithGoogle();

      if (signInError) {
        setError('Kon niet inloggen. Probeer het opnieuw.');
        console.error('Login error:', signInError);
      }
      // If successful, OAuth will redirect automatically
    } catch (err) {
      setError('Er is een fout opgetreden.');
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-600 p-4 rounded-full">
              <Leaf className="w-12 h-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl">Nutrition Nerd</CardTitle>
          <CardDescription className="text-base">
            Track je dagelijkse groente en fruit intake
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {loading ? 'Inloggen...' : 'Inloggen met Google'}
          </Button>

          {error && (
            <div className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Google OAuth moet worden geconfigureerd in Supabase Dashboard.
              <br />
              Zie <strong>SUPABASE_SETUP.md</strong> voor instructies.
            </p>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-center text-muted-foreground">
              Door in te loggen ga je akkoord met onze voorwaarden en privacybeleid
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
