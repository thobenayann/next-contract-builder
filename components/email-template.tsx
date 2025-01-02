import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface EmailTemplateProps {
    magicLink: string;
    type?: 'reset-password' | 'verify-email' | 'organization-invitation';
    user?: {
        name: string;
        email: string;
    };
    organization?: {
        name: string;
    };
}

export const EmailTemplate = ({
    magicLink,
    type = 'verify-email',
    user,
    organization,
}: EmailTemplateProps) => {
    let previewText, title, description, buttonText;

    switch (type) {
        case 'reset-password':
            previewText = 'Réinitialisez votre mot de passe';
            title = `Bonjour ${user?.name},`;
            description =
                'Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour procéder au changement.';
            buttonText = 'Réinitialiser le mot de passe';
            break;
        case 'organization-invitation':
            previewText = 'Invitation à rejoindre une organisation';
            title = `Bonjour,`;
            description = `${user?.name} vous invite à rejoindre l'organisation "${organization?.name}" sur Feather. Cliquez sur le bouton ci-dessous pour accepter l'invitation.`;
            buttonText = "Accepter l'invitation";
            break;
        default:
            previewText = 'Vérifiez votre adresse email';
            title = 'Bienvenue !';
            description =
                'Cliquez sur le bouton ci-dessous pour vérifier votre adresse email.';
            buttonText = 'Vérifier mon email';
    }

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container>
                    <Section>
                        <Text style={heading}>{title}</Text>
                        <Text style={paragraph}>{description}</Text>
                        <Button style={button} href={magicLink}>
                            {buttonText}
                        </Button>
                        <Text style={paragraph}>
                            {type === 'reset-password'
                                ? "Si vous n'avez pas demandé à réinitialiser votre mot de passe, vous pouvez ignorer cet email."
                                : type === 'organization-invitation'
                                ? "Si vous n'avez pas demandé à rejoindre cette organisation, vous pouvez ignorer cet email."
                                : "Si vous n'avez pas demandé cette vérification, vous pouvez ignorer cet email."}
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

const main = {
    backgroundColor: '#ffffff',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const heading = {
    fontSize: '32px',
    lineHeight: '1.3',
    fontWeight: '700',
    color: '#484848',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '1.4',
    color: '#484848',
};

const button = {
    backgroundColor: '#5046e4',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px 16px',
    marginTop: '24px',
    marginBottom: '24px',
};
