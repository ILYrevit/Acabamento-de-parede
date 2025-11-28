import React, { createContext, useContext, useState, useEffect } from 'react';

interface PhotoContextType {
    photos: Map<number, string[]>;
    addPhoto: (itemId: number, photoData: string) => void;
    removePhoto: (itemId: number, photoIndex: number) => void;
    getPhotos: (itemId: number) => string[];
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider = ({ children }: { children: React.ReactNode }) => {
    const [photos, setPhotos] = useState<Map<number, string[]>>(() => {
        const saved = localStorage.getItem('itemPhotos');
        if (saved) {
            const parsed = JSON.parse(saved);
            return new Map(Object.entries(parsed).map(([key, value]) => [parseInt(key), value as string[]]));
        }
        return new Map();
    });

    useEffect(() => {
        const obj = Object.fromEntries(photos);
        localStorage.setItem('itemPhotos', JSON.stringify(obj));
    }, [photos]);

    const addPhoto = (itemId: number, photoData: string) => {
        setPhotos(prev => {
            const newMap = new Map(prev);
            const existing = newMap.get(itemId) || [];
            newMap.set(itemId, [...existing, photoData]);
            return newMap;
        });
    };

    const removePhoto = (itemId: number, photoIndex: number) => {
        setPhotos(prev => {
            const newMap = new Map(prev);
            const existing = newMap.get(itemId) || [];
            const updated = existing.filter((_, index) => index !== photoIndex);
            if (updated.length === 0) {
                newMap.delete(itemId);
            } else {
                newMap.set(itemId, updated);
            }
            return newMap;
        });
    };

    const getPhotos = (itemId: number): string[] => {
        return photos.get(itemId) || [];
    };

    return (
        <PhotoContext.Provider value={{ photos, addPhoto, removePhoto, getPhotos }}>
            {children}
        </PhotoContext.Provider>
    );
};

export const usePhotos = () => {
    const context = useContext(PhotoContext);
    if (context === undefined) {
        throw new Error('usePhotos must be used within a PhotoProvider');
    }
    return context;
};
