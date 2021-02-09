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
    })
})