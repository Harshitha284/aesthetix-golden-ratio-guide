import 'dart:typed_data';
import 'package:flutter/material.dart';

Future<void> openLiveWebcamDialog({
  required BuildContext context,
  required Function(Uint8List bytes, String dataUrl) onCaptured,
  required Widget Function(bool top, bool left) buildReticleCorner,
}) async {
  // Non-web platforms fall back to image picker natively
}
