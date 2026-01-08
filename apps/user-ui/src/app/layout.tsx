import { Montserrat, Oregano, Poppins, Roboto } from 'next/font/google';
import './global.css';
import Providers from './providers';
import Header from './shared/widgets/header';

export const metadata = {
  title: 'Welcome to Zyra',
  description: 'Zyra - Ecommerce Website',
};

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-roboto',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

const oregano = Oregano({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-oregano',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={`${roboto.variable} ${poppins.variable} ${oregano.variable} ${montserrat.variable}`}
      >
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
