import 'dart:io';

import 'package:document_scanner_flutter/document_scanner_flutter.dart';
import 'package:exif/exif.dart';
import 'package:flutter/foundation.dart';
import 'package:image_picker/image_picker.dart';
import 'package:uuid/uuid.dart';

class MediaCaptureService {
  MediaCaptureService({ImagePicker? picker, DocumentScannerFlutterPlatform? scanner})
      : _picker = picker ?? ImagePicker(),
        _scanner = scanner ?? DocumentScannerFlutterPlatform.instance;

  final ImagePicker _picker;
  final DocumentScannerFlutterPlatform _scanner;
  final Uuid _uuid = const Uuid();

  Future<MediaCaptureResult> capturePhotoWithExif() async {
    final pickedImage = await _picker.pickImage(source: ImageSource.camera);
    if (pickedImage == null) {
      throw const MediaCaptureException('Captura de foto cancelada.');
    }

    final bytes = await pickedImage.readAsBytes();
    final data = await readExifFromBytes(bytes);
    final timestamp = data["Image DateTime"]?.printable ?? DateTime.now().toIso8601String();

    return MediaCaptureResult(
      id: _uuid.v4(),
      file: File(pickedImage.path),
      metadata: {
        'timestamp': timestamp,
        'device': data['Image Model']?.printable,
        'gps': data['GPS GPSLatitude']?.printable,
      },
    );
  }

  Future<File> scanDocument() async {
    final result = await _scanner.pickDocument();
    final path = result?.path;
    if (path == null) {
      throw const MediaCaptureException('Digitalização cancelada.');
    }
    return File(path);
  }
}

class MediaCaptureResult {
  MediaCaptureResult({
    required this.id,
    required this.file,
    required this.metadata,
  });

  final String id;
  final File file;
  final Map<String, dynamic> metadata;
}

class MediaCaptureException implements Exception {
  const MediaCaptureException(this.message);

  final String message;

  @override
  String toString() => 'MediaCaptureException: $message';
}
