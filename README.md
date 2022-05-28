# Tourney Chop ICM Calculator

Javascript ES6 singleton to easily store and calculate poker tournament chops. (Chip Chop and ICM Chop)

## Install

Add to your Node package. (only tested with create-react-app)
In package.json under "dependencies":
    "tourney-chop": "git@github.com:idontchop/tourney-chop.git",




## Usage:

new TourneyChop( chipTotal, prizePool, numPlayers, [chips]?, [prizes]?, chipLocked?, prizeLocked?)

#### chipTotal, prizePool, numPlayers

Required. Set the total chips in play, total remaining prize pool,
and number of players. If only these three parameters are given,
chips and prizes will be distributed. 1 player required

#### [chips]?, [prizes]?

Arrays that contain the chip and prize distribution. Errors will be thrown if totals do not equal supplied totals if values are locked.

#### chipLocked?, prizeLocked?

defaults to false. If locked, setting a chip count or prize will not change the totals. The remainders will be distributed to other players


#### get chipsAndPrize, dataSave, totals

Data dumps for current values


#### setChipCount ( chips, position )
Sets the chip position to the supplied chips. If locked, cannot be a value that exceeds total

#### setPayout ( payout, position )
Sets the payout position to the supplied chips. If locked, cannot be a value that exceeds total

#### setChipTotal ( total ) 

Changes total chips in play. Will attempt to distribute remainder evenly.


#### setPrizePool ( total )

Changes total payout. Will redistribute prizes.


#### popPlayer ( position )

Removes the player in position


#### addPlayer ()

Adds a new player, sets chips to 1. If locked, takes 1 chip from chip leader


#### chopICM ()

Runs ICM chip calculation. Gives any remainder to chip leader. After running, values can be retrieved with get methods


#### chopChips()

Runs chip chop calculation. Gives any remainder to chip leader. Currently will not perform an "unfair" calculation where 
1st place would receive more than 1st or last place less than last (exception with remainders). 

> NOTE: I might add a flag for unfair calculation in code and forget to change docs, good chance > for contribution!
