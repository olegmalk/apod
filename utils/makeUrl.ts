const API_KEY = 'msyz6brJcv0J6QLnTn0MiVYM37pNcLM4H2jM0ZJy';

export const makeUrl = (options: Record<string, string>) => {
    let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
    for (const [key, value] of Object.entries(options)) {
        url += `&${key}=${value}`;
    }
    return url;
}