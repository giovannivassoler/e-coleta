
import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

const PasswordResetEmail = (resetCode: string) => {
  
  
  return (
    <Html>
      <Tailwind>
        <Head>
          <title>Recuperação de Senha - e-coleta</title>
        </Head>
        <Preview>Seu código de recuperação de senha da plataforma e-coleta</Preview>
        <Body className="bg-[#f5f5f5] py-[40px] font-sans">
          <Container className="mx-auto bg-white rounded-[12px] p-[32px] max-w-[600px]">
            <Section>
              <Heading className="text-[24px] font-bold text-[#1E8449] text-center mb-[24px]">
                e-coleta
              </Heading>
              <Text className="text-[16px] text-[#333] mb-[24px]">
                Olá,
              </Text>
              <Text className="text-[16px] text-[#333] mb-[24px]">
                Recebemos uma solicitação para redefinir a senha da sua conta na plataforma e-coleta. Use o código abaixo na página de recuperação de senha:
              </Text>
              <Section className="text-center mb-[32px]">
                <div className="bg-[#f0f9f0] border-[2px] border-solid border-[#1E8449] rounded-[8px] py-[16px] px-[24px] inline-block">
                  <Text className="text-[24px] font-bold text-[#1E8449] tracking-[2px] m-0">
                    {resetCode}
                  </Text>
                </div>
              </Section>
              <Text className="text-[16px] text-[#333] mb-[16px]">
                Volte para a página onde solicitou a recuperação de senha e insira este código para criar uma nova senha.
              </Text>
              <Text className="text-[16px] text-[#333] mb-[16px]">
                Se você não solicitou a redefinição de senha, ignore este email ou entre em contato com nosso suporte.
              </Text>
              <Text className="text-[16px] text-[#333] mb-[16px]">
                Este código expira em 30 minutos.
              </Text>
              <Text className="text-[16px] text-[#333] mb-[32px]">
                Atenciosamente,<br />
                Equipe e-coleta
              </Text>
              <Section className="border-t border-solid border-[#eaeaea] pt-[24px] mt-[24px]">
                <Text className="text-[14px] text-[#666] mb-[8px] m-0">
                  © {new Date().getFullYear()} e-coleta. Todos os direitos reservados.
                </Text>
                <Text className="text-[14px] text-[#666] m-0">
                  Av. das Coletas, 123 - São Paulo, SP
                </Text>
                <Text className="text-[14px] text-[#666] mt-[16px]">
                  <a href="https://e-coleta.com/unsubscribe" className="text-[#1E8449] underline">
                    Cancelar inscrição
                  </a>
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordResetEmail;
