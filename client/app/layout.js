import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

import { ApolloWrapper } from "./config/apolloWrapper";
import Sidebar from './components/Sidebar'


export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>CRM CLIENT ADMINISTRATION</title>
        {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" referrerpolicy="no-referrer" /> */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className={inter.className}>
          <ApolloWrapper>
            <div className="bg-gray-200 min-h-screen flex ">
              <Sidebar />
              <main className='bg-gray-200 min-h-screen p-5 w-full w-lg min-w-min'>
                {children}
              </main>
            </div>
          </ApolloWrapper>
      </body>
    </html>
  )
}
