import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';

import '../models/activity.dart';
import '../models/checklist.dart';
import '../models/worksite.dart';
import '../services/assistant_service.dart';
import '../services/checklist_service.dart';
import '../widgets/checklist_item_widget.dart';

class ChecklistScreen extends StatefulWidget {
  const ChecklistScreen({super.key, required this.worksite, this.activity});

  static const route = '/checklist';

  final Worksite worksite;
  final Activity? activity;

  @override
  State<ChecklistScreen> createState() => _ChecklistScreenState();
}

class _ChecklistScreenState extends State<ChecklistScreen> {
  Checklist? _checklist;
  final Map<String, ChecklistItem> _responses = {};
  final AssistantService _assistantService = AssistantService();
  final TextEditingController _chatController = TextEditingController();
  final TextEditingController _reportController = TextEditingController();
  final List<_AssistantMessage> _messages = [];
  bool _sendingMessage = false;
  bool _generatingSuggestion = false;
  String _reportDraft = '';
  late final String _conversationId;

  @override
  void initState() {
    super.initState();
    _conversationId = const Uuid().v4();
    _loadChecklist();
  }

  @override
  void dispose() {
    _chatController.dispose();
    _reportController.dispose();
    super.dispose();
  }

  Future<void> _loadChecklist() async {
    final checklistService = context.read<ChecklistService>();
    final checklists = await checklistService.loadChecklistsFromAssets();
    setState(() {
      _checklist = checklists.firstWhere((element) => element.standard.contains('ISO'));
    });
  }

  void _toggleItem(ChecklistItem item, bool value) {
    setState(() {
      _responses[item.id] = item.toggle(value: value);
    });
  }

  void _updateNotes(ChecklistItem item, String notes) {
    setState(() {
      _responses[item.id] = item.toggle(value: item.completed, updatedNotes: notes);
    });
  }

  Map<String, dynamic> _buildAssistantContext(Checklist checklist) {
    final completedCount = checklist.items.where((item) => item.completed).length;
    final nonConformities = checklist.items
        .where((item) => !item.completed)
        .map((item) {
          final notes = item.notes;
          if (notes == null || notes.isEmpty) {
            return item.description;
          }
          return '${item.description} - Observações: $notes';
        })
        .toList();

    return {
      'worksite': {
        'name': widget.worksite.name,
        'location': widget.worksite.location,
        'status': widget.activity?.name ?? 'Checklist em andamento',
      },
      'checklists': [
        {
          'title': checklist.title,
          'status': '$completedCount/${checklist.items.length} itens concluídos',
          'non_conformities': nonConformities,
        }
      ],
      'photos': <Map<String, dynamic>>[],
    };
  }

  Future<void> _sendAssistantMessage(Checklist checklist) async {
    final query = _chatController.text.trim();
    if (query.isEmpty) return;

    setState(() {
      _messages.add(_AssistantMessage(role: 'user', content: query));
      _sendingMessage = true;
    });

    try {
      final response = await _assistantService.sendMessage(
        conversationId: _conversationId,
        query: query,
        context: _buildAssistantContext(checklist),
      );
      setState(() {
        _messages.add(_AssistantMessage(role: 'assistant', content: response));
      });
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao consultar assistente: ${error.toString()}')),
      );
    } finally {
      setState(() {
        _sendingMessage = false;
      });
      _chatController.clear();
    }
  }

  Future<void> _generateReportSuggestion(Checklist checklist) async {
    setState(() {
      _generatingSuggestion = true;
    });

    final baseSummary = _reportDraft.isNotEmpty
        ? _reportDraft
        : 'Elaborar resumo formal destacando pontos críticos do checklist.';

    try {
      final suggestion = await _assistantService.requestSuggestion(
        conversationId: _conversationId,
        section: 'Resumo do relatório',
        summary: baseSummary,
        context: _buildAssistantContext(checklist),
      );
      setState(() {
        _reportDraft = suggestion;
        _reportController.text = suggestion;
        _messages.add(_AssistantMessage(role: 'assistant', content: suggestion));
      });
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao gerar sugestão: ${error.toString()}')),
      );
    } finally {
      setState(() {
        _generatingSuggestion = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final checklist = _checklist;
    if (checklist == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final merged = context.read<ChecklistService>().mergeWithResponses(checklist, _responses);
    return Scaffold(
      appBar: AppBar(
        title: Text('Checklist ${checklist.standard}'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(widget.worksite.name, style: Theme.of(context).textTheme.titleLarge),
          if (widget.activity != null) Text(widget.activity!.name),
          const SizedBox(height: 16),
          ...merged.items.map(
            (item) => ChecklistItemWidget(
              item: item,
              onChanged: (value) => _toggleItem(item, value),
              onNotesChanged: (notes) => _updateNotes(item, notes),
            ),
          ),
          const SizedBox(height: 24),
          Card(
            elevation: 2,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Assistente ISO 9001', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 220,
                    child: _messages.isEmpty
                        ? const Center(
                            child: Text(
                              'Converse com o assistente para registrar dúvidas ou pontos de atenção da fiscalização.',
                              textAlign: TextAlign.center,
                            ),
                          )
                        : ListView.builder(
                            itemCount: _messages.length,
                            itemBuilder: (context, index) {
                              final message = _messages[index];
                              final alignment =
                                  message.role == 'assistant' ? Alignment.centerLeft : Alignment.centerRight;
                              final backgroundColor = message.role == 'assistant'
                                  ? Theme.of(context).colorScheme.surfaceVariant
                                  : Theme.of(context).colorScheme.primaryContainer;
                              return Align(
                                alignment: alignment,
                                child: Container(
                                  margin: const EdgeInsets.only(bottom: 8),
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: backgroundColor,
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    message.content,
                                    style: Theme.of(context).textTheme.bodyMedium,
                                  ),
                                ),
                              );
                            },
                          ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _chatController,
                    minLines: 2,
                    maxLines: 4,
                    decoration: const InputDecoration(
                      labelText: 'Pergunte ao assistente',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: FilledButton(
                          onPressed: _sendingMessage ? null : () => _sendAssistantMessage(merged),
                          child: Text(_sendingMessage ? 'Enviando...' : 'Enviar'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _reportController,
                    onChanged: (value) => setState(() {
                      _reportDraft = value;
                    }),
                    minLines: 3,
                    maxLines: 6,
                    decoration: const InputDecoration(
                      labelText: 'Sugestão para relatório',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 8),
                  FilledButton.tonalIcon(
                    onPressed: _generatingSuggestion ? null : () => _generateReportSuggestion(merged),
                    icon: _generatingSuggestion
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Icon(Icons.auto_fix_high),
                    label: Text(_generatingSuggestion ? 'Consultando...' : 'Inserir sugestão do assistente'),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          FilledButton.icon(
            icon: const Icon(Icons.check_circle),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Checklist salvo localmente.')),
              );
            },
            label: const Text('Salvar'),
          ),
        ],
      ),
    );
  }
}

class _AssistantMessage {
  _AssistantMessage({required this.role, required this.content});

  final String role;
  final String content;
}
