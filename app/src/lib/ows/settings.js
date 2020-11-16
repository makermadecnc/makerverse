const ows = {};

export function setOwsSettings(settings) {
    ows.settings = settings;
}

export function getOwsHost() {
    return ows.settings.url ?? 'https://openwork.shop';
}
