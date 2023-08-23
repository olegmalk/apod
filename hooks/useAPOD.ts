import { useState, useEffect } from 'react';
import axios from 'axios';
import { getRandomDate } from '../utils/getRandomDate';
import { Apod } from '../types/apod';
import { makeUrl } from '../utils/makeUrl';

export default function useAPOD(date: string) {
    const [data, setData] = useState<Apod | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retry, setRetry] = useState(false);

    useEffect(() => {
        const fetchAPOD = async () => {
            try {
                setLoading(true);
                const response = await axios.get(makeUrl({ date }));
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
    }, [retry, date]);

    const triggerRetry = () => {
        setRetry(true);
    };

    return { data, loading, error, triggerRetry };
}