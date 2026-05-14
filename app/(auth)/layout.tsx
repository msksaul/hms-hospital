import SpinnerCircle4 from '@/shared/components/customized/spinner/spinner-10';
import { Suspense } from 'react';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <Suspense fallback={<SpinnerCircle4 />}>
        {children}
      </Suspense>
    </div>
  )
}