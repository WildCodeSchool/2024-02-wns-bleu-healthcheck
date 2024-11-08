import {Role} from "@/common/models/User.ts";

export default class Tools {

    static getPrettyUrlName = (url: string) => {
        // Remove the protocol and "www." prefix if they exist
        const cleanedUrl = url.replace(/^(https?:\/\/)?(www\.)?/, "");

        // Split by "." and take the first term
        return cleanedUrl.split(".")[0];
    }

    static isRequestLimitReached = (role:Role|null, numberOfQueries:number):boolean => {
        // Return true if user is not premium and has at least 3 saved queries
        if(role && role < 1 && numberOfQueries >= 3) {
            return true;
        }

        // Return true if user is premium and has at least 100 saved queries
        if(role && role === 1 && numberOfQueries >= 100) {
            return true;
        }

        // For other cases (Admin role or limit not reached), return false
        return false;
    }

    static isUserPremium = (role:Role|null):boolean => {
        if(role) {
            return role >= 1;
        }
        return false;
    }
}
