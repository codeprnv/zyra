import './global.css';
import Providers from './providers';

export const metadata = {
  title: 'Zyra - Seller',
  description: 'Zyra - A Ecommerce Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
