import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../services/sso_service.dart';
import 'home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  static const route = '/login';

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _hydrateSession());
  }

  Future<void> _hydrateSession() async {
    final ssoService = context.read<SSOService>();
    await ssoService.hydrate();
    if (ssoService.isAuthenticated && mounted) {
      Navigator.pushReplacementNamed(context, HomeScreen.route);
    }
  }

  @override
  Widget build(BuildContext context) {
    final ssoService = context.watch<SSOService>();
    return Scaffold(
      body: Center(
        child: ssoService.isLoading
            ? const CircularProgressIndicator()
            : ElevatedButton.icon(
                onPressed: () async {
                  try {
                    await ssoService.signIn();
                    if (mounted) {
                      Navigator.pushReplacementNamed(context, HomeScreen.route);
                    }
                  } on SSOException catch (error) {
                    if (!mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(error.message)),
                    );
                  }
                },
                icon: const Icon(Icons.login),
                label: const Text('Entrar com SSO'),
              ),
      ),
    );
  }
}
