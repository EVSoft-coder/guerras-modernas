/**
 * src/utils/Pathfinding.ts
 * ImplementaÃ§Ã£o DeterminÃ­stica do Algoritmo A* (A-star) para o Grid TÃ¡ctico.
 */

interface Node {
    x: number;
    y: number;
    g: number; // Custo do inÃ­cio
    h: number; // HeurÃ­stica (distÃ¢ncia ao fim)
    f: number; // g + h
    parent?: Node;
}

export class Pathfinding {
    /**
     * Calcula o caminho otimizado entre dois pontos.
     * @param start Coordenadas iniciais {x, y}
     * @param end Coordenadas de destino {x, y}
     * @param isWalkable FunÃ§Ã£o de validaÃ§Ã£o de terreno
     */
    public static findPath(
        start: { x: number, y: number },
        end: { x: number, y: number },
        isWalkable: (x: number, y: number) => boolean
    ): { x: number, y: number }[] | null {
        
        const openList: Node[] = [];
        const closedList: Set<string> = new Set();

        const startNode: Node = {
            x: Math.round(start.x),
            y: Math.round(start.y),
            g: 0,
            h: this.heuristic(start, end),
            f: 0
        };
        startNode.f = startNode.h;

        openList.push(startNode);

        while (openList.length > 0) {
            // Obter o nÃ³ com menor F
            let currentIndex = 0;
            for (let i = 0; i < openList.length; i++) {
                if (openList[i].f < openList[currentIndex].f) {
                    currentIndex = i;
                }
            }

            const current = openList[currentIndex];

            // Objetivo alcanÃ§ado?
            if (current.x === Math.round(end.x) && current.y === Math.round(end.y)) {
                return this.reconstructPath(current);
            }

            // Mover de open para closed
            openList.splice(currentIndex, 1);
            closedList.add(`${current.x}:${current.y}`);

            // Explorar vizinhos (8 direcÃ§Ãµes sugeridas para flexibilidade tÃ¡ctica)
            const neighbors = this.getNeighbors(current);

            for (const neighbor of neighbors) {
                if (closedList.has(`${neighbor.x}:${neighbor.y}`) || !isWalkable(neighbor.x, neighbor.y)) {
                    continue;
                }

                const gScore = current.g + 1; // Custo uniforme
                let bestG = false;

                const openNode = openList.find(n => n.x === neighbor.x && n.y === neighbor.y);

                if (!openNode) {
                    bestG = true;
                    neighbor.h = this.heuristic(neighbor, end);
                    openList.push(neighbor);
                } else if (gScore < openNode.g) {
                    bestG = true;
                }

                if (bestG) {
                    neighbor.parent = current;
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                }
            }
        }

        return null; // Caminho nÃ£o encontrado
    }

    private static heuristic(a: { x: number, y: number }, b: { x: number, y: number }): number {
        // DistÃ¢ncia de Manhattan para precisÃ£o de grid
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    private static getNeighbors(node: Node): Node[] {
        const neighbors: Node[] = [];
        const dirs = [
            { x: 0, y: -1 }, { x: 0, y: 1 },
            { x: -1, y: 0 }, { x: 1, y: 0 }
        ];

        for (const dir of dirs) {
            neighbors.push({
                x: node.x + dir.x,
                y: node.y + dir.y,
                g: 0, h: 0, f: 0
            });
        }
        return neighbors;
    }

    private static reconstructPath(node: Node): { x: number, y: number }[] {
        const path = [];
        let curr: Node | undefined = node;
        while (curr) {
            path.push({ x: curr.x, y: curr.y });
            curr = curr.parent;
        }
        return path.reverse();
    }
}
