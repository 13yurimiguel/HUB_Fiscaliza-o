import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../services/sso_service.dart';
import '../services/sync_service.dart';
import 'media_capture_screen.dart';
import 'work_selection_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  static const route = '/home';

  @override
  Widget build(BuildContext context) {
    final syncService = context.watch<SyncService>();
    final ssoService = context.read<SSOService>();
    return Scaffold(
      appBar: AppBar(
        title: const Text('HUB Fiscalização'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await ssoService.signOut();
              if (context.mounted) {
                Navigator.pushReplacementNamed(context, '/login');
              }
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Última sincronização: ${syncService.lastSync ?? 'Nunca'}'),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              icon: const Icon(Icons.sync),
              onPressed: syncService.syncInProgress
                  ? null
                  : () async {
                      try {
                        await syncService.performSync(since: syncService.lastSync);
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Sincronização concluída.')),
                          );
                        }
                      } on SyncException catch (error) {
                        if (!context.mounted) return;
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(error.message)),
                        );
                      }
                    },
              label: const Text('Sincronizar'),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              icon: const Icon(Icons.work),
              onPressed: () => Navigator.pushNamed(context, WorkSelectionScreen.route),
              label: const Text('Selecionar obra / atividade'),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              icon: const Icon(Icons.photo_camera),
              onPressed: () => Navigator.pushNamed(context, MediaCaptureScreen.route),
              label: const Text('Capturar evidências'),
            ),
          ],
        ),
      ),
    );
  }
}
