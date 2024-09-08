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

  const armorHandler = (item: Armor) => {
    const { gear, weapon } = data;

    if (gear.get(item.part)?.name === item.name) {
      gear.delete(item.part);
    } else {
      gear.set(item.part, {
        name: item.name,
        skills: item.skills,
        part: item.part,
      });
    }

    let rawSkills: Skill[] = [];
    gear.forEach(value => {
      rawSkills = rawSkills.concat(value.skills);
    });

    if (weapon) {
      rawSkills.push({
        name: weapon.skill ?? '',
        level: weapon.level ?? 0,
      });
    }

    const skillMap = new Map<string, number>();
    for (const skill of rawSkills) {
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

    setData({ gear: gear, weapon, allSkills: skillSet });
  };

  const weaponHandler = (
    suite: string,
    weaponName: string,
    skill: string,
    level: number,
    skills?: {
      name: string;
      level: number;
    }[]
  ) => {
    let { gear, weapon } = data;
    const weaponFullName = suite + weaponName;
    if (weapon?.name === weaponFullName) {
      weapon = undefined;
    } else {
      weapon = {
        name: weaponFullName,
        skill: skill,
        level: level,
        v: 1,
        skills,
      };
    }

    let rawSkills: Skill[] = [];
    gear.forEach(value => {
      rawSkills = rawSkills.concat(value.skills);
    });

    if (weapon && weapon.skills) {
      for (const skill of weapon.skills) {
        rawSkills.push({
          name: skill.name ?? '',
          level: skill.level ?? 0,
        });
      }
    }

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
              <td>{suite.suite}</td>
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
              <td>{suite.suite}</td>
              {suite.weapons.map(item => {
                return (
                  <td
                    key={nanoid()}
                    className={classNames(
                      'w-12 h-12 border text-center cursor-pointer',
                      {
                        'text-gray-100': item.v === 0,
                        'bg-green-100':
                          weapon?.name === suite.suite + item.name,
                      }
                    )}
                    onClick={() =>
                      item.v === 1 &&
                      weaponHandler(
                        suite.suite,
                        item.name,
                        item.skill || suite.skill,
                        item.level || suite.level,
                        suite.skills
                      )
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

  const { gear, weapon, allSkills } = data;

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
