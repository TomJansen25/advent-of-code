import { assert } from 'console';
import { readFileSync } from 'fs';

const input: string = readFileSync('input.txt', 'utf-8')

class Packet {
    version: number
    type: number
    value: number = 0
    lengthType: number = 0
    remainingBits: string
    subPackets: Packet[] = []

    constructor(packet: string) {

        this.version = parseInt(packet.substring(0, 3), 2)
        this.type = parseInt(packet.substring(3, 6), 2)
        this.remainingBits = packet.substring(6)

        console.log(`Packet ${packet} has Version ${this.version}, Type ${this.type} and the remaining bits are: ${this.remainingBits}`)

        if (this.type === 4) {
            this.value = this.parseLiteral()
            console.log(`Packet is a literal packet with a value of ${this.value}`)

        } else {
            this.lengthType = parseInt(this.remainingBits.charAt(0), 2)
            console.log(`Packet is an operator packet and sub-packets will be parsed with length type = ${this.lengthType}...`)

            if (this.lengthType === 0) {
                const length = parseInt(this.remainingBits.substring(1, 16), 2)
                console.log(`Length of remaining bits to process for sub packets: ${length}`)
                this.remainingBits = this.remainingBits.substring(16)
                this.subPackets = this.getSubPacketsByLength(length)

            } else {
                const numPackets = parseInt(this.remainingBits.substring(1, 12), 2);
                console.log(`Number of sub packets to parse: ${numPackets}`)
                this.remainingBits = this.remainingBits.substring(12)
                this.subPackets = this.getSubPacketsByCount(numPackets)
            }
        }
        switch (this.type) {
            case 0:
                this.value = this.subPackets.reduce((a, b) => a + b.value, 0)
                break
            case 1:
                this.value = this.subPackets.reduce((a, b) => a * b.value, 1)
                break
            case 2:
                this.value = Math.min.apply(Math, this.subPackets.map(p => p.value))
                break
            case 3:
                this.value = Math.max.apply(Math, this.subPackets.map(p => p.value))
                break
            case 5:
                this.value = this.subPackets[0].value > this.subPackets[1].value ? 1 : 0
                break
            case 6:
                this.value = this.subPackets[0].value < this.subPackets[1].value ? 1 : 0
                break
            case 7:
                this.value = this.subPackets[0].value === this.subPackets[1].value ? 1 : 0
                break
        }
    }

    public parseLiteral = () => {

        let literalValue = '';

        while (true) {
            const currentBits = this.remainingBits.substring(0, 5)
            literalValue += currentBits.substring(1)
            this.remainingBits = this.remainingBits.substring(5)
            if (currentBits.charAt(0) === '0') return parseInt(literalValue, 2)
        }
    }

    public getSubPacketsByLength = (length: number) => {

        const subPackets: Packet[] = []
        let parsedLength: number = 0

        while (parsedLength < length) {
            const packet = new Packet(this.remainingBits)
            parsedLength += (this.remainingBits.length - packet.remainingBits.length)
            subPackets.push(packet)
            this.remainingBits = packet.remainingBits
        }
        return subPackets
    }

    public getSubPacketsByCount = (count: number): Packet[] => {
        const subPackets: Packet[] = []
        for (let c = 1; c <= count; c++) {
            const packet = new Packet(this.remainingBits)
            subPackets.push(packet)
            this.remainingBits = packet.remainingBits
        }
        return subPackets
    }
}

const hexToBinary = (hex: string) => (hex.split('').map(it => parseInt(it, 16).toString(2).padStart(4, '0')).join(''))

const sumPacketVersion = (packet: Packet): number => (packet.subPackets.reduce((a, b) => a + sumPacketVersion(b), packet.version))

const testInputs: string[] = ['C200B40A82', '04005AC33890', '880086C3E88112', 'CE00C43D881120', 'D8005AC2A8F0',
    'F600BC2D8F', '9C005AC2F8F0', '9C0141080250320F1802104A08']
const testAnswers: number[] = [3, 54, 7, 9, 1, 0, 0, 1]

// Run Test Inputs of Part 2
testInputs.forEach((inp, index) => {
    const packet = new Packet(hexToBinary(inp))
    assert(packet.value === testAnswers[index])
})

const packet = new Packet(hexToBinary(input))
console.log(packet.version, packet.type, packet.value, packet.lengthType)

console.log(packet.subPackets.map(p => p.value))
console.log(`Final Value of Packet = ${packet.value}`)

// console.log(sumPacketVersion(packet))
