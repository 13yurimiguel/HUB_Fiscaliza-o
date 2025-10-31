# HUB Fiscalização Mobile

Aplicativo móvel multiplataforma para fiscalização de obras com suporte a operação offline, captura de mídia com metadados e sincronização delta com a API corporativa.

## Principais recursos

- Login SSO via OpenID Connect e armazenamento seguro de tokens no Keychain/Keystore.
- Seleção de obra e atividade com cache local e sincronização com a API `/sync`.
- Captura de fotos com metadados EXIF, assinatura digital e scanner de documentos.
- Checklist diário conforme modelo ISO customizável por obra.
- Anotações de áudio com transcrição automática e anexação aos relatórios diários.
- Cache offline com SQLite/Hive e reconciliação delta resiliente a conflitos.
- Testes unitários e de integração cobrindo fluxos críticos.

## Estrutura

```
mobile/
 ├── lib/
 │   ├── app.dart
 │   ├── main.dart
 │   ├── models/
 │   ├── repositories/
 │   ├── screens/
 │   ├── services/
 │   └── widgets/
 ├── test/
 └── integration_test/
```

## Scripts úteis

Como o Flutter não está disponível neste ambiente, os comandos abaixo devem ser executados localmente:

```bash
flutter pub get
flutter test
flutter drive --driver=test_driver/integration_test.dart --target=integration_test/app_test.dart
```

## API `/sync`

A sincronização utiliza uma API REST com endpoint `/sync` que suporta solicitações delta. Consulte a documentação do back-end para detalhes de payload.
