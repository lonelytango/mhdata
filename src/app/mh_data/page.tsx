'use client';

import '../globals.css';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import {
	type GearDetail,
	GearSearchResult,
	type SkillDetail,
	getSkillGroup,
	search,
} from '../../utils/mhnow_utils';

const MHGearList = ({
	skill,
	gears,
}: {
	skill: SkillDetail;
	gears: GearDetail[];
}) => {
	return (
		<div className='flex flex-col gap-3'>
			<div>
				<p>
					<b className='text-xl'>{`${skill.name}`}</b> Max:{' '}
					{`${skill['max-level']}`}
				</p>
				<p>{`${skill.description}`}</p>
			</div>
			<hr />
			{gears.map((gear) => (
				<div key={nanoid()} className='flex flex-col'>
					<b>{`${gear.gear}`}</b>
					<div>{`${gear.name} +${gear.level}`}</div>
				</div>
			))}
		</div>
	);
};

const MHData = () => {
	const [result, setResult] = useState<GearSearchResult>();

	const handleSearch = (skillName: string) => {
		const searchResult = search(skillName);
		setResult(searchResult);
	};

	const skillGroup = getSkillGroup();
	return (
		<div className='flex flex-row gap-1 h-svh p-4'>
			<div className='flex flex-col gap-5 flex-1 overflow-auto text-lg overscroll-contain'>
				{skillGroup.map(({ type, data }) => (
					<div key={nanoid()} className='flex flex-col gap-1'>
						<div className='font-bold text-xl'>{type}</div>
						{data.map(({ name }) => (
							<div
								key={nanoid()}
								className='cursor-pointer border-2 py-2 px-4 rounded-full'
								onClick={() => {
									handleSearch(name);
								}}
							>
								{name}
							</div>
						))}
					</div>
				))}
			</div>
			<div id='gear-list-container' className='flex-1'>
				{result && <MHGearList skill={result.skill} gears={result.gears} />}
			</div>
		</div>
	);
};

export default MHData;
