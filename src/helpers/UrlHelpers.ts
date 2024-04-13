export default class UrlHelpers {
    static getQueryParam (paramName: string): string | null {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(paramName);
    }

    static queryEquals (paramName: string, value: any): boolean {
        let queryValue = UrlHelpers.getQueryParam(paramName);
        return queryValue === value;
    }
}
