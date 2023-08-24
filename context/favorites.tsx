import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Apod } from "../types/apod";

type FavoritesContextType = {
  favorites: Apod[];
  addFavorite: (fav: Apod) => void;
  removeFavorite: (date: string) => void;
  hasFavorite: (date: string) => boolean;
};

const STORAGE_KEY = '@favorites-v4'

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  hasFavorite: (date: string) => false,
});

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Apod[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favoritesFromStorage = await AsyncStorage.getItem(STORAGE_KEY);
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
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error(error);
      }
    };
    saveFavorites();
  }, [favorites]);

  const addFavorite = (fav: Apod) => {
    if (!hasFavorite(fav.date)) {
      setFavorites((prevFavorites) => [...prevFavorites, fav]);
    }
  };

  const removeFavorite = (date: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((favorite) => favorite.date !== date),
    );
  };

  const hasFavorite = (date: string) => {
    return !!favorites.find((favorite) => favorite.date === date);
    };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, hasFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);

