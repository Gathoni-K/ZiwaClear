import axios from "axios";

interface WeatherData {
    temperature: number;
    precipitation: number;
}

class WeatherService {
    private cache = new Map<string, { data: WeatherData; expiresAt: number }>();
    private readonly TTL_MS = 60 * 60 * 1000; // 1 hour

    // Baseline temperatures for pilot sites (rough approximations for Lake Victoria basin)
    private readonly baselines: Record<string, number[]> = {
        // [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec]
        "dunga": [29, 29, 29, 28, 27, 27, 27, 28, 29, 29, 29, 29],
        "usenge": [29, 29, 29, 28, 27, 27, 27, 28, 29, 29, 29, 29]
    };

    public async getCurrentWeather(siteName: string, latitude: number, longitude: number): Promise<{ tempAnomaly: number; rainfall: number; currentTemp: number }> {
        const cacheKey = `${latitude},${longitude}`;
        const now = Date.now();
        const cached = this.cache.get(cacheKey);

        if (cached && cached.expiresAt > now) {
            return this.calculateAnomaly(siteName, cached.data);
        }

        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation&timezone=Africa/Nairobi`;
            const response = await axios.get(url);
            
            if (response.data?.current) {
                const data: WeatherData = {
                    temperature: response.data.current.temperature_2m,
                    precipitation: response.data.current.precipitation
                };

                this.cache.set(cacheKey, { data, expiresAt: now + this.TTL_MS });
                return this.calculateAnomaly(siteName, data);
            }
            throw new Error("Invalid response format from Open-Meteo");
        } catch (error) {
            console.error("[WeatherService] Failed to fetch weather:", error);
            // Fallback to safe defaults if API fails
            const fallback: WeatherData = { temperature: 25, precipitation: 0 };
            return this.calculateAnomaly(siteName, fallback);
        }
    }

    private calculateAnomaly(siteName: string, data: WeatherData) {
        const normalizedSite = siteName.toLowerCase();
        // Default to 28C if site unknown
        const siteBaselines = this.baselines[normalizedSite] || new Array(12).fill(28); 
        const currentMonth = new Date().getMonth();
        const baseline = siteBaselines[currentMonth];
        
        return {
            tempAnomaly: data.temperature - baseline,
            rainfall: data.precipitation,
            currentTemp: data.temperature
        };
    }
}

export const weatherService = new WeatherService();
