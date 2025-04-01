class Fighter {
    constructor(name, photo, type) {
        this._name = name;
        this._type = type;
        this._HP = 100;
        this._photo = photo || ''
        this._isKnockedOut = false;
        this._healUses = 2;
    }

    get name() {
        return this._name;
    }

    get type() {
        return this._type;
    }

    get HP() {
        return this._HP;
    }
    
    set HP(newHP) {
        this._HP = newHP
    }

    get isKnockedOut() {
        return this._isKnockedOut;
    }

    get photo() {
        return this._photo;
    }

    get healUses() {
        return this._healUses;
    }

    attack(target) {
        let dmgDone = Math.floor(Math.random() * 100);
        let newHealth = target.HP - dmgDone;
        let message = `${this._name} attacked ${target.name} for ${dmgDone} damage! `;
        if(newHealth <= 0) {
            target.HP = 0;
            target.toggleKnockOut();
            message += `${target.name} is knocked out!`;
        } else {
            target.HP = newHealth;
            // message += `${target.name} has ${newHealth} HP left.`;
        }
        return { damage: dmgDone, message, knockedOut: target.HP === 0 };
    }

    toggleKnockOut() {
        this._isKnockedOut = !this._isKnockedOut;
    }

    heal() {
        if (this._healUses <= 0) {
            return `${this.name} has no potions left!`;
        }

        if (this.HP <= 0) {
            return `${this.name} is knocked out and cannot be healed!`
        }

        const healed = Math.floor(Math.random() * 6) + 10;
        this._healUses--;
        const totalHealth = this.HP + healed;
        let message = '';
        if (totalHealth > 100) {
            const overheald = totalHealth - 100;
            this.HP = 100;
            message = `${this.name} healed for ${healed} HP, but overhealed for ${overheald} HP!`;
        } else {
            this.HP = totalHealth;
            message = `${this.name} healed for ${healed} HP.`
        }
        return message;
    }

    revive() {
        if(this._isKnockedOut){
            this._HP = 30;
            this.toggleKnockOut();
            console.log(`${this.name} is revived with ${this.HP} HP.`)
        }else {
            console.log(`You are already alive!`)
        }
    }
};

export default Fighter;