import { readFileSync } from 'fs';

const input: string = readFileSync('input.txt', 'utf-8')

const testInput0: string = `...>...
.......
......>
v.....>
......>
.......
..vvv..`

const testInput1: string = `v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`

enum FieldType {
    Empty = '.',
    East = '>',
    South = 'v',
}

type CucumberField = FieldType[][]

class SolveCucumberField {
    field: CucumberField
    width: number
    height: number
    simulatedSteps: number = 0
    currentStepMovements: number = 0

    constructor(input: string) {
        this.field = input.split('\n').map(line => line.split('') as FieldType[])
        this.width = this.field[0].length
        this.height = this.field.length
    }

    public printField = () => {
        let fieldString: string = ''
        this.field.forEach(row => {
            fieldString = fieldString + row.join('') + '\n'
        })
        console.log(fieldString)
    }

    private getEastField = (x: number) => {
        if (x === this.width - 1) {
            return 0
        } else {
            return x + 1
        }
    }

    private getSouthField = (y: number) => {
        if (y === this.height - 1) {
            return 0
        } else {
            return y + 1
        }
    }

    public moveEast = () => {

        let newField: CucumberField = new Array<FieldType>(this.height).fill(FieldType.Empty).map(() =>
            new Array<FieldType>(this.width).fill(FieldType.Empty)
        )

        this.field.forEach((row, y) => {
            row.forEach((cucumber, x) => {
                if (cucumber === FieldType.East) {
                    if (this.field[y][this.getEastField(x)] === FieldType.Empty) {
                        newField[y][this.getEastField(x)] = FieldType.East
                        this.currentStepMovements += 1
                    }
                    else {
                        newField[y][x] = FieldType.East
                    }
                }
                if (cucumber === FieldType.South) {
                    newField[y][x] = FieldType.South
                }
            })
        })

        this.field = newField
    }

    public moveSouth = () => {

        let newField: CucumberField = new Array<FieldType>(this.height).fill(FieldType.Empty).map(() =>
            new Array<FieldType>(this.width).fill(FieldType.Empty)
        )

        this.field.forEach((row, y) => {
            row.forEach((cucumber, x) => {
                if (cucumber === FieldType.South) {
                    if (this.field[this.getSouthField(y)][x] === FieldType.Empty) {
                        newField[this.getSouthField(y)][x] = FieldType.South
                        this.currentStepMovements += 1
                    }
                    else {
                        newField[y][x] = FieldType.South
                    }
                }
                if (cucumber === FieldType.East) {
                    newField[y][x] = FieldType.East
                }
            })
        })

        this.field = newField
    }

    public simulateSteps = (steps: number) => {
        for (let step = 1; step <= steps; step++) {
            this.currentStepMovements = 0
            this.moveEast()
            this.moveSouth()
            console.log(`After step ${step}:`)
            this.printField()
            console.log(`${this.currentStepMovements} cucumbers moved this step`)
        }
    }

    public findSafePlace = () => {
        let anyCucumberMoved: boolean = true
        let steps: number = 0
        while (anyCucumberMoved) {
            this.currentStepMovements = 0
            this.moveEast()
            this.moveSouth()
            anyCucumberMoved = this.currentStepMovements > 0 ? true : false
            steps++
        }
        console.log(`Safe landing place was found after ${steps} steps`)
    }
}


const cc: SolveCucumberField = new SolveCucumberField(input)
// cc.printField()
cc.findSafePlace()
// cc.printField()