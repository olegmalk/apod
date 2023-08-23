import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import axios from 'axios';
import DatePicker from '@react-native-community/datetimepicker';
import ApodCard from '../components/APodCard';

const API_KEY = 'msyz6brJcv0J6QLnTn0MiVYM37pNcLM4H2jM0ZJy';

type Apod = {
    date: string;
    title: string;
    explanation: string;
    url: string;
    hdurl: string;
}

export default function Search() {
    const [apods, setApods] = useState<Apod[]>([]);
    const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const [endDate, setEndDate] = useState<Date>(new Date());

    useEffect(() => {
        fetchApods();
    }, [startDate, endDate]);

    const fetchApods = async () => {
        const startDateParam = `&start_date=${startDate.toISOString().split('T')[0]}`;
        const endDateParam = `&end_date=${endDate.toISOString().split('T')[0]}`;
        const { data } = await axios.get<Apod[]>(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}${startDateParam}${endDateParam}`);
        console.log('asdasd', data);
        setApods(data);
    };


    return (
        <View>
            <DatePicker value={startDate} mode="date" display="default" onChange={(event, selectedDate) => setStartDate(selectedDate || startDate)} />
            <DatePicker value={endDate} mode="date" display="default" onChange={(event, selectedDate) => setEndDate(selectedDate || endDate)} />
            <FlatList
                data={apods}
                keyExtractor={(item) => item.date}
                renderItem={({ item }) => <ApodCard date={item.date} title={item.title} explanation={item.explanation} url={item.url} hdurl={item.hdurl} isFavorite={false} />}
            />
        </View>
    );
}