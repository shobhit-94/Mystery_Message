import {
  Html, Head, Font, Preview, Heading, Row, Section, Text, Button
} from '@react-email/components';


interface VerificationEmailProps {
    username: string;
    otp: string
}
export default function VerificationEmail({ username, otp }
    : VerificationEmailProps) {
    return (
        <Html lang='en' dir='ltr'>
            <Head>
                <title>Verification Code</title>
                {/* <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="verdana"
                    //   webFont={{ 

                    //    }}
                    fontWeight={400}
                    fontStyle="normal"
                /> */}

            </Head>
           <Preview>here@apos;s your verification code:{otp}</Preview>
        
           <Section>
            <Row>
                <Heading as="h2">hello {username},</Heading>
            </Row>

            <Row>
                <Text>
                    Thankyou for registering,please use the following verification
                    code to complete your registration
                </Text>
            </Row>
            <Row>
                <Text>{otp}</Text>
            </Row>
           </Section>
        </Html>
    )
}
