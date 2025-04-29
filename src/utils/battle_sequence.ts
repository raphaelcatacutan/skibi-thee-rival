import { Card, CardPrompt } from "./types";

function random(min: number, max: number, isInt = true): number {
    const value = Math.random() * (max - min) + min;
    return isInt ? Math.floor(value) : value;
}

function pickSkill(actions: [() => Promise<void> | void, number][]): number {
    const totalChance = actions.reduce((total, action) => total + action[1], 0);
    let randomValue = Math.random() * totalChance;

    for (let i = 0; i < actions.length; i++) {
        randomValue -= actions[i][1];
        if (randomValue < 0) return i;
    }

    return 0; // Fallback
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let card1Name: string = ""
let performBAtk = (index: number) => {}
let performPunch = (index: number) => {}
let performCAtk = (index: number) => {}
let performBonk = (index: number) => {}
let performMaldquake = (index: number) => {}
let performDeluluStrike = (index: number) => {}
let performSelfCare = (index: number) => {}
let performHarden = (index: number) => {}
let performZucc = (index: number) => {}
let applyHealthChange = (index: number, currentHealth: number, maxHealth: number) => {}

function getIndex(name: string) {
    if (card1Name == name) return 0
    else return 1
}

class CardMechanics {
    public id: string;
    public name: string;
    public hp: number;
    public maxHp: number;
    public attackDamage: number;
    public critAtk: number;

    private isDelulu: boolean = false;
    private isGyattHarden: boolean = false;
    private isZucc: boolean = false;

    constructor(id: string, cardInfo: Card) {
        this.id = id;
        this.name = cardInfo.name;
        this.maxHp = cardInfo.hpValue!;
        this.hp = this.maxHp;
        this.attackDamage = cardInfo.damageValue!;
        this.critAtk = cardInfo.critRateValue!
    }

    damage(damage: number): void {
        damage = Math.round(damage);

        if (this.isGyattHarden && damage > 0) {
            damage = Math.round(damage * 0.3);
            console.log(`${this.name} is Gyatt Harden! Damage reduced to ${damage}.`);
            performHarden(getIndex(this.name))
            this.gyattHarden(false);
        }

        const prevHp = this.hp;
        this.hp = Math.max(0, Math.min(this.maxHp, this.hp - damage));
        applyHealthChange(getIndex(this.name), this.hp, this.maxHp)
        console.log(`${this.name} took ${damage} damage. HP: ${prevHp} → ${this.hp}`);
    }

    basicAttack(target: CardMechanics, isCritical: boolean): void {
        const multiplier = isCritical ? this.critAtk : 1;
        const damage = Math.round(this.attackDamage * multiplier);
        if (isCritical) { 
            performCAtk(getIndex(this.name))
        } else {
            performBAtk(getIndex(this.name))
        }
        console.log(`${this.name} attacks ${target.name} for ${damage} damage${isCritical ? " (CRITICAL!)" : ""}`);
        target.damage(damage);
    }

    async consecutiveAttack(cardTarget: CardMechanics): Promise<void> {
        const strikes = random(2, 4);
        console.group(`Consecutive Attack: Number of Strikes: ${strikes}`);
        for (let i = 1; i <= strikes && cardTarget.hp > 0; i++) {
            const damage = Math.round(this.attackDamage * 0.7);
            await sleep(1000);
            performPunch(getIndex(this.name))
            console.log(`Hit ${i}: ${cardTarget.name} takes ${damage} damage`);
            cardTarget.damage(damage);
        }
        console.groupEnd();
    }

    burnAttack(cardTarget: CardMechanics): void {
        console.group("Burn Attack");
        const multiplier = random(1.7, 2.2, true);
        const damage = Math.round(this.attackDamage * multiplier);
        console.log(`${cardTarget.name} is burned and takes ${damage} damage`);
        cardTarget.damage(damage);
        performBonk(getIndex(this.name))
        console.groupEnd();
    }

    earthquakeAttack(cardTarget: CardMechanics): void {
        console.group("Earthquake Attack");
        const selfDamage = Math.round(this.attackDamage * 0.6);
        const enemyDamage = Math.round(this.attackDamage * 2.4);
        console.log(`${this.name} takes ${selfDamage} recoil damage`);
        this.damage(selfDamage);
        console.log(`${cardTarget.name} takes ${enemyDamage} damage`);
        cardTarget.damage(enemyDamage);
        performMaldquake(getIndex(this.name))
        console.groupEnd();
    }

    setDelulu(state = true): void {
        performDeluluStrike(getIndex(this.name))
        console.log(`${this.name} is ${state ? "now" : "no longer"} Delulu!`);
        this.isDelulu = state;
    }

    gyattHarden(state = true): void {
        performHarden(getIndex(this.name))
        console.log(`${this.name} is ${state ? "now" : "no longer"} Gyatt Harden!`);
        this.isGyattHarden = state;
    }

    setZucc(state = true): void {
        performZucc(getIndex(this.name))
        console.log(`${this.name} is ${state ? "now zuccing" : "no longer zuccing"}.`);
        this.isZucc = state;
    }

    heal(): void {
        performSelfCare(getIndex(this.name))
        const healAmount = random(300, 500);
        console.log(`${this.name} heals for ${healAmount} HP!`);
        this.damage(-healAmount);
    }

    getDelulu(): boolean {
        return this.isDelulu;
    }

    getZucc(): boolean {
        return this.isZucc;
    }
}

async function battleSequence(realTurn: CardMechanics, realTarget: CardMechanics): Promise<void> {
    const attackType = random(1, 10);

    const targetDelulu = realTurn.getDelulu() ? realTurn : realTarget;
    const turnDelulu = realTurn.getDelulu() ? realTarget : realTurn;
    const targetZucc = realTarget.getZucc() ? realTarget : realTurn;
    const turnZucc = realTurn.getZucc() ? realTurn : realTarget;

    if (attackType >= 1 && attackType <= 3) {
        console.group(`Basic Attack`);
        turnDelulu.basicAttack(targetDelulu, false);
        if (realTurn.getDelulu()) realTurn.setDelulu(false);
        console.groupEnd();
    } else if (attackType >= 4 && attackType <= 5) {
        console.group(`Critical Attack`);
        turnDelulu.basicAttack(targetDelulu, true);
        if (realTurn.getDelulu()) realTurn.setDelulu(false);
        console.groupEnd();
    } else {
        console.group(`Special Skill`);
        const someoneDelulu = realTurn.getDelulu() || realTarget.getDelulu();
        const someoneZuccing = realTurn.getZucc() || realTarget.getZucc();

        const actions: [() => Promise<void> | void, number][] = [
            [async () => await turnDelulu.consecutiveAttack(targetDelulu), 20],
            [() => turnDelulu.burnAttack(targetDelulu), 15],
            [() => turnDelulu.earthquakeAttack(targetDelulu), 15],
            [() => targetDelulu.setDelulu(true), someoneDelulu ? 0 : 10],
            [() => realTurn.setZucc(true), someoneZuccing ? 0 : 5],
            [() => targetZucc.gyattHarden(true), 20],
            [() => targetZucc.heal(), 15],
        ];

        const selectedSkill = pickSkill(actions);
        await actions[selectedSkill][0]();

        if (selectedSkill >= 5 && targetZucc.getZucc()) {
            targetZucc.setZucc(false);
        } else if (selectedSkill < 4 && realTurn.getDelulu()) {
            realTurn.setDelulu(false);
        }
        console.groupEnd();
    }
}

async function startBattle(
    card1Key: string,
    card2Key: string,
    card1Info: Card,
    card2Info: Card,
    aperformBAtk = (index: number) => {},
    aperformPunch = (index: number) => {},
    aperformCAtk = (index: number) => {},
    aperformBonk = (index: number) => {},
    aperformMaldquake = (index: number) => {},
    aperformDeluluStrike = (index: number) => {},
    aperformSelfCare = (index: number) => {},
    aperformHarden = (index: number) => {},
    aperformZucc = (index: number) => {},
    aapplyHealthChange = (index: number, currentHealth: number, maxHealth: number) => {},
    afinishedBattle = (winnerId: string) => {},
    aperformDiceRoll = (result1: number, result2: number) => {}
): Promise<number> {
    performBAtk = aperformBAtk
    performPunch = aperformPunch
    performCAtk = aperformCAtk
    performBonk = aperformBonk
    performMaldquake = aperformMaldquake
    performDeluluStrike = aperformDeluluStrike
    performSelfCare = aperformSelfCare
    performHarden = aperformHarden
    performZucc = aperformZucc
    applyHealthChange = aapplyHealthChange

    const card1 = new CardMechanics(card1Key, card1Info)
    const card2 = new CardMechanics(card2Key, card2Info)

    let turn1 = card1
    let turn2 = card2

    while (true) {
        const random1 = random(1, 6)
        const random2 = random(1, 6)
    
        aperformDiceRoll(random1, random2)

        await sleep(3000)

        if (random1 == random2) continue
        else {
            turn1 = random1 > random2 ? card1 : card2
            turn2 = random1 > random2 ? card2 : card1
            break
        }
    }

    card1Name = turn1.name
    console.log("⚔️ Battle Start!");
    console.log(`${turn1.name}: ${turn1.hp} HP ${turn1.attackDamage} Base Attack`);
    console.log(`${turn2.name}: ${turn2.hp} HP ${turn2.attackDamage} Base Attack`);
    let rounds = 0;

    while (turn1.hp > 0 && turn2.hp > 0) {
        rounds++;
        console.log(`\n🌀 Round ${rounds}`);
        console.group("🔁 Turn: Card 1");
        await battleSequence(turn1, turn2);
        console.groupEnd();
        if (turn2.hp <= 0) break;
        await sleep(1000);

        console.group("🔁 Turn: Card 2");
        await battleSequence(turn2, turn1);
        console.groupEnd();
        await sleep(1000);
    }

    console.log("\n🏁 Battle Over!");
    console.log(`${turn1.name}: ${turn1.hp} HP`);
    console.log(`${turn2.name}: ${turn2.hp} HP`);

    await sleep(1000)
    afinishedBattle((turn1.hp > turn2.hp) ? turn1.id : turn2.id)
    return rounds;
}
// async function runSimulations(times = 10): Promise<void> {
//     console.time("Simulation-Time");
//     let totalRounds = 0;
//     let maxRounds = 0;
//     let minRounds = Infinity;

//     for (let i = 1; i <= times; i++) {
//         console.log("\n\n--------------------------------------------------------");
//         console.log(`🔄 Simulation ${i}`);
//         const rounds = await startBattle();
//         console.log(`✅ Simulation ${i} finished in ${rounds} round(s)`);
//         totalRounds += rounds;
//         maxRounds = Math.max(maxRounds, rounds);
//         minRounds = Math.min(minRounds, rounds);
//     }

//     const average = totalRounds / times;
//     console.log(`\n📊 Average Rounds over ${times} simulations: ${average.toFixed(2)}`);
//     console.log(`📊 Max Rounds: ${maxRounds}`);
//     console.log(`📊 Min Rounds: ${minRounds}`);
//     console.timeEnd("Simulation-Time");
// }

// runSimulations(100);

export { startBattle };