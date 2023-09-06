import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Button, Platform } from 'react-native';
import axios from 'axios';
import DatePicker from '@react-native-community/datetimepicker';
import ApodCard from '../components/card';
import { Apod } from '../types/apod';
import { makeUrl } from '../utils/makeUrl';
import { END_DATE, START_DATE } from '../constants/date';
import { useFavorites } from '../context/favorites';

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
    const [startDate, setStartDate] = useState<Date>(START_DATE);
    const [endDate, setEndDate] = useState<Date>(END_DATE);
    const [loading, setLoading] = useState<boolean>(false);
    const [showStartDatePicker, setShowStartDatePicker] = useState(Platform.OS === 'ios');
    const [showEndDatePicker, setShowEndDatePicker] = useState(Platform.OS === 'ios');
    const {removeFavorite, addFavorite, hasFavorite} = useFavorites();

    useEffect(() => {
        fetchApods();
    }, [startDate, endDate]);

    const fetchApods = async () => {
        setLoading(true);
        const url = makeUrl({
            start_date: startDate.toISOString().split('T')[0],
            end_date : endDate.toISOString().split('T')[0]
        });
        const { data } = await axios.get<Apod[]>(url);

        setApods(data);
        setLoading(false);
    };

    const renderShimmer = () => {
        return <Shimmer />;
    };

    return (
        <View style={styles.container}>
            <View style={styles.calendarContainer}>
                {Platform.OS === 'android' && <Button title={startDate.toISOString().split('T')[0]} onPress={() => setShowStartDatePicker(true)} />}
                {(showStartDatePicker || Platform.OS === 'ios') && (
                    <DatePicker
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            if (Platform.OS === 'android') {
                                setShowStartDatePicker(false);
                            }
                            setStartDate(selectedDate || startDate);
                        }}
                    />
                )}
                
                {Platform.OS === 'android' && <Button title={endDate.toISOString().split('T')[0]} onPress={() => setShowEndDatePicker(true)} />}
                {(showEndDatePicker || Platform.OS === 'ios') && (
                    <DatePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            if (Platform.OS === 'android') {
                                setShowEndDatePicker(false);
                            }
                            setEndDate(selectedDate || endDate);
                        }}
                    />
                )}
            </View>
            {loading ? (
                renderShimmer()
            ) : (
                <FlatList
                    data={apods}
                    keyExtractor={(item) => item.date}
                    renderItem={({item}) => (
                        <ApodCard
                            apod={item}
                            isFavorite={hasFavorite(item.date)}
                            onHeartPress={() => {
                                if (hasFavorite(item.date)) {
                                    removeFavorite(item.date);
                                } else {
                                    addFavorite(item);
                                }
                            }}
                        />
                    )}
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

