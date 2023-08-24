import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FavoritesContextType = {
    favorites: string[];
    addFavorite: (date: string) => void;
    removeFavorite: (date: string) => void;
};

const FavoritesContext = createContext<FavoritesContextType>({
    favorites: [],
    addFavorite: () => {},
    removeFavorite: () => {},
});


export const FavoritesProvider: React.FC<{ children: ReactNode }>  = ({ children }) => {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const favoritesFromStorage = await AsyncStorage.getItem('favorites');
                if (favoritesFromStorage) {
                    setFavorites(JSON.parse(favoritesFromStorage));
                }
            } catch (error) {
                console.error(error);
            }
        };
        loadFavorites();
    }, []);


    useEffect(() => {
        const saveFavorites = async () => {
            try {
                await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            } catch (error) {
                console.error(error);
            }
        };
        saveFavorites();
    }, [favorites]);

    const addFavorite = (date: string) => {
        setFavorites((prevFavorites) => [...prevFavorites, date]);
    };

    const removeFavorite = (date: string) => {
        setFavorites((prevFavorites) => prevFavorites.filter((favorite) => favorite !== date));
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
