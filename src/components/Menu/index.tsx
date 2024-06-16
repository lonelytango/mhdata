import '../../app/globals.css';
import Link from 'next/link';
import menuItems from './data.json';
import { nanoid } from 'nanoid';
const { menu } = menuItems;

export const Menu = () => {
	return (
		<div id='menu' className='flex flex-row gap-4'>
			{menu.map((item) => (
				<div
					key={nanoid()}
					className='cursor-pointer font-bold border border-black px-4 py-1 rounded'
				>
					<Link href={item.path}>{item.title}</Link>
				</div>
			))}
		</div>
	);
};
