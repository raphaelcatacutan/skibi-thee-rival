export interface CardConfig {
    cardTitle: string;
    hpValue: string;
    damageValue: string;
    critRateValue: string;
    skillNames: string[];
    description: string;
    borderColor: 'RED' | 'GREEN' | 'BLUE' | 'GOLD';
    overlay: 'none' | 'holographic' | 'glitter' | 'paper' | 'foil';
    imageSrc: string;
  }
  
  export const defaultCardConfig: CardConfig = {
    cardTitle: 'Gabrield Dilis',
    hpValue: '2100',
    damageValue: '200',
    critRateValue: 'x1.8',
    skillNames: [
      'Dilis Punch',
      'Dilis Bonk',
      'Dilisquake',
      'Delulu Dilis',
      'Gyatt Dilis',
      'Zucc Dilis',
      'Self-Care Dilis'
    ],
    description: "Gabriel Dilis, oh what a dish, full of salty delight, he grants you a wish, with stats so high he makes the competition nigh, oh what a sight, his HP's like a mountain, attack damage is like a fountain, crit rate so insane it's almost profane!",
    borderColor: 'GREEN',
    overlay: 'holographic',
    imageSrc: 'http://localhost:5000/output/abc.jpg'
  };
  
  export type OverlayType = 'none' | 'holographic' | 'glitter' | 'paper' | 'foil';
  export type BorderColor = 'RED' | 'GREEN' | 'BLUE' | 'GOLD';
  
  export interface BorderGradients {
    [key: string]: Array<number | string>;
    RED: Array<number | string>;
    GREEN: Array<number | string>;
    BLUE: Array<number | string>;
    GOLD: Array<number | string>;
  }