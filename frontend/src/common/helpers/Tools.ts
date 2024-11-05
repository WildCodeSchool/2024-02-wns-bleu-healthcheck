
export default class Tools {

    static getPrettyUrlName = (url: string) => {
        // Remove the protocol and "www." prefix if they exist
        const cleanedUrl = url.replace(/^(https?:\/\/)?(www\.)?/, "");

        // Split by "." and take the first term
        return cleanedUrl.split(".")[0];
    }
}
