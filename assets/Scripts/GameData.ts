// Items
export enum EnItems {
    BlueFlower,
    BoxWithBonus,
}

export const MAX_ITEM_LEVELS = {
    [EnItems.BlueFlower]: 2,
    [EnItems.BoxWithBonus]: 1,
};

// FIELD
export const DIRECTIONS: { x: number; y: number }[] = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
];
