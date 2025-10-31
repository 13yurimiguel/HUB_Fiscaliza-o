import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'models/activity.dart';
import 'models/worksite.dart';
import 'screens/checklist_screen.dart';
import 'screens/home_screen.dart';
import 'screens/login_screen.dart';
import 'screens/media_capture_screen.dart';
import 'screens/work_selection_screen.dart';
import 'services/cache_service.dart';
import 'services/checklist_service.dart';
import 'services/media_capture_service.dart';
import 'services/secure_storage_service.dart';
import 'services/sso_service.dart';
import 'services/sync_service.dart';

class HubFiscalizacaoApp extends StatelessWidget {
  const HubFiscalizacaoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider(create: (_) => SecureStorageService()),
        ChangeNotifierProvider(create: (_) => SSOService()),
        Provider(create: (_) => CacheService()),
        ChangeNotifierProvider(create: (_) => SyncService()),
        Provider(create: (_) => ChecklistService()),
        Provider(create: (_) => MediaCaptureService()),
      ],
      child: MaterialApp(
        title: 'HUB Fiscalização',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.blueAccent),
          useMaterial3: true,
        ),
        initialRoute: LoginScreen.route,
        routes: {
          LoginScreen.route: (_) => const LoginScreen(),
          HomeScreen.route: (_) => const HomeScreen(),
          WorkSelectionScreen.route: (_) => const WorkSelectionScreen(),
          MediaCaptureScreen.route: (_) => const MediaCaptureScreen(),
          ChecklistScreen.route: (context) {
            final args = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
            return ChecklistScreen(
              worksite: args['worksite'] as Worksite,
              activity: args['activity'] as Activity?,
            );
          },
        },
      ),
    );
  }
}
