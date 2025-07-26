import './globals.css';
import { CartProvider } from './_components/CartContext';
import { UnifiedAuthProvider } from './_components/UnifiedAuthContext';
import { NotificationProvider } from './_components/NotificationContext';
import { CartNotificationWrapper } from './_components/CartNotificationWrapper';
import ResponsiveNavigation from './_components/ResponsiveNavigation';
import DynamicFooter from './_components/DynamicFooter';

export const metadata = {
  title: 'Boribuz | Authentic Bangladeshi Cuisine',
  description: 'A true Bengali feast awaits at Boribuz. Order authentic Bangladeshi food online!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f97316" />
      </head>
      <body className="bg-black text-white min-h-screen flex flex-col">
        <NotificationProvider>
          <UnifiedAuthProvider>
            <CartProvider>
              <CartNotificationWrapper>
                <a href="#main-content" className="skip-link">Skip to main content</a>
                <ResponsiveNavigation />
                <main id="main-content" className="flex-1 w-full">{children}</main>
                <DynamicFooter />
              </CartNotificationWrapper>
            </CartProvider>
          </UnifiedAuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
