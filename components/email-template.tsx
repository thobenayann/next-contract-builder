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
}

export const EmailTemplate = ({ magicLink }: EmailTemplateProps) => (
    <Html>
        <Head />
        <Preview>Connectez-vous à votre compte</Preview>
        <Body
            style={{
                backgroundColor: '#f6f9fc',
                fontFamily:
                    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
            }}
        >
            <Container
                style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #f0f0f0',
                    borderRadius: '5px',
                    boxShadow: '0 5px 10px rgba(20,50,70,.2)',
                    marginTop: '20px',
                    maxWidth: '600px',
                    padding: '48px',
                }}
            >
                <Section>
                    <Text
                        style={{
                            fontSize: '16px',
                            lineHeight: '26px',
                            marginBottom: '24px',
                        }}
                    >
                        Bonjour,
                    </Text>
                    <Text
                        style={{
                            fontSize: '16px',
                            lineHeight: '26px',
                            marginBottom: '24px',
                        }}
                    >
                        Cliquez sur le bouton ci-dessous pour vous connecter à
                        votre compte :
                    </Text>
                    <Button
                        href={magicLink}
                        style={{
                            backgroundColor: '#5046e4',
                            borderRadius: '5px',
                            color: '#fff',
                            display: 'inline-block',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            padding: '12px 24px',
                            textDecoration: 'none',
                        }}
                    >
                        Se connecter
                    </Button>
                    <Text
                        style={{
                            color: '#666666',
                            fontSize: '14px',
                            lineHeight: '24px',
                            marginTop: '24px',
                        }}
                    >
                        Si vous n&apos;avez pas demandé cette connexion, vous
                        pouvez ignorer cet email.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);
