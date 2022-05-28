const assert = require('assert')
const expect = require('expect.js')
import TourneyChop from '../tourney-chop'

describe('TourneyChop Test', function () {
    
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
    }),
    it('chip chop test', () => {
        let t = new TourneyChop(90000,8000,3)
        t.setChipCount(45000,0)
        t.setChipCount(35000,1)
        t.setChipCount(10000,2)
        t.setPayout(4000,0)
        t.setPayout(2000,1)
        t.setPayout(2000,2)
        console.log(t.chipsAndPrize)
        console.log("chip chop: ", t.calcChipChop())
        console.log("icm chop: ", t.calcICM())
    }),
    it('test set Payout unlocked', () => {
        let stPayout = 100000
        let t = new TourneyChop(90000,8000,6)

        t.setPayout(stPayout,0)

        console.log('payout: ', t.chipsAndPrize)

        
        assert.deepStrictEqual(t.chipsAndPrize[1][0] ,stPayout)
    }),
    it('test set ChipCount', () => {
        let totalChips = 90000
        let t = new TourneyChop(totalChips, 8000, 6)
        let testArray = []

        for ( let i = 0; i < 10000; i++) {
            t.setChipCount(Math.floor((Math.random() * 20000)) + 50000, Math.floor(Math.random() * 5))
            let chipCount = t.chipsAndPrize[0].reduce((a,b) => a+b)
            if (t.totals[0] !== chipCount) {
                testArray.push([chipCount, t.totals[0], t.chipsAndPrize[0].slice()])
            }
        }

        if (testArray.length !==0) {
            console.log(testArray)
        }
        assert.deepStrictEqual(testArray.length ,0)
    }),
    it('test set chiptotal', () => {
        let t = new TourneyChop(30000,30000,3)
        let test = [25,255,2555]
        let testArray = []

        for ( let i = 0; i < 10000; i++ ) {
            t.setChipTotal(Math.floor(Math.random() * 20000) + 50000)
            let chipCount = t.chipsAndPrize[0].reduce((a,b) => a+b)
            if ( t.totals[0] !== chipCount) {
                testArray.push([t.totals[0],chipCount, t.chipsAndPrize[0].slice()])
            }
        }

        if (testArray.length !==0) {
            console.log(testArray)
        }
        assert.deepStrictEqual(testArray.length ,0)
    }),
    it('test unfair chip chop', () => {
        let t = new TourneyChop(30000,30000,3)
        t.setChipCount(29900,0)

        let chopAmount = t.calcChipChop(false)
        expect( chopAmount[0] > 15000 ).to.be(true)

        chopAmount = t.calcChipChop(true)
        expect ( chopAmount[0] > 15003 ).to.be(false)
    })
})