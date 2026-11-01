import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'foodie-data-v1';
const Ctx = createContext(null);
export const useFood = () => useContext(Ctx);

export function FoodProvider({ children }) {
  const [favorites, setFavorites] = useState([]);   // {id, name, image, category}
  const [myRecipes, setMyRecipes] = useState([]);   // full recipe objects
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const data = JSON.parse(raw);
          setFavorites(data.favorites || []);
          setMyRecipes(data.myRecipes || []);
        }
      } catch (e) {}
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(KEY, JSON.stringify({ favorites, myRecipes })).catch(() => {});
  }, [favorites, myRecipes, ready]);

  const isFavorite = (id) => favorites.some((f) => f.id === id);

  const toggleFavorite = (recipe) => {
    setFavorites((list) =>
      list.some((f) => f.id === recipe.id)
        ? list.filter((f) => f.id !== recipe.id)
        : [...list, { id: recipe.id, name: recipe.name, image: recipe.image, category: recipe.category, mine: !!recipe.mine }]
    );
  };

  const addRecipe = (data) => {
    const recipe = { ...data, id: `my-${Date.now()}`, category: 'My Food', mine: true };
    setMyRecipes((list) => [recipe, ...list]);
    return recipe;
  };

  const updateRecipe = (id, data) => {
    setMyRecipes((list) => list.map((r) => (r.id === id ? { ...r, ...data } : r)));
    setFavorites((list) => list.map((f) => (f.id === id ? { ...f, name: data.name, image: data.image } : f)));
  };

  const deleteRecipe = (id) => {
    setMyRecipes((list) => list.filter((r) => r.id !== id));
    setFavorites((list) => list.filter((f) => f.id !== id));
  };

  return (
    <Ctx.Provider value={{ favorites, myRecipes, isFavorite, toggleFavorite, addRecipe, updateRecipe, deleteRecipe }}>
      {children}
    </Ctx.Provider>
  );
}
