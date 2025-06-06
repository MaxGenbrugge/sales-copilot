import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'Sales Copilot',
  description: 'AI SaaS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
