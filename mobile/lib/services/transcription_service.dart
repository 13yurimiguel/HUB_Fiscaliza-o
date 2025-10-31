import 'dart:async';
import 'dart:io';

import 'package:flutter_sound/flutter_sound.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;

class AudioNote {
  AudioNote({required this.file, required this.transcription});

  final File file;
  final String transcription;
}

class TranscriptionService {
  TranscriptionService({FlutterSoundRecorder? recorder, stt.SpeechToText? speechToText})
      : _recorder = recorder ?? FlutterSoundRecorder(),
        _speechToText = speechToText ?? stt.SpeechToText();

  final FlutterSoundRecorder _recorder;
  final stt.SpeechToText _speechToText;

  Future<void> init() async {
    await _recorder.openRecorder();
    await _speechToText.initialize();
  }

  Future<AudioNote> recordAndTranscribe({Duration maxDuration = const Duration(minutes: 5)}) async {
    final tmpDir = Directory.systemTemp.createTempSync();
    final filePath = '${tmpDir.path}/audio_note.aac';

    await _recorder.startRecorder(toFile: filePath, codec: Codec.aacADTS);
    await Future.delayed(maxDuration);
    final path = await _recorder.stopRecorder();

    if (path == null) {
      throw const TranscriptionException('Falha ao gravar áudio');
    }

    final available = await _speechToText.initialize();
    if (!available) {
      throw const TranscriptionException('Serviço de transcrição indisponível');
    }

    final recognized = Completer<String>();

    _speechToText.listen(
      onResult: (result) {
        if (result.finalResult && !recognized.isCompleted) {
          recognized.complete(result.recognizedWords);
        }
      },
      listenFor: maxDuration,
      cancelOnError: true,
      localeId: 'pt_BR',
    );

    final transcription = await recognized.future.timeout(
      maxDuration,
      onTimeout: () => '',
    );

    _speechToText.stop();

    return AudioNote(file: File(path), transcription: transcription);
  }

  Future<void> dispose() async {
    await _recorder.closeRecorder();
  }
}

class TranscriptionException implements Exception {
  const TranscriptionException(this.message);

  final String message;

  @override
  String toString() => 'TranscriptionException: $message';
}
