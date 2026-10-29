// ignore_for_file: avoid_web_libraries_in_flutter, deprecated_member_use
import 'dart:convert';
import 'dart:html' as html;
import 'dart:typed_data';
import 'dart:ui_web' as ui_web;
import 'package:flutter/material.dart';

Future<void> openLiveWebcamDialog({
  required BuildContext context,
  required Function(Uint8List bytes, String dataUrl) onCaptured,
  required Widget Function(bool top, bool left) buildReticleCorner,
}) async {
  final viewId = 'webcam-view-${DateTime.now().millisecondsSinceEpoch}';
  final videoElement = html.VideoElement()
    ..autoplay = true
    ..setAttribute('playsinline', 'true')
    ..style.width = '100%'
    ..style.height = '100%'
    ..style.objectFit = 'cover'
    ..style.transform = 'scaleX(-1)';

  html.MediaStream? mediaStream;
  bool isCameraReady = false;
  String? cameraError;

  ui_web.platformViewRegistry.registerViewFactory(viewId, (int id) => videoElement);

  showDialog(
    context: context,
    barrierDismissible: false,
    builder: (BuildContext dialogContext) {
      return StatefulBuilder(
        builder: (context, setDialogState) {
          if (mediaStream == null && cameraError == null && !isCameraReady) {
            html.window.navigator.mediaDevices
                ?.getUserMedia({
                  'video': {
                    'facingMode': 'user',
                    'width': {'ideal': 1280},
                    'height': {'ideal': 720},
                  },
                  'audio': false,
                })
                .then((stream) {
                  mediaStream = stream;
                  videoElement.srcObject = stream;
                  setDialogState(() {
                    isCameraReady = true;
                  });
                })
                .catchError((err) {
                  setDialogState(() {
                    cameraError = 'Could not access webcam: $err';
                  });
                });
          }

          return Dialog(
            backgroundColor: const Color(0xFF101625),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
              side: const BorderSide(color: Color(0xFF1E2D48), width: 1.5),
            ),
            child: Container(
              width: 440,
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.videocam, color: Color(0xFF00FF87), size: 20),
                          SizedBox(width: 8),
                          Text(
                            'PORTRAIT CAPTURE',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1.1,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.grey),
                        onPressed: () {
                          mediaStream?.getTracks().forEach((track) => track.stop());
                          Navigator.of(dialogContext).pop();
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  Container(
                    width: 380,
                    height: 380,
                    decoration: BoxDecoration(
                      color: Colors.black,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: const Color(0xFF00FF87).withValues(alpha: 0.5),
                        width: 2,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF00FF87).withValues(alpha: 0.15),
                          blurRadius: 20,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(18),
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          if (cameraError != null)
                            Padding(
                              padding: const EdgeInsets.all(20),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(Icons.error_outline, color: Colors.redAccent, size: 40),
                                  const SizedBox(height: 12),
                                  Text(
                                    cameraError!,
                                    textAlign: TextAlign.center,
                                    style: const TextStyle(color: Colors.white70, fontSize: 13),
                                  ),
                                ],
                              ),
                            )
                          else if (!isCameraReady)
                            const Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                CircularProgressIndicator(color: Color(0xFF00FF87)),
                                SizedBox(height: 14),
                                Text(
                                  'Activating camera sensor...',
                                  style: TextStyle(color: Colors.grey, fontSize: 13),
                                ),
                              ],
                            )
                          else
                            HtmlElementView(viewType: viewId),

                          Positioned(top: 14, left: 14, child: buildReticleCorner(true, true)),
                          Positioned(top: 14, right: 14, child: buildReticleCorner(true, false)),
                          Positioned(bottom: 14, left: 14, child: buildReticleCorner(false, true)),
                          Positioned(bottom: 14, right: 14, child: buildReticleCorner(false, false)),

                          Positioned(
                            bottom: 14,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.black.withValues(alpha: 0.75),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.face, color: Color(0xFF00FF87), size: 14),
                                  SizedBox(width: 6),
                                  Text(
                                    'KEEP HEAD STRAIGHT & LEVEL',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {
                            mediaStream?.getTracks().forEach((track) => track.stop());
                            Navigator.of(dialogContext).pop();
                          },
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Color(0xFF2C3E60)),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                          child: const Text('CANCEL', style: TextStyle(color: Colors.grey)),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        flex: 2,
                        child: ElevatedButton(
                          onPressed: !isCameraReady
                              ? null
                              : () {
                                  final width = videoElement.videoWidth > 0 ? videoElement.videoWidth : 640;
                                  final height = videoElement.videoHeight > 0 ? videoElement.videoHeight : 480;

                                  final canvas = html.CanvasElement(width: width, height: height);
                                  final ctx = canvas.context2D;

                                  ctx.translate(width, 0);
                                  ctx.scale(-1, 1);
                                  ctx.drawImage(videoElement, 0, 0);

                                  final dataUrl = canvas.toDataUrl('image/jpeg', 0.92);
                                  final base64String = dataUrl.split(',').last;
                                  final bytes = base64Decode(base64String);

                                  mediaStream?.getTracks().forEach((track) => track.stop());
                                  Navigator.of(dialogContext).pop();

                                  onCaptured(bytes, dataUrl);
                                },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF00FF87),
                            foregroundColor: Colors.black,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            elevation: 6,
                          ),
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.camera_alt, color: Colors.black, size: 20),
                              SizedBox(width: 8),
                              Text(
                                'CAPTURE PORTRAIT',
                                style: TextStyle(
                                  fontWeight: FontWeight.w900,
                                  fontSize: 13,
                                  letterSpacing: 1.1,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      );
    },
  );
}
