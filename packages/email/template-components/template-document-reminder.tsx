import { RECIPIENT_ROLES_DESCRIPTION } from '@documenso/lib/constants/recipient-roles';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { RecipientRole } from '@prisma/client';

import { Body, Button, Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentReminderProps {
  recipientName: string;
  documentName: string;
  signDocumentLink: string;
  assetBaseUrl: string;
  role: RecipientRole;
}

export const TemplateDocumentReminder = ({
  recipientName,
  documentName,
  signDocumentLink,
  assetBaseUrl,
  role,
}: TemplateDocumentReminderProps) => {
  const { _ } = useLingui();

  const { actionVerb } = RECIPIENT_ROLES_DESCRIPTION[role];

  return (
    <>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section>
        <Text className="mx-auto mb-0 max-w-[80%] text-center font-semibold text-foreground text-lg">
          <Trans>
            Reminder: Please {_(actionVerb).toLowerCase()} your document
            <br />"{documentName}"
          </Trans>
        </Text>

        <Text className="my-1 text-center text-base text-muted-foreground">
          <Trans>Hi {recipientName},</Trans>
        </Text>

        <Text className="my-1 text-center text-base text-muted-foreground">
          <Trans>Continue by signing the document.</Trans>
        </Text>

        <Section className="mt-8 mb-6 text-center">
          <Button href={signDocumentLink} className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-center font-medium text-primary-foreground text-sm no-underline">
            <Trans>Sign document</Trans>
          </Button>
        </Section>
      </Section>
    </>
  );
};
