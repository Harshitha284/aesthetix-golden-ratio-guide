{{flutter_js}}
{{flutter_build_config}}

_flutter.loader.load({
  config: {
    canvasKitMaximumSurfaces: 2,
  },
  serviceWorkerSettings: {
    serviceWorkerVersion: {{flutter_service_worker_version}},
  },
});
