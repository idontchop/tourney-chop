
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
export class TourneyChop  {
    
    constructor(chipTotal = 0, prizePool = 0, players = 2) {

        this.chipTotal = chipTotal;     // Total count of chips, should equal sum of chipCount
        this.prizePool = prizePool;     // Prizepool, should equal sum of payout
        this.players = players;         // Number of players
        
        this.locked = !(chipTotal === 0);
            // if locked is true, chipTotal and Prizepool has been set and cannot be changed

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

    /**
     * position starts at 0
     * @param {*} chips 
     * @param {*} position 
     */
    setChipCount ( chips, position ) {

        if ( position < 0 ||
             position > this.players -1 ||
             chips < 0 ||
             chips > this.chipTotal) throw new Error("malformed position argument: " + position)
        
        let difference = this.chipCount[position] - chips;
        this.chipCount[position] = chips;

        if (this.locked) {
            // if locked, spread the difference down rest, unless last was changed, then spread equally
            let start = (position < this.players-1) ? position + 1 : 0;
            let end = (position < this.players-1) ? this.players : position;
            for ( let i = start; i < end; i++) {
                this.chipCount[i] += Math.floor(difference / (end-start))
            }
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

        if ( this.locked ) {
            let start = (position < this.players-1) ? position + 1 : 0;
            let end = (position < this.players-1) ? this.players : position;
            for ( let i = start; i < end; i++) {
                this.payout[i] += Math.floor(difference / (end-start))
            }
        } else {
            this.resetAll()
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

    calcICM () {

    }

    calcChipChop () {

    }
}
