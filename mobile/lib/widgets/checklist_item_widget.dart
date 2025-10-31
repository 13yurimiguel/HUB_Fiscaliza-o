import 'package:flutter/material.dart';

import '../models/checklist.dart';

class ChecklistItemWidget extends StatelessWidget {
  const ChecklistItemWidget({
    super.key,
    required this.item,
    required this.onChanged,
    required this.onNotesChanged,
  });

  final ChecklistItem item;
  final ValueChanged<bool> onChanged;
  final ValueChanged<String> onNotesChanged;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(child: Text(item.description)),
                Switch(
                  value: item.completed,
                  onChanged: onChanged,
                ),
              ],
            ),
            TextField(
              decoration: const InputDecoration(labelText: 'Observações'),
              controller: TextEditingController(text: item.notes)
                ..selection = TextSelection.collapsed(offset: item.notes?.length ?? 0),
              onChanged: onNotesChanged,
              maxLines: 2,
            ),
          ],
        ),
      ),
    );
  }
}
