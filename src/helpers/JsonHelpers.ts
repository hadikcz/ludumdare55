export default class JsonHelpers {

    static isJsonValid (inputString: string): boolean {
        try {
            JSON.parse(inputString);
            return true;
        } catch (e) {
            return false;
        }
    }
}
