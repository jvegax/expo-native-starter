import { useLocalSearchParams } from 'expo-router';

import { ItemDetailScreen } from '@/screens/home/item/item-detail-screen';

export default function ItemDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ItemDetailScreen id={id} />;
}
