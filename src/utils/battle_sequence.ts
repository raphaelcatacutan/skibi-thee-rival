import { Card } from "./types";

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

let leftCardId: string = ""
let fPerformBAtk = (_index: number, _damage: number) => {}
let fPerformPunch = (_index: number, _skillName: string, _damage: number) => {}
let fPerformCAtk = (_index: number, _damage: number) => {}
let fPerformBonk = (_index: number, _skillName: string, _damage: number) => {}
let fPerformMaldquake = (_index: number, _skillname: string, _dmgtoC1: number, _dmgtoC2: number) => {}
let fPerformDeluluStrike = (_index: number, _skillname: string) => {}
let fPerformSelfCare = (_index: number, _heal: number) => {}
let fPerformHarden = (_index: number) => {}
let fPerformZucc = (_index: number) => {}
let fApplyHealthChange = (_index: number, _currentHealth: number, _maxHealth: number) => {}

function getIndex(id: string) {
    if (leftCardId == id) return 0
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
    private gyattHardness: number = 0;
    private isZucc: boolean = false;
    cardInfo: Card

    constructor(id: string, cardInfo: Card) {
        this.id = id;
        this.name = cardInfo.name;
        this.maxHp = cardInfo.hpValue!;
        this.hp = this.maxHp;
        this.attackDamage = cardInfo.damageValue!;
        this.critAtk = cardInfo.critRateValue!
        this.cardInfo = cardInfo
    }

    reset() {
        this.maxHp = this.cardInfo.hpValue!;
        this.hp = this.maxHp;
        this.attackDamage = this.cardInfo.damageValue!;
        this.critAtk = this.cardInfo.critRateValue!

        fApplyHealthChange(0, this.maxHp, this.maxHp)
        fApplyHealthChange(1, this.maxHp, this.maxHp)
    }

    damage(damage: number): void {
        damage = Math.round(damage);

        if (this.gyattHardness > 0 && damage > 0) {
            damage = Math.round(damage * this.gyattHardness);
            console.log(`${this.name} is Gyatt Harden! Damage reduced to ${damage}.`);
            fPerformHarden(getIndex(this.id))
            this.gyattHarden(false);
        }

        const prevHp = this.hp;
        this.hp = Math.max(0, Math.min(this.maxHp, this.hp - damage));
        fApplyHealthChange(getIndex(this.id), this.hp, this.maxHp)
        console.log(`${this.name} took ${damage} damage. HP: ${prevHp} → ${this.hp}`);
    }

    basicAttack(target: CardMechanics, isCritical: boolean): void {
        const multiplier = isCritical ? this.critAtk : 1;
        const damage = Math.round(this.attackDamage * multiplier);
        if (isCritical) { 
            fPerformCAtk(getIndex(this.id), damage)
        } else {
            fPerformBAtk(getIndex(this.id), damage)
        }
        console.log(`${this.name} attacks ${target.name} for ${damage} damage${isCritical ? " (CRITICAL!)" : ""}`);
        target.damage(damage);
    }

    async consecutiveAttack(cardTarget: CardMechanics): Promise<void> {
        const strikes = random(2, 4);
        console.group(`Consecutive Attack: Number of Strikes: ${strikes}`);
        for (let i = 1; i <= strikes && cardTarget.hp > 0; i++) {
            const damage = Math.round(this.attackDamage * 0.7);
            fPerformPunch(getIndex(this.id), this.cardInfo.skillNames![0], damage)
            console.log(`Hit ${i}: ${cardTarget.name} takes ${damage} damage`);
            cardTarget.damage(damage);
            await sleep(1000);
        }
        console.groupEnd();
    }

    burnAttack(cardTarget: CardMechanics): void {
        console.group("Burn Attack");
        const multiplier = random(1.7, 2.2, true);
        const damage = Math.round(this.attackDamage * multiplier);
        console.log(`${cardTarget.name} is burned and takes ${damage} damage`);
        cardTarget.damage(damage);
        fPerformBonk(getIndex(this.id), this.cardInfo.skillNames![1], damage)
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
        fPerformMaldquake(getIndex(this.id), this.cardInfo.skillNames![2], selfDamage, enemyDamage)
        console.groupEnd();
    }

    setDelulu(state = true): void {
        fPerformDeluluStrike(getIndex(this.id), this.cardInfo.skillNames![3])
        console.log(`${this.name} is ${state ? "now" : "no longer"} Delulu!`);
        this.isDelulu = state;
    }

    gyattHarden(state = true): void {
        fPerformHarden(getIndex(this.id))
        console.log(`${this.name} Gyatt Hardness is now ${state ? "increased" : "decreased"} to ${this.gyattHardness + (state ? 0.3 : -0.3)}!`);
        this.gyattHardness += state ? 0.3 : -0.3;
    }

    setZucc(state = true): void {
        fPerformZucc(getIndex(this.id))
        console.log(`${this.name} is ${state ? "now zuccing" : "no longer zuccing"}.`);
        this.isZucc = state;
    }

    heal(): void {
        const healAmount = random(300, 500);
        fPerformSelfCare(getIndex(this.id), healAmount)
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
    aPerformBAtk = (_index: number, _damage: number) => {},
    aPerformPunch = (_index: number, _skillName: string, _damage: number) => {},
    aPerformCAtk = (_index: number, _damage: number) => {},
    aPerformBonk = (_index: number, _skillName: string, _damage: number) => {},
    aPerformMaldquake = (_index: number, _skillname: string, _dmgtoC1: number, _dmgtoC2: number) => {},
    aPerformDeluluStrike = (_index: number, _skillname: string) => {},
    aPerformSelfCare = (_index: number, _heal: number) => {},
    aPerformHarden = (_index: number) => {},
    aPerformZucc = (_index: number) => {},
    aApplyHealthChange = (_index: number, _currentHealth: number, _maxHealth: number) => {},
    endBattle = (_winnerId: string) => {},
    aPerformDiceRoll = (_result1: number, _result2: number, _message: string) => {},
    isDraw = () => {}
): Promise<number> {
    fPerformBAtk = aPerformBAtk
    fPerformPunch = aPerformPunch
    fPerformCAtk = aPerformCAtk
    fPerformBonk = aPerformBonk
    fPerformMaldquake = aPerformMaldquake
    fPerformDeluluStrike = aPerformDeluluStrike
    fPerformSelfCare = aPerformSelfCare
    fPerformHarden = aPerformHarden
    fPerformZucc = aPerformZucc
    fApplyHealthChange = aApplyHealthChange

    const card1 = new CardMechanics(card1Key, card1Info)
    const card2 = new CardMechanics(card2Key, card2Info)

    leftCardId = card1.id

    let turn1 = card1
    let turn2 = card2
    while (true) {
        const random1 = random(1, 6)
        const random2 = random(1, 6)

        if (random1 == random2) {
            aPerformDiceRoll(random1, random2, "Cards tied")
            await sleep(3000)
            continue
        }
        else {
            const message = random1 > random2 ? "Card 1 will attack first" : "Card 2 will attack first"  
            aPerformDiceRoll(random1, random2, message)
            await sleep(3000)
            turn1 = random1 > random2 ? card1 : card2
            turn2 = random1 > random2 ? card2 : card1
            break
        }
    }

    console.log("⚔️ Battle Start!");
    console.log(`${turn1.name}: ${turn1.hp} HP ${turn1.attackDamage} Base Attack`);
    console.log(`${turn2.name}: ${turn2.hp} HP ${turn2.attackDamage} Base Attack`);
    while (true) {
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
        if (turn1.hp > turn2.hp) {
            endBattle(turn1.id)
            return rounds;
        } else if (turn1.hp < turn2.hp) {
            endBattle(turn2.id)
            return rounds;
        } else {
            isDraw()
            card1.reset()
            card2.reset()
            await sleep(3000)
            continue
        }
    }
}

export { startBattle };