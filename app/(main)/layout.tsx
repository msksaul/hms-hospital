import SpinnerCircle4 from '@/shared/components/customized/spinner/spinner-10';
import { Suspense } from 'react';

const SpinnerContainer = () => {
  return (
    <div className='flex h-screen items-center justify-center'>
      <SpinnerCircle4 />
    </div>
  )
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<SpinnerContainer />}>
      {children}
    </Suspense>
  )
}