import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import DatePicker from '@react-native-community/datetimepicker';
import ApodCard, { ApodCardProps } from '../components/APodCard';

const API_KEY = 'msyz6brJcv0J6QLnTn0MiVYM37pNcLM4H2jM0ZJy';

type Apod = {
    date: string;
    title: string;
    explanation: string;
    url: string;
    hdurl: string;
}

const Shimmer = () => {
    return (
        <View style={styles.shimmerContainer}>
            <View style={styles.shimmer} />
            <View style={styles.shimmer} />
            <View style={styles.shimmer} />
            <View style={styles.shimmer} />
            <View style={styles.shimmer} />
        </View>
    );
};

export default function Search() {
    const [apods, setApods] = useState<Apod[]>([]);
    const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchApods();
    }, [startDate, endDate]);

    const fetchApods = async () => {
        setLoading(true);
        const startDateParam = `&start_date=${startDate.toISOString().split('T')[0]}`;
        const endDateParam = `&end_date=${endDate.toISOString().split('T')[0]}`;
        const { data } = await axios.get<Apod[]>(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}${startDateParam}${endDateParam}`);
        console.log('asdasd', data);
        setApods(data);
        setLoading(false);
    };

    const renderShimmer = () => {
        return (
            <Shimmer />
        );
    };

    const renderApodCard = ({ item }: { item: Apod }) => {
        return (
            <ApodCard
                date={item.date}
                title={item.title}
                explanation={item.explanation}
                url={item.url}
                hdurl={item.hdurl}
                isFavorite={false}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.calendarContainer}>
                <DatePicker value={startDate} mode="date" display="default" onChange={(event, selectedDate) => setStartDate(selectedDate || startDate)} />
                <DatePicker value={endDate} mode="date" display="default" onChange={(event, selectedDate) => setEndDate(selectedDate || endDate)} />
            </View>
            {loading ? (
                renderShimmer()
            ) : (
                <FlatList
                    data={apods}
                    keyExtractor={(item) => item.date}
                    renderItem={renderApodCard}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    calendarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    shimmerContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
    },
    shimmer: {
        marginBottom: 10,
        height: 200,
        borderRadius: 10,
        backgroundColor: '#e1e1e1',
    },
});
