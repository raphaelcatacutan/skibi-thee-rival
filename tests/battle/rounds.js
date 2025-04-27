/**
 *
 * @param {Card} realTurn
 * @param {Card} realTarget
 */
async function battleSequence(realTurn, realTarget) {
	const attackType = Math.floor(Math.random() * 10);

	const targetDelulu = realTurn.getDelulu() ? realTurn : realTarget;
	const turnDelulu = realTurn.getDelulu() ? realTarget : realTurn;
	const targetZucc = realTarget.getZucc() ? realTarget : realTurn;
	const turnZucc = realTurn.getZucc() ? realTurn : realTarget;

	if (attackType >= 0 && attackType <= 5) {
		console.group(`Basic Attack`);
		turnDelulu.basicAttack(targetDelulu, false);
        if (realTurn.getDelulu()) realTurn.setDelulu(false);
		console.groupEnd();
	} else if (attackType > 5 && attackType <= 7) {
		console.group(`Critical Attack`);
		turnDelulu.basicAttack(targetDelulu, true);
        if (realTurn.getDelulu()) realTurn.setDelulu(false);
		console.groupEnd();
	} else {
		console.group(`Special Skill`);
		const someoneDelulu = realTurn.getDelulu() || realTarget.getDelulu();
		const someoneZuccing = realTurn.getZucc() || realTarget.getZucc();

		const actions = [
			[async () => await turnDelulu.consecutiveAttack(targetDelulu), 20],
			[() => turnDelulu.burnAttack(targetDelulu), 15],
			[() => turnDelulu.earthquakeAttack(targetDelulu), 15],
			[() => targetDelulu.setDelulu(true), someoneDelulu ? 0 : 10],
			[() => realTurn.setZucc(true), someoneZuccing ? 0: 25],
			[() => targetZucc.gyattHarden(true), 15],
			[() => targetZucc.heal(), 10],
		];

		const selectedSkill = pickSkill(actions);
		await actions[selectedSkill][0]();

        if (selectedSkill >= 5 && targetZucc.getZucc()) targetZucc.setZucc(false);
        else if (realTurn.getDelulu()) realTurn.setDelulu(false);
		console.groupEnd();
	}
}


function pickSkill(actions) {
    const totalChance = actions.reduce((total, action) => total + action[1], 0);
    
    let randomValue = Math.random() * totalChance;

    for (let i = 0; i < actions.length; i++) {
        randomValue -= actions[i][1];
        if (randomValue < 0) return i; 
    }
}

class Card {
    #isDelulu = false;
    #isGyattHarden = false;
    #isZucc = false;

	constructor(name) {
		this.name = name;
		this.maxHp = Math.floor(Math.random() * 1001) + 1500;
		this.hp = this.maxHp;
		this.attackDamage = Math.round(Math.random() * 50 + 200);
	}

	damage(damage) {
		damage = Math.round(damage);

		if (this.#isGyattHarden) {
			damage = Math.round(damage * 0.3);
			console.log(
				`${this.name} is Gyatt Harden! Damage reduced to ${damage}.`
			);
			this.gyattHarden(false); // Reset Gyatt Harden status
		}

		const prevHp = this.hp;
		this.hp = Math.max(0, Math.min(this.maxHp, this.hp - damage));
		console.log(
			`${this.name} took ${damage} damage. HP: ${prevHp} → ${this.hp}`
		);
	}

    /**
     * 
     * @param {Card} target 
     * @param {boolean} isCritical 
     */
    basicAttack(target, isCritical) {
        const multiplier = isCritical ? Math.random() * (2 - 1.6) + 1.6 : 1;
        const damage = Math.round(this.attackDamage * multiplier);
        console.log(
            `${this.name} attacks ${target.name} for ${damage} damage${
                isCritical ? " (CRITICAL!)" : ""
            }`
        );
        target.damage(damage);
    }
    
    async consecutiveAttack(cardTarget) {
        const strikes = Math.floor(Math.random() * 3) + 2; // Random from 2 to 4 strikes
        console.group(`Consecutive Attack: Number of Strikes: ${strikes}`);
        for (let i = 1; i <= strikes && cardTarget.hp > 0; i++) {
            const damage = Math.round(this.attackDamage * 0.7);
            await sleep(1000);
            console.log(`Hit ${i}: ${cardTarget.name} takes ${damage} damage`);
            cardTarget.damage(damage);
        }
        console.groupEnd();
    }
    
    burnAttack(cardTarget) {
        console.group("Burn Attack");
        const multiplier = Math.random() * (2.2 - 1.7) + 1.7;
        const damage = Math.round(this.attackDamage * multiplier);
        console.log(`${cardTarget.name} is burned and takes ${damage} damage`);
        cardTarget.damage(damage);
        console.groupEnd();
    }
    
    earthquakeAttack(cardTarget) {
        console.group("Earthquake Attack");
        const selfDamage = Math.round(this.attackDamage * 0.6);
        const enemyDamage = Math.round(this.attackDamage * 2.4);
        console.log(`${this.name} takes ${selfDamage} recoil damage`);
        this.damage(selfDamage);
        console.log(`${cardTarget.name} takes ${enemyDamage} damage`);
        cardTarget.damage(enemyDamage);
        console.groupEnd();
    }
    
    setDelulu(state = true) {
        if (state) {
            console.log(
            `${this.name} is now Delulu! They will attack the themself.`
            );
        } else {
            console.log(
            `${this.name} is no longer Delulu. They will attack the correct target.`
            );
        }
        this.#isDelulu = state;
    }
    
    gyattHarden(state = true) {
        if (state) {
            console.log(
            `${this.name} is now Gyatt Harden! Incoming damage will be reduced.`
            );
        } else {
            console.log(
            `${this.name} is no longer Gyatt Harden.`
            );
        }
        this.#isGyattHarden = state;
    }
    
    setZucc(state = true) {
        if (state) {
            console.log(
            `${this.name} is now zuccing! The next defense will be directed to them.`
            );
        } else {
            console.log(
            `${this.name} is no longer zuccing.`
            );
        }
        this.#isZucc = state;
    }
    
    heal() {
        const healAmount = Math.floor(Math.random() * 51) + 250;
        console.log(`${this.name} heals for ${healAmount} HP!`);
        this.damage(-healAmount);
    }

    getDelulu() {
        return this.#isDelulu;
    }

    getZucc() {
        return this.#isZucc;
    }
}



function sleep(ms) {
	// return new Promise(resolve => setTimeout(resolve, ms));
}

async function startBattle() {
	const card1 = new Card("Card 1");
	const card2 = new Card("Card 2");
	console.log("⚔️ Battle Start!");
	console.log(`${card1.name}: ${card1.hp} HP`);
	console.log(`${card2.name}: ${card2.hp} HP`);

	let rounds = 0;
	while (card1.hp > 0 && card2.hp > 0) {
		rounds++;
        console.log(`\n🌀 Round ${rounds}`);
		console.group("🔁 Turn: Card 1");
		await battleSequence(card1, card2);
		console.groupEnd();
		if (card2.hp <= 0) break;
		await sleep(1000);

		console.group("🔁 Turn: Card 2");
		await battleSequence(card2, card1);
		console.groupEnd();
		await sleep(1000);
	}

	console.log("\n🏁 Battle Over!");
	console.log(`${card1.name}: ${card1.hp} HP`);
	console.log(`${card2.name}: ${card2.hp} HP`);

	return rounds;
}
async function runSimulations(times = 10) {
    console.time("Simulation-Time");
	let totalRounds = 0;

	let maxRounds = 0;
	let minRounds = Infinity;

	for (let i = 1; i <= times; i++) {
        console.log("\n\n--------------------------------------------------------");
		console.log(`🔄 Simulation ${i}`);
		const rounds = await startBattle();
		console.log(`✅ Simulation ${i} finished in ${rounds} round(s)`);
		totalRounds += rounds;
		if (rounds > maxRounds) {
			maxRounds = rounds;
		}
		if (rounds < minRounds) {
			minRounds = rounds;
		}
	}

	const average = totalRounds / times;
	console.log(
		`\n📊 Average Rounds over ${times} simulations: ${average.toFixed(2)}`
	);
	console.log(`📊 Max Rounds: ${maxRounds}`);
	console.log(`📊 Min Rounds: ${minRounds}`);
    console.timeEnd("Simulation-Time");
}

runSimulations(100);
