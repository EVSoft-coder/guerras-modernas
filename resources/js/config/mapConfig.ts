export const TILE_SIZE = 80;
export const WORLD_SIZE = 1000;

export const getTerrain = (tx: number, ty: number) => {
    // World is now 1000x1000 (standard for global scale)
    if (ty < 0 || ty > WORLD_SIZE || tx < 0 || tx > WORLD_SIZE) return 'water';
    if (ty < 3 || ty > WORLD_SIZE - 3 || tx < 3 || tx > WORLD_SIZE - 3) return 'water';
    
    // Deterministic Pseudo-Noise
    const noise = (Math.sin(tx * 0.12) + Math.cos(ty * 0.15) + Math.sin(tx * 0.3 + ty * 0.2)) / 3;
    
    if (noise > 0.53) return 'mountain';
    if (noise < -0.45) return 'desert';
    if (noise < -0.65) return 'water';
    
    return 'grass';
};
