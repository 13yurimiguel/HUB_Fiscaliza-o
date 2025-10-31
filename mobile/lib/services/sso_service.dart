import 'package:flutter/foundation.dart';
import 'package:flutter_appauth/flutter_appauth.dart';

import 'secure_storage_service.dart';

class SSOService extends ChangeNotifier {
  SSOService({FlutterAppAuth? authClient, SecureStorageService? storage})
      : _authClient = authClient ?? const FlutterAppAuth(),
        _storage = storage ?? SecureStorageService();

  final FlutterAppAuth _authClient;
  final SecureStorageService _storage;

  String? _accessToken;
  bool _isLoading = false;

  String? get accessToken => _accessToken;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _accessToken != null;

  static const _clientId = 'hub-fiscalizacao-mobile';
  static const _issuer = 'https://sso.example.com';
  static const _redirectUrl = 'hub.fiscalizacao://callback';
  static const _scopes = ['openid', 'profile', 'email', 'offline_access'];

  Future<void> signIn() async {
    _setLoading(true);
    try {
      final result = await _authClient.authorizeAndExchangeCode(
        AuthorizationTokenRequest(
          _clientId,
          _redirectUrl,
          issuer: _issuer,
          scopes: _scopes,
          promptValues: ['login'],
        ),
      );

      if (result.accessToken == null || result.refreshToken == null) {
        throw const SSOException('Resposta inválida do provedor SSO');
      }

      _accessToken = result.accessToken;
      await _storage.persistTokens(
        accessToken: result.accessToken!,
        refreshToken: result.refreshToken!,
      );
      notifyListeners();
    } on SSOException {
      rethrow;
    } catch (error, stackTrace) {
      debugPrint('Erro SSO: $error\n$stackTrace');
      throw const SSOException('Falha ao autenticar.');
    } finally {
      _setLoading(false);
    }
  }

  Future<void> signOut() async {
    _accessToken = null;
    await _storage.clear();
    notifyListeners();
  }

  Future<void> hydrate() async {
    _accessToken = await _storage.readAccessToken();
    notifyListeners();
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }
}

class SSOException implements Exception {
  const SSOException(this.message);

  final String message;

  @override
  String toString() => 'SSOException: $message';
}
