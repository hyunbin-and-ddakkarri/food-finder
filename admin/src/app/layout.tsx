import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
library.add(fas)
config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'] })

export default function AppLayout({ children } : {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="noto-sans">
        <div className="flex h-screen bg-gray-50">
          <div className="block w-1/6 bg-white p-4">
            <div className='flex items-center mb-6'>
              <Image
                src="/logo.png"
                alt="Logo"
                className="mr-4"
                width={50}
                height={50}
                priority
              />
              <div className='text-2xl font-bold text-black'>Food Finder</div>
            </div>
            <div className='mb-2'>
              <Link href="/category" className='text-md text-black'>Category Management</Link>
            </div>
            <div>
              <Link href="/restaurant" className='text-md text-black'>Restaurant Information</Link>
            </div>
          </div>
          <div className="grow shrink min-w-0">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
