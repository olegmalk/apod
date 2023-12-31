import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Search from "./screens/Search";
import Explore from "./screens/Explore";
import Favorites from "./screens/Favorites";
import { FavoritesProvider } from "./context/favorites";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Search" component={Search} />
          <Tab.Screen name="Explore" component={Explore} />
          <Tab.Screen name="Favorites" component={Favorites} />
        </Tab.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}
