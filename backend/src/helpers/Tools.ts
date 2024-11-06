
export default class Tools {

    static isRequestLimitReached = (role:number, numberOfQueries:number):boolean => {
        // Return true if user is not premium and has at least 3 saved queries
        if(role < 1 && numberOfQueries >= 3) {
            console.log("We should be here")
            return true;
        }

        // Return true if user is premium and has at least 100 saved queries
        if(role === 1 && numberOfQueries >= 100) {
            return true;
        }

        // For other cases (Admin role or limit not reached), return false
        return false;
    }

}
