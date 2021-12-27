import { readFileSync } from 'fs';

const input: string = readFileSync('input.txt', 'utf-8')

const testInput1: string = `inp z
inp x
mul z 3
eql z x`

const testInput2: string = `inp w
add z w
mod z 2
div w 2
add y w
mod y 2
div w 2
add x w
mod x 2
div w 2
mod w 2`

const minModelNumber: number = 11111111111111
const maxModelNumber: number = 99999999999999

type VariableStore = {
    w: number, x: number, y: number, z: number
}

const main = (program: string, modelNumber: string) => {

    if (modelNumber.length != 14) { throw new EvalError() }

    const lines = program.split('\n')
    let currentCharacter: number = 0

    let varStore: VariableStore = { w: 0, x: 0, y: 0, z: 0 }

    lines.forEach((line) => {

        const instruction: string[] = line.split(' ')
        const operation: string = instruction[0]
        const variables: string[] = instruction.slice(1)

        console.log(instruction)

        let a: string = ''
        let b: string = ''

        switch (operation) {
            case 'inp':
                // varStore = { w: 0, x: 0, y: 0, z: 0 }
                const variable: string = variables[0]
                varStore[variable as keyof VariableStore] = Number(modelNumber.charAt(currentCharacter))
                currentCharacter++
                break;
            case 'add':
                [a, b] = variables
                if (Number(b) || Number(b) === 0) varStore[a as keyof VariableStore] = varStore[a as keyof VariableStore] + Number(b)
                else varStore[a as keyof VariableStore] = varStore[a as keyof VariableStore] + varStore[b as keyof VariableStore]
                break;
            case 'mul':
                [a, b] = variables
                if (Number(b) || Number(b) === 0) varStore[a as keyof VariableStore] = varStore[a as keyof VariableStore] * Number(b)
                else varStore[a as keyof VariableStore] = varStore[a as keyof VariableStore] * varStore[b as keyof VariableStore]
                break;
            case 'div':
                [a, b] = variables
                if (Number(b) || Number(b) === 0) varStore[a as keyof VariableStore] = Math.trunc(varStore[a as keyof VariableStore] / Number(b))
                else varStore[a as keyof VariableStore] = Math.trunc(varStore[a as keyof VariableStore] / varStore[b as keyof VariableStore])
                break;
            case 'mod':
                [a, b] = variables
                if (Number(b) || Number(b) === 0) varStore[a as keyof VariableStore] = varStore[a as keyof VariableStore] % Number(b)
                else varStore[a as keyof VariableStore] = varStore[a as keyof VariableStore] % varStore[b as keyof VariableStore]
                break;
            case 'eql':
                [a, b] = variables
                if (Number(b) || Number(b) === 0) {
                    if (varStore[a as keyof VariableStore] === Number(b)) varStore[a as keyof VariableStore] = 1
                    else varStore[a as keyof VariableStore] = 0
                } else {
                    if (varStore[a as keyof VariableStore] === varStore[b as keyof VariableStore]) varStore[a as keyof VariableStore] = 1
                    else varStore[a as keyof VariableStore] = 0
                }
                break;
        }

        console.log(varStore)

    })
}

const modelNumber: number = 91411143612181 // 59996912981939 // 13579246899999

main(input, modelNumber.toString())
