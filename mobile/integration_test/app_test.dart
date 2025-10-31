import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

import 'package:hub_fiscalizacao_mobile/app.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('fluxo de login apresenta botão de SSO', (tester) async {
    await tester.pumpWidget(const HubFiscalizacaoApp());

    expect(find.text('Entrar com SSO'), findsOneWidget);
    expect(find.byIcon(Icons.login), findsOneWidget);
  });
}
