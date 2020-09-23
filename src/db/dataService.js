import data from './data.json';

class DataService {
    constructor() {
        this.data = data;
    }

    getPhases() {
        return this.data.Phases
    }

    getCosts() {
        return this.data.Costs
    }
}

export default new DataService()
