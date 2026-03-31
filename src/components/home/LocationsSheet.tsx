import { useLanguage } from '@/hooks/useLanguage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useLocations } from '../../hooks/useLocations';
import { LocationCard } from '../search/LocationCard';
import { BottomSheet, Button, CustomModal, ThemedText, ThemedView } from '../ui';

interface LocationsSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (cityName: string) => void;
  activeCity?: string;
}

export function LocationsSheet({ visible, onClose, onSelect, activeCity }: LocationsSheetProps) {
  const { locations, removeLocation } = useLocations();
  const [deleteCandidate, setDeleteCandidate] = useState<any>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();

  const handleLongPress = (loc: any) => {
    setDeleteCandidate(loc);
    setDeleteModalVisible(true);
  };

  const handlePress = (loc: any) => {
    onSelect(loc.name);
    onClose();
  };

  const handleDeleteParams = () => {
     if (deleteCandidate) {
        removeLocation(deleteCandidate.id);
     }
     setDeleteCandidate(null);
     setDeleteModalVisible(false);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t('home.savedLocations')} scrollable>
      <ThemedView maxWidth={true} style={styles.container}>
        {locations.map((loc, index) => {
          const isCurrentlyActive = loc.name.toLowerCase() === activeCity?.toLowerCase();
          
          return (
            <LocationCard 
              key={loc.id} 
              city={loc.name} 
              isActive={isCurrentlyActive} 
              onPress={() => handlePress(loc)}
              onLongPress={() => handleLongPress(loc)}
            />
          );
        })}
        {locations.length === 0 && (
          <ThemedView style={{ gap: 16, paddingBottom: 16 }}>
           <ThemedText colorType="textSecondary" align="center" style={{ marginTop: 20 }}>
             {t('home.noSavedLocations')}
          </ThemedText>
            <Button 
              title={t('search.goToSearch')} 
              onPress={() => {
                router.push('/search')
                onClose()
              }}
            />
          </ThemedView>
        )}
      </ThemedView>

      <CustomModal
        visible={deleteModalVisible}
        title={t('home.deleteLocation')}
        description={t('home.deleteLocationDesc')}
        onClose={() => setDeleteModalVisible(false)}
        actions={[
          { text: t('common.cancel'), variant: 'secondary', onPress: () => setDeleteModalVisible(false) },
          { 
            text: t('common.delete'), 
            variant: 'danger', 
            onPress: handleDeleteParams
          }
        ]}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    gap: 4,
  }
});
