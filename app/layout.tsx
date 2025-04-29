import Navbar from '../components/navbar';
import './globals.css'; // If TailwindCSS or your styles are installed

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
