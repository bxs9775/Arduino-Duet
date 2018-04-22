{
  "targets" : [
    {
      "target_name": "CapacitiveSensor",
      "cflags!": [],
      "cflags_cc": [],
      "sources": ["CapacitiveSensor.h","CapacitiveSensor.cpp"],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
    }
  ]
}