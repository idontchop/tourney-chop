const assert = require('assert')
import {TourneyChop} from '../tourney-chop'

describe('HoldemStrings Test', function () {
    
    it('should initiate', () => {
        let t = new TourneyChop(5000,5000,6)
        assert.deepStrictEqual(t.locked,true)
    }),
    it('test chipCount', () => {
        let t = new TourneyChop(5000,5000,6)
        t.setChipCount(100,3)
        console.log(t.chipsAndPrize)
        t.setPayout(1500, 0)
        console.log(t.chipsAndPrize)
    }),
    it('test recurse', () => {
        let t = new TourneyChop(5000,5000,6)
        let set = [1,2,3,3]
        let k = 2
        let result = [ [ 1, 2 ],
            [ 1, 3 ],
            [ 1, 3 ],
            [ 2, 1 ],
            [ 2, 3 ],
            [ 2, 3 ],
            [ 3, 1 ],
            [ 3, 2 ],
            [ 3, 3 ],
            [ 3, 1 ],
            [ 3, 2 ],
            [ 3, 3 ] ]
        assert.deepStrictEqual(t.calcPermutations(set,k),result)

        let comboResult = [
            [1,2],
            [1,3],
            [1,3],
            [2,3],
            [2,3],
            [3,3]
        ]
        assert.deepStrictEqual(t.calcCombinations(set,k), comboResult)
    }),
    it('prob test', () => {
        let t = new TourneyChop(5000,5000,6)
        t.setChipCount(1500,0)
        t.setChipCount(1500,1)
        let testFinish = [1500,1500,2000]
        console.log(t.calcProb(testFinish))
    })
        
    it('play test', () => {
        let t = new TourneyChop(5000,5000,6)
        let set = [10000,9000,3000]
        let k = 0
        console.log(t.calcPermutations(set,k))
    }),
    it('icm test', () => {
        let t = new TourneyChop(5000,5000,4)
        t.setChipCount(2500,0)
        t.setChipCount(1500,1)
        t.setChipCount(750,2)
        console.log(t.chipsAndPrize)
        console.log(t.calcICM())
    })
})