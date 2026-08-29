window.__FLEET_DATA__ = {
  "_meta": {
    "source": "PLACEHOLDER / DEMO DATA \u2014 not live. Generated to preview the panel with real TU codes from TU_LIST.xlsx.",
    "generated": "2026-08-25",
    "replace_with": "Live query result from PostgreSQL fleet_status view/table \u2014 see README.md 'Connecting to PostgreSQL' section.",
    "schema": {
      "tu": "string \u2014 train unit code, primary key",
      "status": "one of: healthy | review | maintenance | out_of_service | failure",
      "alert_code": "optional \u2014 short alarm label, present when status is review, maintenance, or failure",
      "alert_message": "optional \u2014 full instruction text, present when status is review, maintenance, or failure"
    }
  },
  "units": [
    {
      "tu": "AM103",
      "status": "healthy"
    },
    {
      "tu": "AM116",
      "status": "review",
      "alert_code": "Door sensor intermittent",
      "alert_message": "Door 3R sensor flapping \u2014 monitor, schedule inspection"
    },
    {
      "tu": "AM129",
      "status": "maintenance",
      "alert_code": "Scheduled inspection due",
      "alert_message": "Consumables check due within 500km — not a fault, plan a depot visit"
    },
    {
      "tu": "AM131",
      "status": "healthy"
    },
    {
      "tu": "AM144",
      "status": "maintenance",
      "alert_code": "Software update pending",
      "alert_message": "New firmware staged, awaiting a maintenance window to install"
    },
    {
      "tu": "AM157",
      "status": "healthy"
    },
    {
      "tu": "AM172",
      "status": "healthy"
    },
    {
      "tu": "AM185",
      "status": "healthy"
    },
    {
      "tu": "AM198",
      "status": "healthy"
    },
    {
      "tu": "AM212",
      "status": "healthy"
    },
    {
      "tu": "AM225",
      "status": "review",
      "alert_code": "Air compressor cycling high",
      "alert_message": "Compressor duty cycle above baseline \u2014 monitor"
    },
    {
      "tu": "AM238",
      "status": "healthy"
    },
    {
      "tu": "AM240",
      "status": "healthy"
    },
    {
      "tu": "AM253",
      "status": "healthy"
    },
    {
      "tu": "AM266",
      "status": "healthy"
    },
    {
      "tu": "AM279",
      "status": "review",
      "alert_code": "Software update pending",
      "alert_message": "Firmware update available \u2014 schedule during next depot visit"
    },
    {
      "tu": "AM281",
      "status": "healthy"
    },
    {
      "tu": "AM294",
      "status": "healthy"
    },
    {
      "tu": "AM306",
      "status": "healthy"
    },
    {
      "tu": "AM319",
      "status": "review",
      "alert_code": "Pantograph wear warning",
      "alert_message": "Pantograph carbon strip wear \u2014 schedule inspection"
    },
    {
      "tu": "AM321",
      "status": "healthy"
    },
    {
      "tu": "AM334",
      "status": "healthy"
    },
    {
      "tu": "AM347",
      "status": "healthy"
    },
    {
      "tu": "AM362",
      "status": "healthy"
    },
    {
      "tu": "AM375",
      "status": "healthy"
    },
    {
      "tu": "AM388",
      "status": "healthy"
    },
    {
      "tu": "AM390",
      "status": "review",
      "alert_code": "HVAC fault code",
      "alert_message": "HVAC unit 1 fault code E12 \u2014 schedule inspection"
    },
    {
      "tu": "AM402",
      "status": "healthy"
    },
    {
      "tu": "AM415",
      "status": "healthy"
    },
    {
      "tu": "AM428",
      "status": "healthy"
    },
    {
      "tu": "AM430",
      "status": "healthy"
    },
    {
      "tu": "AM443",
      "status": "healthy"
    },
    {
      "tu": "AM456",
      "status": "healthy"
    },
    {
      "tu": "AM469",
      "status": "review",
      "alert_code": "Brake wear \u2013 inspect",
      "alert_message": "Brake pad wear threshold reached \u2014 schedule inspection"
    },
    {
      "tu": "AM471",
      "status": "healthy"
    },
    {
      "tu": "AM484",
      "status": "healthy"
    },
    {
      "tu": "AM497",
      "status": "healthy"
    },
    {
      "tu": "AM509",
      "status": "healthy"
    },
    {
      "tu": "AM511",
      "status": "healthy"
    },
    {
      "tu": "AM524",
      "status": "healthy"
    },
    {
      "tu": "AM537",
      "status": "healthy"
    },
    {
      "tu": "AM552",
      "status": "healthy"
    },
    {
      "tu": "AM565",
      "status": "healthy"
    },
    {
      "tu": "AM578",
      "status": "healthy"
    },
    {
      "tu": "AM580",
      "status": "healthy"
    },
    {
      "tu": "AM593",
      "status": "healthy"
    },
    {
      "tu": "AM605",
      "status": "healthy"
    },
    {
      "tu": "AM618",
      "status": "healthy"
    },
    {
      "tu": "AM620",
      "status": "healthy"
    },
    {
      "tu": "AM633",
      "status": "review",
      "alert_code": "Battery voltage low",
      "alert_message": "Aux battery below nominal \u2014 schedule inspection"
    },
    {
      "tu": "AM646",
      "status": "healthy"
    },
    {
      "tu": "AM659",
      "status": "review",
      "alert_code": "HVAC fault code",
      "alert_message": "HVAC unit 1 fault code E12 \u2014 schedule inspection"
    },
    {
      "tu": "AM661",
      "status": "review",
      "alert_code": "Wheel flat detected",
      "alert_message": "Wheel flat detected axle 3 \u2014 schedule inspection"
    },
    {
      "tu": "AM674",
      "status": "healthy"
    },
    {
      "tu": "AM687",
      "status": "healthy"
    },
    {
      "tu": "AM701",
      "status": "healthy"
    },
    {
      "tu": "AM714",
      "status": "healthy"
    },
    {
      "tu": "AM810",
      "status": "healthy"
    },
    {
      "tu": "AM823",
      "status": "healthy"
    },
    {
      "tu": "AM836",
      "status": "failure",
      "alert_code": "Brake system failure",
      "alert_message": "Emergency brake applied \u2014 remove from service"
    },
    {
      "tu": "AM849",
      "status": "review",
      "alert_code": "Coupler sensor warning",
      "alert_message": "Coupler position sensor drift \u2014 schedule inspection"
    },
    {
      "tu": "AM851",
      "status": "failure",
      "alert_code": "Door failure \u2013 stuck open",
      "alert_message": "Door 2L stuck open \u2014 remove from service"
    },
    {
      "tu": "AM864",
      "status": "failure",
      "alert_code": "Signal comms loss",
      "alert_message": "ATP comms timeout \u2014 remove from service"
    },
    {
      "tu": "AM877",
      "status": "healthy"
    },
    {
      "tu": "AM892",
      "status": "healthy"
    },
    {
      "tu": "AM904",
      "status": "healthy"
    },
    {
      "tu": "AM917",
      "status": "healthy"
    },
    {
      "tu": "AM932",
      "status": "review",
      "alert_code": "Battery voltage low",
      "alert_message": "Aux battery below nominal \u2014 schedule inspection"
    },
    {
      "tu": "AM945",
      "status": "healthy"
    },
    {
      "tu": "AM958",
      "status": "healthy"
    },
    {
      "tu": "AM960",
      "status": "failure",
      "alert_code": "Traction motor fault",
      "alert_message": "Traction motor overcurrent \u2014 isolate car, contact CAF hot line"
    },
    {
      "tu": "AM973",
      "status": "healthy"
    },
    {
      "tu": "AM1005",
      "status": "healthy"
    },
    {
      "tu": "AM1018",
      "status": "review",
      "alert_code": "Brake wear \u2013 inspect",
      "alert_message": "Brake pad wear threshold reached \u2014 schedule inspection"
    },
    {
      "tu": "AM1020",
      "status": "healthy"
    },
    {
      "tu": "AM1033",
      "status": "healthy"
    },
    {
      "tu": "AM1046",
      "status": "healthy"
    },
    {
      "tu": "AM1059",
      "status": "healthy"
    },
    {
      "tu": "AM1061",
      "status": "healthy"
    },
    {
      "tu": "AM1074",
      "status": "healthy"
    },
    {
      "tu": "AM1087",
      "status": "healthy"
    },
    {
      "tu": "AM1101",
      "status": "healthy"
    },
    {
      "tu": "AM1114",
      "status": "healthy"
    },
    {
      "tu": "AM1127",
      "status": "healthy"
    },
    {
      "tu": "AM1142",
      "status": "healthy"
    },
    {
      "tu": "AM1155",
      "status": "healthy"
    },
    {
      "tu": "AM1168",
      "status": "healthy"
    },
    {
      "tu": "AM1170",
      "status": "healthy"
    },
    {
      "tu": "AM1183",
      "status": "review",
      "alert_code": "Door sensor intermittent",
      "alert_message": "Door 3R sensor flapping \u2014 monitor, schedule inspection"
    },
    {
      "tu": "AM1196",
      "status": "healthy"
    },
    {
      "tu": "AM1208",
      "status": "healthy"
    },
    {
      "tu": "AM1210",
      "status": "healthy"
    },
    {
      "tu": "AM1223",
      "status": "healthy"
    },
    {
      "tu": "AM1236",
      "status": "healthy"
    },
    {
      "tu": "AM1249",
      "status": "healthy"
    }
  ]
};
