
/**
 * Base class for all beverages
 */
class Beverage {

    /**
     * Creates a new beverage with default size set to LARGE
     */
    constructor(){
        this.sizes ={
            'LARGE': 10,
            'REG': 5,
            'SMALL': 2.5
        };
        this.size = this.sizes['LARGE'];

        this.description = "unknown beverage";
    }

    /**
     * Gets the current size of the beverage
     * @returns {number} The size value
     */
    getSize(){
        return this.size;
    }

    /**
     * Sets the size of the beverage
     * @param {string} size - The size to set (LARGE, REG, or SMALL)
     * @throws {string} If invalid size is provided
     */
    setSize(size) {
        if (this.sizes[size]) {
            this.size = this.sizes[size];
        } else {
            throw "wrong size use: " + JSON.stringify(Object.keys(this.sizes));
        }
    }

    /**
     * Gets the description of the beverage
     * @returns {string} The beverage description
     */
    getDesc(){
        return this.description;
    }

    /**
     * Abstract method that must be implemented by subclasses
     * @throws {Error} If not implemented
     */
    cost() {
        throw new Error("Abstract method!");
    }

    /**
     * Gets the calorie content of the beverage
     * @returns {number} The calorie content
     */
    getCalories() {
        return 0;
    }

    /**
     * Gets the price breakdown of the beverage
     * @returns {Array<{item: string, cost: number}>} Array of items and their costs
     */
    getPriceBreakdown() {
        return [{
            item: this.getDesc(),
            cost: this.cost()
        }];
    }
}

/**
 * Dark Roast beverage
 */
class DarkRoast extends Beverage {

    /**
     * Creates a new Dark Roast beverage
     */
    constructor(){
        super();
        this.description = "DarkRoast";
    }    

    /**
     * Calculates the cost of the Dark Roast
     * @returns {number} The cost of the beverage
     */
    cost() {
        return 0.99;
    }

    getCalories() {
        return 5;
    }
}

/**
 * Espresso beverage
 */
class Espresso extends Beverage {

    /**
     * Creates a new Espresso beverage
     */
    constructor(){
        super();
        this.description = "Espresso";
    }

    /**
     * Calculates the cost of the Espresso
     * @returns {number} The cost of the beverage
     */
    cost() {
        return 2.99;
    }

    getCalories() {
        return 1;
    }
}

/**
 * House Blend beverage
 */
class HouseBlend extends Beverage {
    constructor() {
        super();
        this.description = "House Blend Coffee";
    }
    cost() {
        return 0.89;
    }

    getCalories() {
        return 3;
    }
}

/**
 * Decaf beverage
 */
class Decaf extends Beverage {
    constructor() {
        super();
        this.description = "Decaf Coffee";
    }
    cost() {
        return 1.05;
    }

    getCalories() {
        return 2;
    }
}

// Decorators

/**
 * Base decorator class for adding condiments
 */
class CondimentDeco extends Beverage {
    /**
     * Abstract method that must be implemented by decorator subclasses
     * @throws {Error} If not implemented
     */
    getDesc() {
        throw new Error("Abstract method!");
    }

    getPriceBreakdown() {
        const baseCost = this.beverage.getPriceBreakdown();
        const addOnCost = this.cost() - this.beverage.cost();
        return [...baseCost, {
            item: this.getDesc().split(', ').pop(),
            cost: addOnCost
        }];
    }
}

/**
 * Milk condiment decorator
 */
class Milk extends CondimentDeco {
    
    /**
     * Creates a new Milk decorator
     * @param {Beverage} beverageIn - The beverage to decorate
     */
    constructor(beverageIn){
        super();
        this.beverage = beverageIn;
    }

    /**
     * Gets the description of the beverage with milk
     * @returns {string} The decorated beverage description
     */
    getDesc() {
        return this.beverage.getDesc() + ", milk";
    }

    /**
     * Calculates the cost with added milk
     * @returns {number} The total cost including milk
     */
    cost() {
        var cost = this.beverage.cost();
        if (this.beverage.getSize() == this.sizes['LARGE']) {
            cost += 0.75;
        }
        else if (this.beverage.getSize() == this.sizes['REG']) {
            cost += 0.5;
        }
        else if (this.beverage.getSize() == this.sizes['SMALL']) {
            cost += 0.25;
        }

        return 0.19 + cost;
    }

    getCalories() {
        return this.beverage.getCalories() + 50;
    }
}

/**
 * Whip condiment decorator
 */
class Whip extends CondimentDeco {

    /**
     * Creates a new Whip decorator
     * @param {Beverage} beverageIn - The beverage to decorate
     */
    constructor(beverageIn){
        super();
        this.beverage = beverageIn;
    }    

    /**
     * Gets the description of the beverage with whip
     * @returns {string} The decorated beverage description
     */
    getDesc() {
        return this.beverage.getDesc() + ", Whip";
    }

    /**
     * Calculates the cost with added whip
     * @returns {number} The total cost including whip
     */
    cost() {
        return 0.29 + this.beverage.cost();
    }    

    getCalories() {
        return this.beverage.getCalories() + 80;
    }
}

/**
 * Mocha condiment decorator
 */
class Mocha extends CondimentDeco {
    constructor(beverageIn) {
        super();
        this.beverage = beverageIn;
    }
    getDesc() {
        return this.beverage.getDesc() + ", Mocha";
    }
    cost() {
        let cost = this.beverage.cost();
        if (this.beverage.getSize() == this.sizes['LARGE']) {
            cost += 0.40;
        }
        else if (this.beverage.getSize() == this.sizes['REG']) {
            cost += 0.30;
        }
        else if (this.beverage.getSize() == this.sizes['SMALL']) {
            cost += 0.20;
        }
        return cost;
    }

    getCalories() {
        return this.beverage.getCalories() + 60;
    }
}

/**
 * Soy milk condiment decorator
 */
class Soy extends CondimentDeco {
    constructor(beverageIn) {
        super();
        this.beverage = beverageIn;
    }
    getDesc() {
        return this.beverage.getDesc() + ", Soy";
    }
    cost() {
        let cost = this.beverage.cost();
        if (this.beverage.getSize() == this.sizes['LARGE']) {
            cost += 0.55;
        }
        else if (this.beverage.getSize() == this.sizes['REG']) {
            cost += 0.45;
        }
        else if (this.beverage.getSize() == this.sizes['SMALL']) {
            cost += 0.35;
        }
        return cost;
    }

    getCalories() {
        return this.beverage.getCalories() + 30;
    }
}

/**
 * Caramel syrup condiment decorator
 */
class CaramelSyrup extends CondimentDeco {
    constructor(beverageIn) {
        super();
        this.beverage = beverageIn;
    }
    getDesc() {
        return this.beverage.getDesc() + ", Caramel";
    }
    cost() {
        let cost = this.beverage.cost();
        if (this.beverage.getSize() == this.sizes['LARGE']) {
            cost += 0.35;
        }
        else if (this.beverage.getSize() == this.sizes['REG']) {
            cost += 0.25;
        }
        else if (this.beverage.getSize() == this.sizes['SMALL']) {
            cost += 0.15;
        }
        return cost;
    }

    getCalories() {
        return this.beverage.getCalories() + 90;
    }
}
