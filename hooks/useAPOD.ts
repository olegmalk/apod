import { useState, useEffect } from 'react';
import axios from 'axios';
import { getRandomDate } from '../utils/getRandomDate';
import { Apod } from '../types/apod';
import { makeUrl } from '../utils/makeUrl';

export default function useAPOD() {
    const [data, setData] = useState<Apod | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retry, setRetry] = useState(false);

    useEffect(() => {
        const fetchAPOD = async () => {
            const date = getRandomDate();
            try {
                const response = await axios.get(makeUrl({ date: date.toISOString().slice(0, 10) }));
                setData(response.data);
                setLoading(false);
            } catch (error) {
                setError(JSON.stringify(error));
                setLoading(false);
            }
        };

        if (retry) {
            setLoading(true);
            setError(null);
            setData(null);
            fetchAPOD();
            setRetry(false);
        } else {
            fetchAPOD();
        }
    }, [retry]);

    const triggerRetry = () => {
        setRetry(true);
    };

    return { data, loading, error, triggerRetry };
}