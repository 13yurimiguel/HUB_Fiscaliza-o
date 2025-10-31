import 'dart:io';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../services/media_capture_service.dart';
import '../services/transcription_service.dart';

class MediaCaptureScreen extends StatefulWidget {
  const MediaCaptureScreen({super.key});

  static const route = '/media-capture';

  @override
  State<MediaCaptureScreen> createState() => _MediaCaptureScreenState();
}

class _MediaCaptureScreenState extends State<MediaCaptureScreen> {
  MediaCaptureResult? _lastCapture;
  File? _scannedDocument;
  AudioNote? _audioNote;
  bool _loading = false;

  Future<void> _execute(Future<void> Function() action) async {
    setState(() => _loading = true);
    try {
      await action();
    } on Exception catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error.toString())),
      );
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final mediaService = context.read<MediaCaptureService>();
    final transcriptionService = TranscriptionService();

    return Scaffold(
      appBar: AppBar(title: const Text('Captura de evidências')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ElevatedButton.icon(
            onPressed: _loading
                ? null
                : () => _execute(() async {
                      final result = await mediaService.capturePhotoWithExif();
                      setState(() => _lastCapture = result);
                    }),
            icon: const Icon(Icons.photo_camera),
            label: const Text('Capturar foto com EXIF'),
          ),
          const SizedBox(height: 12),
          ElevatedButton.icon(
            onPressed: _loading
                ? null
                : () => _execute(() async {
                      final file = await mediaService.scanDocument();
                      setState(() => _scannedDocument = file);
                    }),
            icon: const Icon(Icons.scanner),
            label: const Text('Escanear documento'),
          ),
          const SizedBox(height: 12),
          ElevatedButton.icon(
            onPressed: _loading
                ? null
                : () => _execute(() async {
                      await transcriptionService.init();
                      final note = await transcriptionService.recordAndTranscribe();
                      setState(() => _audioNote = note);
                    }),
            icon: const Icon(Icons.mic),
            label: const Text('Gravar nota de áudio'),
          ),
          const SizedBox(height: 24),
          if (_lastCapture != null) ...[
            Text('Última foto: ${_lastCapture!.file.path}'),
            Text('Metadados: ${_lastCapture!.metadata}'),
          ],
          if (_scannedDocument != null) Text('Documento escaneado: ${_scannedDocument!.path}'),
          if (_audioNote != null) Text('Transcrição: ${_audioNote!.transcription}'),
          if (_loading) const Center(child: Padding(padding: EdgeInsets.only(top: 16), child: CircularProgressIndicator())),
        ],
      ),
    );
  }
}
