# Políticas LGPD para HUB Fiscalização

## Consentimento
- **Base legal:** Consentimento explícito e granular para finalidades de fiscalização digital.
- **Captura:** Formulário eletrônico com registro de IP, timestamp e ID da evidência associada.
- **Armazenamento:** Banco dedicado com criptografia transparente e logs imutáveis.
- **Retenção:** Revisão a cada 24 meses ou mediante revogação imediata via portal do titular.
- **Revogação:** Workflow automatizado que desativa o uso da evidência e notifica controladores e operadores.

## Criptografia e KMS
- **Provedor:** Integração com KMS (AWS KMS, Azure Key Vault ou SERPRO HSM) utilizando aliases versionados.
- **Rotação:** Chaves rotacionadas automaticamente a cada 180 dias, com testes de restauração.
- **Gestão de segredos:** Acesso restrito por função; uso obrigatório de hardware tokens para operações críticas.
- **Backups:** Cópias criptografadas armazenadas em região secundária e verificação de integridade mensal.

## Anonimização para Treino de IA
- **Metodologia:** Pseudonimização com tokenização reversível sob controle do DPO e mascaramento dinâmico para ambientes de teste.
- **Campos sensíveis:** Nome, CPF, RG, e-mail, telefone, endereço, geolocalização precisa.
- **Avaliação de risco:** Monitoramento contínuo com limite máximo de 5% de probabilidade de reidentificação.
- **Governança:** Auditoria trimestral para validar eficácia das técnicas e ajustar thresholds.

As políticas acima possuem representações programáticas no módulo `services/compliance/lgpd.py` e são vinculadas
às trilhas imutáveis e às assinaturas digitais para assegurar integridade e conformidade.
