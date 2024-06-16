import { Inter } from 'next/font/google';
import '../app/globals.css';
import { Menu } from '../components/Menu';

const inter = Inter({ subsets: ['latin'] });

export default function MHLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<Menu />
			<body className={inter.className}>{children}</body>
		</html>
	);
}
