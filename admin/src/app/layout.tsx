import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export default function AppLayout({ children } : {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="noto-sans">
        <div className="flex h-screen bg-gray-50">
          <div className="w-64 bg-white p-4 block">
            <Image
              src="/vercel.svg"
              alt="Logo"
              className="dark:invert my-4"
              width={150}
              height={36}
              priority
            />
            <div className='mb-2'>
              <Link href="/category" className='text-xl'>Category Management</Link>
            </div>
            <div>
              <Link href="/restaurant" className='text-xl'>Restaurant Information</Link>            
            </div> 
          </div>
          <div className="flex flex-grow">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}