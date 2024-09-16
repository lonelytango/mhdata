'use client';

import classNames from 'classnames';
import { nanoid } from 'nanoid';
import {
  type Armor,
  bodyName,
  getArmorSuite,
  getWeaponSuite,
  type Weapon,
  type WeaponSuite,
  type Skill,
} from '../utils/mhnow_utils';
import { useState } from 'react';

type GearData = {
  gear: Map<string, Armor>;
  weapon?: Weapon;
  allSkills: Skill[];
};

const initData: GearData = {
  gear: new Map<string, Armor>(),
  weapon: undefined,
  allSkills: [],
};

const armorSuite = getArmorSuite();
const weaponSuite = getWeaponSuite();

const MHCombo = () => {
  const [data, setData] = useState<GearData>(initData);
  const { gear, weapon, allSkills } = data;

  const armorHandler = (item: Armor) => {
    //This is to unselect the armor.
    if (gear.get(item.part)?.name === item.name) {
      gear.delete(item.part);
    } else {
      gear.set(item.part, {
        name: item.name,
        skills: item.skills,
        part: item.part,
      });
    }
    updataGearData(gear, weapon);
  };

  const weaponHandler = (
    suite: string,
    weaponName: string,
    skills?: {
      name: string;
      level: number;
    }[]
  ) => {
    let { weapon } = data;
    const weaponFullName = suite + weaponName;
    //This is to unselect the weapon.
    if (weapon?.name === weaponFullName) {
      weapon = undefined;
    } else {
      weapon = {
        name: weaponFullName,
        skills,
      };
    }
    updataGearData(gear, weapon);
  };

  const updataGearData = (gear: Map<string, Armor>, weapon?: Weapon) => {
    let rawSkills: Skill[] = [];
    gear.forEach(value => {
      rawSkills = rawSkills.concat(value.skills ?? []);
    });

    // if (weapon?.skills) {
    //   console.log('WEAPONS SKILLS');
    //   for (const skill of weapon.skills) {
    //     console.log(`Skills: ${skill.name}`);
    //   }
    // }

    if (weapon?.skills) {
      rawSkills = rawSkills.concat(weapon.skills);
    }

    // console.log('RAW SKILLS');
    // for (const skill of rawSkills) {
    //   console.log(`Skills: ${skill.name}`);
    // }

    const skillMap = new Map<string, number>();
    for (const skill of rawSkills) {
      if (!skillMap.has(skill.name)) {
        skillMap.set(skill.name, 0);
      }
      const currentLevel = skillMap.get(skill.name) ?? 0;
      skillMap.set(skill.name, currentLevel + skill.level);
    }

    const skillSet: Skill[] = [];
    skillMap.forEach((value, key) => {
      skillSet.push({
        name: key,
        level: value,
      });
    });

    setData({ gear, weapon: weapon, allSkills: skillSet });
  };

  const armorTable = () => {
    return (
      <table>
        <tbody>
          {armorSuite.map(suite => (
            <tr key={nanoid()}>
              <td>{suite.name}</td>
              {suite.items.map(item => (
                <td
                  key={nanoid()}
                  className={classNames(
                    'w-12 h-12 border text-center cursor-pointer',
                    {
                      'bg-cyan-100': gear.get(item.part)?.name === item.name,
                    }
                  )}
                  onClick={() => armorHandler(item)}
                >
                  {bodyName(item.part)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const weaponTable = () => {
    return (
      <table>
        <tbody>
          {weaponSuite.map((suite: WeaponSuite) => (
            <tr key={nanoid()}>
              <td>{suite.name}</td>
              {suite.weapons.map(item => {
                return (
                  <td
                    key={nanoid()}
                    className={classNames(
                      'w-12 h-12 border text-center cursor-pointer',
                      {
                        'text-gray-100': item.v === 0,
                        'bg-green-100': weapon?.name === suite.name + item.name,
                      }
                    )}
                    onClick={() =>
                      item.v === 1 &&
                      weaponHandler(suite.name, item.name, suite.skills)
                    }
                  >
                    {item.name}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <main className="flex flex-row gap-5 h-svh text-xs p-4">
      <div className="overflow-y-auto">
        {armorTable()}
        {weaponTable()}
      </div>
      <div className="flex flex-row gap-5">
        <div>
          <div>
            <span>头部: {gear.get('head')?.name}</span>
          </div>
          <div>
            <span>身体: {gear.get('body')?.name}</span>
          </div>
          <div>
            <span>手臂: {gear.get('wrist')?.name}</span>
          </div>
          <div>
            <span>腰部: {gear.get('waist')?.name}</span>
          </div>
          <div>
            <span>腿部: {gear.get('leg')?.name}</span>
          </div>
          <div>
            <span>武器: {weapon?.name}</span>
          </div>
        </div>
        <div className="overflow-y-auto h-64">
          {allSkills.map(skill => {
            return (
              <div key={nanoid()} className="flex flex-row gap-5">
                {skill.name} {skill.level}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default MHCombo;
