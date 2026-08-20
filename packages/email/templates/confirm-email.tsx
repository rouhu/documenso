import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

import { Body, Container, Head, Html, Preview, Section } from '../components';
import { TemplateBrandingLogo } from '../template-components/template-branding-logo';
import { TemplateFooter } from '../template-components/template-footer';
import type { TemplateConfirmationEmailProps } from '../template-components/template-confirmation-email';
import { TemplateConfirmationEmail } from '../template-components/template-confirmation-email';

export type ConfirmEmailTemplateProps = Partial<TemplateConfirmationEmailProps>;

export const ConfirmEmailTemplate = ({
  confirmationLink = 'https://procusign.com/confirm',
  assetBaseUrl = 'http://localhost:3002',
}: ConfirmEmailTemplateProps) => {
  const { _ } = useLingui();

  const previewText = msg`Confirm your email address`;

  return (
    <Html>
      <Head />

      <Body className="mx-auto my-auto bg-background font-sans">
        <Preview>{_(previewText)}</Preview>

        <Section>
          <Container className="mx-auto mt-8 mb-2 max-w-xl rounded-lg border border-border border-solid px-2 pt-2 backdrop-blur-sm">
            <TemplateBrandingLogo assetBaseUrl={assetBaseUrl} className="mb-4 h-6 p-2" />

            <Section>
              <TemplateConfirmationEmail confirmationLink={confirmationLink} assetBaseUrl={assetBaseUrl} />
            </Section>
          </Container>
        </Section>
      </Body>
    </Html>
  );
};
