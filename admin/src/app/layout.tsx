import './globals.css'
import { Open_Sans } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas, faLocationDot, faBars } from '@fortawesome/free-solid-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(fas)
config.autoAddCss = false;

const font = Open_Sans({ subsets: ['latin'] })

export default function AppLayout({ children } : {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <div className="flex h-screen w-full">
          <div className="block w-1/6 sideBar">
            
            <div className='flex justify-center items-center mt-12 mb-2'>
              <Image
                src="/logo.png"
                alt="Logo"
                className="rounded-full center"
                width={100}
                height={100}
                priority
              />
            </div>
            <div className='text-xl font-bold text-center mb-4'>Food Finder</div>
            
            <div className='px-4 py-2 flex items-center category'>
              <FontAwesomeIcon icon={faBars} />
              <Link href="/category" className='text-md ml-2'>Category Management</Link>
            </div>
            <div className='px-4 py-2 flex items-center category'>
              <FontAwesomeIcon icon={faLocationDot} />
              <Link href="/restaurant" className='text-md ml-2'>Restaurant Information</Link>
            </div>
          </div>
          <div className="w-5/6 min-w-0">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
