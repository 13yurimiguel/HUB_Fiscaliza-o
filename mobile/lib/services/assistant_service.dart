import 'dart:convert';

import 'package:http/http.dart' as http;

class AssistantService {
  AssistantService({http.Client? client, String? baseUrl})
      : _client = client ?? http.Client(),
        _baseUrl = baseUrl ?? const String.fromEnvironment('ASSISTANT_BASE_URL', defaultValue: 'http://localhost:8001');

  final http.Client _client;
  final String _baseUrl;

  Future<String> sendMessage({
    required String conversationId,
    required String query,
    required Map<String, dynamic> context,
  }) async {
    final response = await _client.post(
      Uri.parse('$_baseUrl/chat'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'conversation_id': conversationId,
        'query': query,
        'context': context,
      }),
    );

    if (response.statusCode >= 400) {
      throw Exception('Falha ao consultar o assistente: ${response.body}');
    }

    final Map<String, dynamic> data = jsonDecode(response.body) as Map<String, dynamic>;
    return data['response'] as String? ?? '';
  }

  Future<String> requestSuggestion({
    required String conversationId,
    required String section,
    required String summary,
    required Map<String, dynamic> context,
  }) async {
    final response = await _client.post(
      Uri.parse('$_baseUrl/suggestion'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'conversation_id': conversationId,
        'report_section': section,
        'summary': summary,
        'context': context,
      }),
    );

    if (response.statusCode >= 400) {
      throw Exception('Falha ao gerar sugestão: ${response.body}');
    }

    final Map<String, dynamic> data = jsonDecode(response.body) as Map<String, dynamic>;
    return data['suggestion'] as String? ?? '';
  }
}
