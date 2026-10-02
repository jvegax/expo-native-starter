import { useTranslation } from 'react-i18next';

import { useInviteMemberMutation } from '@/features/club/mutations/member/invite-member.mutation';
import type { Id } from '@/shared/types/common.types';
import { Button } from '@/shared/ui/button/button';

export type InviteMemberButtonProps = {
  clubId: Id;
  /** Resolves the invitee (form, contact picker...). Return null to cancel. */
  pickEmail: () => Promise<string | null>;
};

export function InviteMemberButton({ clubId, pickEmail }: InviteMemberButtonProps) {
  const { t } = useTranslation('club');
  const invite = useInviteMemberMutation();

  const handlePress = async () => {
    const email = await pickEmail();
    if (email) invite.mutate({ clubId, email });
  };

  return <Button variant="secondary" label={t('member.invite')} loading={invite.isPending} onPress={handlePress} />;
}
