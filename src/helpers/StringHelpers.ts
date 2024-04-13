export default class StringHelpers {
    static capitalize (string: string): string {
        return string[0].toUpperCase() + string.slice(1);
    }

    static cutString (string: string, length: number): string {
        if (string === undefined) return '';

        return string.substr(0, length);
    }

    static getFirstNameAndCut (string: string, length: number): string {
        if (string === undefined) return '';

        let parts = string.split(' ');
        return StringHelpers.cutString(parts[0], length);
    }

    static replaceAll (target: string, search: string, replacement: string): string {
        return target.replace(new RegExp(search, 'g'), replacement);
    }

    static getAllIndexes (arr: [], val: never): number[] {
        let indexes: number[] = [];
        let i = -1;
        while ((i = arr.indexOf(val, i + 1)) !== -1) {
            indexes.push(i);
        }
        return indexes;
    }

    static randomString (length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
}
