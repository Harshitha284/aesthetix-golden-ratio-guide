import 'dart:typed_data';

Future<Map<String, dynamic>> detectFaceLandmarksFromBytes(Uint8List bytes) async {
  return {'success': false, 'error': 'Platform not supported'};
}

Future<Map<String, dynamic>> detectFaceLandmarks(dynamic imageInput) async {
  return {'success': false, 'error': 'Platform not supported'};
}
