export function getApiUrl() {
    if (window.appConfig?.apiBaseUrl === undefined) {
        throw new Error('Missing app config base api url');
    }
    return window.appConfig.apiBaseUrl;
}