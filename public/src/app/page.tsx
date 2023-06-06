import Image from 'next/image'
import Link from "next/link"
import background from "./img/logo.png";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
          <img src="img/logo.png" alt="img/logo.png"/>
    </div>
    <Link href="/listview">Go to - page</Link>
    </main>
  )
}
//<h1>Food Finder</h1>
