import { _decorator, Component, Layout } from "cc";
import { CellComponent } from "./CellComponent";
import { DIRECTIONS } from "./GameData";
const { ccclass, property } = _decorator;

@ccclass("FieldComponent")
export class FieldComponent extends Component {
    private cells: CellComponent[][] = [];

    protected onLoad(): void {
        let countCol = this.getComponent(Layout).constraintNum;

        for (let i = 0; i < this.node.children.length; i += countCol) {
            this.cells.push(
                this.node.children
                    .slice(i, i + countCol)
                    .map((cell) => cell.getComponent(CellComponent))
            );
        }
    }

    public getNearestFreeCell(startCell: CellComponent): CellComponent {
        let start_x: number = 0;
        let start_y: number = 0;
        for (const cellGroup of this.cells) {
            start_y = cellGroup.findIndex((cell) => startCell === cell);
            if (start_y != -1) {
                break;
            }
            ++start_x;
        }

        const rows = this.cells.length;
        const cols = this.cells[0].length;

        const visited: boolean[][] = new Array(rows)
            .fill(false)
            .map(() => new Array(cols).fill(false));

        const queue: { x: number; y: number }[] = [{ x: start_x, y: start_y }];

        while (queue.length > 0) {
            const currentCell = queue.shift()!;
            const currentCellComponent = this.cells[currentCell.x][currentCell.y];

            if (currentCellComponent.isFreeCell()) {
                return currentCellComponent;
            }

            for (const dir of DIRECTIONS) {
                const nextX = currentCell.x + dir.x;
                const nextY = currentCell.y + dir.y;

                if (
                    nextX >= 0 &&
                    nextX < rows &&
                    nextY >= 0 &&
                    nextY < cols &&
                    !visited[nextX][nextY]
                ) {
                    queue.push({ x: nextX, y: nextY });
                    visited[nextX][nextY] = true;
                }
            }
        }

        return null;
    }
}
