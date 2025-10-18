class Config {
    static get apiUrl(): string {
        const url = import.meta.env.VITE_API_URL;

        if (!url) {
            throw new Error("VITE_API_URL is not defined in the environment variables.");
        }

        return url;
    }

    static get appVersion(): string {
        const version = import.meta.env.VITE_APP_VERSION;

        if (!version) {
            throw new Error("VITE_APP_VERSION is not defined in the environment variables.");
        }

        return version;
    }
}

export default Config;