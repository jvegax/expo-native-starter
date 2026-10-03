import { useLocalSearchParams } from 'expo-router';

import { ClubDetailScreen } from '@/screens/club/club/club-detail-screen';

export default function ClubDetailRoute() {
  const { clubId } = useLocalSearchParams<{ clubId: string }>();
  return <ClubDetailScreen clubId={clubId} />;
}
