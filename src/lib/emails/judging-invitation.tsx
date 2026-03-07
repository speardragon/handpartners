import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
} from "@react-email/components";

interface JudgingInvitationEmailProps {
  judgeName: string;
  programName: string;
  judgingRoundName: string;
  judgingUrl: string;
}

export function JudgingInvitationEmail({
  judgeName,
  programName,
  judgingRoundName,
  judgingUrl,
}: JudgingInvitationEmailProps) {
  return (
    <Html lang="ko">
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Text style={eyebrow}>심사 안내</Text>
          <Text style={heading}>
            {judgeName} 심사위원님, 안녕하세요.
          </Text>
          <Text style={paragraph}>
            <strong>{programName}</strong>의{" "}
            <strong>{judgingRoundName}</strong> 심사에 참여해 주셔서
            감사합니다.
          </Text>
          <Text style={paragraph}>
            아래 버튼을 클릭하시면 심사 페이지로 이동합니다.
          </Text>

          <Section style={buttonSection}>
            <Link href={judgingUrl} style={button}>
              심사 시작하기
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            본 메일은 발신 전용입니다. 문의 사항은 프로그램 담당자에게
            연락해 주시기 바랍니다.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  margin: 0,
  padding: "32px 0",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  maxWidth: "560px",
  margin: "0 auto",
  padding: "40px 48px",
};

const eyebrow: React.CSSProperties = {
  color: "#71717a",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.1em",
  margin: "0 0 16px",
  textTransform: "uppercase",
};

const heading: React.CSSProperties = {
  color: "#09090b",
  fontSize: "20px",
  fontWeight: 700,
  margin: "0 0 16px",
};

const paragraph: React.CSSProperties = {
  color: "#3f3f46",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0 0 12px",
};

const buttonSection: React.CSSProperties = {
  margin: "28px 0",
  textAlign: "center",
};

const button: React.CSSProperties = {
  backgroundColor: "#18181b",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: 600,
  padding: "12px 28px",
  textDecoration: "none",
};

const hr: React.CSSProperties = {
  borderColor: "#e4e4e7",
  margin: "24px 0",
};

const footer: React.CSSProperties = {
  color: "#a1a1aa",
  fontSize: "12px",
  lineHeight: "1.6",
  margin: 0,
};
