
/**
 * TourneyChop ( chipTotal, prizePool, players)
 * locks the total and prizepool where adjusting player positions
 * is blanaced.
 * 
 * TrouneyChop ()
 * adjusting player positions adds to totals
 *  
 * After chip counts and prizepool is set, call either
 * calcICM()
 * calcChipChop()
 *
 */
export default class TourneyChop  {
    
    constructor(chipTotal = 0, prizePool = 0, players = 2) {

        this.chipTotal = chipTotal;     // Total count of chips, should equal sum of chipCount
        this.prizePool = prizePool;     // Prizepool, should equal sum of payout
        this.players = players;         // Number of players
        
        this.locked = !(chipTotal === 0);
            // if locked is true, chipTotal has been set and cannot be changed

        this.plocked = false; // prizepool can only be locked by user

        if ( this.locked ) {
            this.chipCount = Array(players).fill( Math.round(chipTotal / players) )

            // add difference to first place
            this.chipCount[0] += (chipTotal - this.chipCount.reduce ( (sum, e) => sum + e ))
        } else {
            this.chipCount = Array(players).fill(0)
        }

        let payoutStandard = [.27, .16, .10, .08, .07, .05, .04, .03, .025, .02, .019, .019, .019, .019, .019]

        this.payout = []

        for ( let i = 0; i < players; i++) {
            this.payout[i] = Math.round (prizePool * payoutStandard[i])
        }
    }

    get chipsAndPrize() {
        return [this.chipCount, this.payout]
    }

    get totals() {
        return [this.chipTotal, this.prizePool]
    }

    /**
     * position starts at 0
     * 
     * If chip total is locked, this will adjust chip positions below the set position.
     * If it is the last position, it will adjust all positions.
     * 
     * @param {*} chips 
     * @param {*} position 
     */
    setChipCount ( chips, position ) {

        if ( chips % 1 !== 0 ||
             position < 0 ||
             position > this.players -1 ||
             chips < 0 ||
             chips > this.chipTotal) throw new Error("malformed position argument: " + position, chips)
        
        let difference = this.chipCount[position] - chips;

        this.chipCount[position] = chips;

        if (this.locked) {
            // if locked, spread the difference down rest, unless last was changed, then spread equally
            
            this.chipCount = this.distributeRemainder(this.chipCount, difference, position)
            
        } else {
            // not locked so just reset chip counts
            this.resetAll();
        }
    }

    setPayout ( payout, position ) {

        if ( payout < 0 ||
             payout > this.prizePool ||
             position < 0 ||
             position > this.players-1) throw new Error("malformed argument: " + position + " " + payout)

        let difference = this.payout[position] - payout;
        this.payout[position] = payout;

        if ( this.plocked ) {
            this.payout = this.distributeRemainder(this.payout, difference, position)
        } else {
            this.resetPrizePool()
        }
    }

    /**
     * Ran by setChipCount and setPayout to distribute chips to other players
     * when a player's chips are set and the chip total / prize pool is locked.
     * 
     * @param {*} array 
     * @param {*} difference 
     * @param {*} position 
     */
    distributeRemainder ( array, difference, position ) {

        let start = (position < this.players-1) ? position + 1 : 0;
        let end = (position < this.players-1) ? this.players : position;
        let rest = difference % (end-start) // remainder
        let remainder = rest // remainder holds value
        for ( let i = start; i < end; i++) {    
            if ( rest < 0 ) { // Use ceil if we have a remainder, floor if not
                array[i] -= 1
                rest++
            }
            else if ( rest > 0 ) {
                array[i] += 1
                rest--
            }
            
            if ( remainder < 0) {
                array[i] += Math.ceil(difference / (end-start))
            } else {
                array[i] += Math.floor(difference / (end-start))
            }
        }
        return array
    }

    setChipTotal ( total ) {

        if ( this.locked ) {
            // get total difference and add to all chip counts
            let diff = total - this.chipTotal
            this.chipCount = this.chipCount.map ( e => Math.round(e + (diff/this.players)) )
            this.chipTotal = total

        } else {
            this.chipTotal = total
        }
    }

    setPrizePool ( total ) {

        if ( this.plocked ) {
            let diff = total - this.prizePool
            this.payout = this.payout.map ( e => Math.round(e + (diff/this.players)) )
            this.prizePool = total
        } else {
            this.prizePool = total
        }
    }

    setChipCounts ( chipsArray ) {
        this.chipCount = chipsArray;
        this.resetAll()
    }

    resetAll () {
        this.resetChipTotal()
        this.resetPrizePool()
    }
    resetChipTotal () {
        this.chipTotal = this.chipCount.reduce ( (sum, e) => sum + e );
    }

    resetPrizePool () {
        this.prizePool = this.payout.reduce ( (sum, e) => sum + e)
    }

    chopICM () {
        return this.calcICM()
    }
    calcICM () {

        return this.chipCount.map( (e,i) => {

            // array of chip counts of other players minus this one
            let chips = this.chipCount.slice(0,i).concat(this.chipCount.slice(i+1,this.players))
            // calculate equity for each prize
            return this.payout.map ( (prize,pIndex) => {
                
                // just need to calc each scenario of chip stacks above
                // with permutations, calculate different ways of placing
                if ( pIndex === 0) {
                    return ( e / this.chipTotal) * prize // first place
                } else {

                    // find permutations for each place, then calc probability of event happening
                    // chip stack / total chips 
                    // sum the probabilities and multiply by prize
                    return this.calcPermutations( chips, pIndex).map( (v, i) => {
                        let aboveSum = v.reduce( (a,b) => a+b);
                        let aboveProb = this.calcProb(v)
                        return (aboveProb * ( e / (this.chipTotal - aboveSum) )) //* prize
                    }).reduce((a,b) => a+b) * prize
                }
                
                // sum EV of all prizes
            }).reduce( (a,b) => a+b)

            // round the results
            // possible there ends up being a remainder? 
        }).map ( e => Math.round(e))

    }

    chopChips () {
        return this.calcChipChop()
    }
    calcChipChop () {

        // find guarenteed payout
        let lowestPay = this.payout.reduce ( (a,b) => Math.min(a,b))

        // calculate total winnable amount after guarentee
        let above = this.payout.map(e => e-lowestPay)
            .reduce ( (a,b) => a+b)

        // calculate share of 
        return this.chipCount.map ( e => 
            ( e / this.chipTotal ) * above + lowestPay
        )
        .map ( e => Math.round(e))
    }

    calcCombinations(set,length) {
        this.permutations=[]
        this.permute([],set,length)
        return this.permutations;
    }

    calcPermutations(set,length) {
        this.permutations=[]
        this.permute([],set,length,false) // side effect, why did I do it this way?
        return this.permutations
    }

    calcProb(finish, chips=this.chipTotal, acc = 1) {
        if(finish.length === 0) return acc
        let c = finish[0]
        let newfinish = [...finish]
        newfinish.splice(0,1)
        return this.calcProb(newfinish, chips-c, acc * (c/chips))

    }

    permute(partial, set, k, combo=true) {
        //if(set.length < k) return
        
        for (let i = 0; i < set.length; i++) {

            if (k === 1) {
                this.permutations.push(partial.concat([set[i]]))
            }
            else {
                let copy = set.slice() // remove item at index and make copy
                if(combo) { copy.splice(0,i+1)}
                else {copy.splice(i,1)}
                //if (partial[0] === 1500) console.log(partial, set[i], set, k, set.slice().splice(0,1), i)
                this.permute(partial.concat(set[i]), copy, k - 1, combo) // recurse
            }

        }
    }
}

