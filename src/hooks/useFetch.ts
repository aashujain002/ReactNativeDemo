import { useEffect, useState } from 'react';

export function useFetch<T>(url: string, timeout = 8000) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetchWithTimeout(url, {}, timeout);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const json = await response.json();
                if (isMounted) setData(json);
            } catch (err: any) {
                if (isMounted) setError(err.message || 'Unknown error');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [url, timeout]);

    return { data, loading, error };
}

export async function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout: number = 8000 // default: 8 seconds
): Promise<Response> {
    return Promise.race([
        fetch(url, options),
        new Promise<Response>((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), timeout)
        ),
    ]) as Promise<Response>;
}