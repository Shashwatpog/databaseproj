import Navbar from '../components/navbar';
import './globals.css';

export const metadata = {
  title: 'Online Store',
  description: 'Online Shopping App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
