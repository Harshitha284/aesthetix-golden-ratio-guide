// ignore_for_file: avoid_web_libraries_in_flutter, deprecated_member_use, uri_does_not_exist
import 'dart:async';
import 'dart:convert';
import 'dart:html' as html;
import 'dart:js_util' as js_util;
import 'dart:typed_data';

Future<Map<String, dynamic>> detectFaceLandmarksFromBytes(Uint8List bytes) async {
  try {
    if (!js_util.hasProperty(html.window, 'detectFaceLandmarksFromBytes')) {
      return {'success': false, 'error': 'detectFaceLandmarksFromBytes JS function not available'};
    }

    final promise = js_util.callMethod(html.window, 'detectFaceLandmarksFromBytes', [bytes]);
    final rawResult = await js_util.promiseToFuture(promise);

    if (rawResult == null) {
      return {'success': false, 'error': 'Null result from face detector'};
    }

    final String jsonStr = rawResult is String
        ? rawResult
        : js_util.callMethod(html.window, 'JSON.stringify', [rawResult]).toString();

    return jsonDecode(jsonStr) as Map<String, dynamic>;
  } catch (e) {
    return {'success': false, 'error': e.toString()};
  }
}

Future<Map<String, dynamic>> detectFaceLandmarks(dynamic imageInput) async {
  if (imageInput is Uint8List) {
    return detectFaceLandmarksFromBytes(imageInput);
  }
  return {'success': false, 'error': 'Unsupported input type'};
}
