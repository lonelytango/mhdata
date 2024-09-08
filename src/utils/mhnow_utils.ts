import armorData from '../data/armor.json';
import skillData from '../data/skills.json';
import skillGroupData from '../data/skill_group.json';
import weaponData from '../data/weapon.json';

export interface SkillGroup {
  type: string;
  data: SkillDetail[];
}

export interface SkillDetail {
  name: string;
  'max-level': number;
  type: string;
  description: string;
}

export interface GearDetail {
  name: string;
  gear: string;
  level: number;
}

export interface GearSearchResult {
  skill: SkillDetail;
  gears: GearDetail[];
}

export interface Skill {
  name: string;
  level: number;
}

export interface Armor {
  name: string;
  part: string;
  skills: Skill[];
}

interface ArmorSuite {
  suite: string;
  items: Armor[];
}

export interface Weapon {
  name: string;
  v: number;
  skill?: string;
  level?: number;
  skills?: Skill[];
}

export interface WeaponSuite {
  suite: string;
  weapons: Weapon[];
  skill: string;
  level: number;
  element: string;
  skills?: Skill[];
}

export const armorName = (part: string) => {
  switch (part) {
    case 'head':
      return '头盔';
    case 'body':
      return '铠甲';
    case 'wrist':
      return '腕甲';
    case 'waist':
      return '腰甲';
    case 'leg':
      return '护腿';
  }
};

export const bodyName = (part: string) => {
  switch (part) {
    case 'head':
      return '头';
    case 'body':
      return '身';
    case 'wrist':
      return '手';
    case 'waist':
      return '腰';
    case 'leg':
      return '腿';
  }
};

export const getSkillGroup = () => {
  return skillGroupData as SkillGroup[];
};

export const search = (name: string) => {
  const data = armorData as ArmorSuite[];
  const gearArr: GearDetail[] = data.flatMap(armorSet => {
    return armorSet.items.flatMap(item => {
      return item.skills
        .filter(skill => skill.name === name)
        .flatMap(skillItem => {
          return {
            ...skillItem,
            gear: item.name,
          };
        });
    });
  });

  const skillDetail = skillData.find(item => item.name === name);

  const searchResult: GearSearchResult = {
    skill: skillDetail!,
    gears: gearArr,
  };
  return searchResult;
};

export const getArmorList = () => {
  const data = armorData as ArmorSuite[];
  return data.flatMap(armorSet => {
    return armorSet.items.map(item => item);
  });
};

export const getArmorSuite = () => {
  return armorData;
};

export const getWeaponSuite = () => {
  return weaponData;
};
