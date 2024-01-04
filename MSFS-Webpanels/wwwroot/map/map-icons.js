define(function() {
    return {
        "aircraft": '<?xml version="1.0" encoding="UTF-8"?>\
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 500 500" preserveAspectRatio="xMinYMin meet">\
            <path d="M250.2,59.002c11.001,0,20.176,9.165,20.176,20.777v122.24l171.12,95.954v42.779l-171.12-49.501v89.227l40.337,29.946v35.446l-60.52-20.18-60.502,20.166v-35.45l40.341-29.946v-89.227l-171.14,49.51v-42.779l171.14-95.954v-122.24c0-11.612,9.15-20.777,20.16-20.777z" stroke="black" stroke-width="5"/>\
            </svg>',
        "ndb": '<?xml version="1.0" encoding="UTF-8"?>\
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin meet">\
            <circle cx="50" cy="50" r="7" stroke="#872958" stroke-width="6" fill="white" fill-opacity="0" />\
            \
            <circle cx="50.0" cy="65.0" r="3" fill="#872958"/>\
            <circle cx="57.5" cy="63.0" r="3" fill="#872958"/>\
            <circle cx="63.0" cy="57.5" r="3" fill="#872958"/>\
            <circle cx="65.0" cy="50.0" r="3" fill="#872958"/>\
            <circle cx="63.0" cy="42.5" r="3" fill="#872958"/>\
            <circle cx="57.5" cy="37.0" r="3" fill="#872958"/>\
            <circle cx="50.0" cy="35.0" r="3" fill="#872958"/>\
            <circle cx="42.5" cy="37.0" r="3" fill="#872958"/>\
            <circle cx="37.0" cy="42.5" r="3" fill="#872958"/>\
            <circle cx="35.0" cy="50.0" r="3" fill="#872958"/>\
            <circle cx="37.0" cy="57.5" r="3" fill="#872958"/>\
            <circle cx="42.5" cy="63.0" r="3" fill="#872958"/>\
            \
            <circle cx="50.00" cy="75.00" r="3" fill="#872958"/>\
            <circle cx="59.03" cy="73.31" r="3" fill="#872958"/>\
            <circle cx="66.84" cy="68.48" r="3" fill="#872958"/>\
            <circle cx="72.38" cy="61.14" r="3" fill="#872958"/>\
            <circle cx="74.89" cy="52.31" r="3" fill="#872958"/>\
            <circle cx="74.05" cy="43.16" r="3" fill="#872958"/>\
            <circle cx="69.95" cy="34.93" r="3" fill="#872958"/>\
            <circle cx="63.16" cy="28.74" r="3" fill="#872958"/>\
            <circle cx="54.59" cy="25.43" r="3" fill="#872958"/>\
            <circle cx="45.41" cy="25.43" r="3" fill="#872958"/>\
            <circle cx="36.84" cy="28.74" r="3" fill="#872958"/>\
            <circle cx="30.05" cy="34.93" r="3" fill="#872958"/>\
            <circle cx="25.95" cy="43.16" r="3" fill="#872958"/>\
            <circle cx="25.11" cy="52.31" r="3" fill="#872958"/>\
            <circle cx="27.62" cy="61.14" r="3" fill="#872958"/>\
            <circle cx="33.16" cy="68.48" r="3" fill="#872958"/>\
            <circle cx="40.97" cy="73.31" r="3" fill="#872958"/>\
            \
            <circle cx="50.00" cy="85.00" r="3" fill="#872958"/>\
            <circle cx="59.44" cy="83.70" r="3" fill="#872958"/>\
            <circle cx="68.19" cy="79.90" r="3" fill="#872958"/>\
            <circle cx="75.58" cy="73.89" r="3" fill="#872958"/>\
            <circle cx="81.08" cy="66.10" r="3" fill="#872958"/>\
            <circle cx="84.27" cy="57.12" r="3" fill="#872958"/>\
            <circle cx="84.92" cy="47.61" r="3" fill="#872958"/>\
            <circle cx="82.98" cy="38.28" r="3" fill="#872958"/>\
            <circle cx="78.59" cy="29.82" r="3" fill="#872958"/>\
            <circle cx="72.09" cy="22.85" r="3" fill="#872958"/>\
            <circle cx="63.94" cy="17.90" r="3" fill="#872958"/>\
            <circle cx="54.77" cy="15.33" r="3" fill="#872958"/>\
            <circle cx="45.23" cy="15.33" r="3" fill="#872958"/>\
            <circle cx="36.06" cy="17.90" r="3" fill="#872958"/>\
            <circle cx="27.91" cy="22.85" r="3" fill="#872958"/>\
            <circle cx="21.41" cy="29.82" r="3" fill="#872958"/>\
            <circle cx="17.02" cy="38.28" r="3" fill="#872958"/>\
            <circle cx="15.08" cy="47.61" r="3" fill="#872958"/>\
            <circle cx="15.73" cy="57.12" r="3" fill="#872958"/>\
            <circle cx="18.92" cy="66.10" r="3" fill="#872958"/>\
            <circle cx="24.42" cy="73.89" r="3" fill="#872958"/>\
            <circle cx="31.81" cy="79.90" r="3" fill="#872958"/>\
            <circle cx="40.56" cy="83.70" r="3" fill="#872958"/>\
            \
            <circle cx="50.00" cy="95.00" r="3" fill="#872958"/>\
            <circle cx="59.67" cy="93.95" r="3" fill="#872958"/>\
            <circle cx="68.90" cy="90.84" r="3" fill="#872958"/>\
            <circle cx="77.23" cy="85.82" r="3" fill="#872958"/>\
            <circle cx="84.30" cy="79.13" r="3" fill="#872958"/>\
            <circle cx="89.76" cy="71.08" r="3" fill="#872958"/>\
            <circle cx="93.36" cy="62.04" r="3" fill="#872958"/>\
            <circle cx="94.93" cy="52.44" r="3" fill="#872958"/>\
            <circle cx="94.41" cy="42.72" r="3" fill="#872958"/>\
            <circle cx="91.80" cy="33.34" r="3" fill="#872958"/>\
            <circle cx="87.25" cy="24.75" r="3" fill="#872958"/>\
            <circle cx="80.95" cy="17.33" r="3" fill="#872958"/>\
            <circle cx="73.20" cy="11.44" r="3" fill="#872958"/>\
            <circle cx="64.37" cy="7.36" r="3" fill="#872958"/>\
            <circle cx="54.87" cy="5.26" r="3" fill="#872958"/>\
            <circle cx="45.13" cy="5.26" r="3" fill="#872958"/>\
            <circle cx="35.63" cy="7.36" r="3" fill="#872958"/>\
            <circle cx="26.80" cy="11.44" r="3" fill="#872958"/>\
            <circle cx="19.05" cy="17.33" r="3" fill="#872958"/>\
            <circle cx="12.75" cy="24.75" r="3" fill="#872958"/>\
            <circle cx="8.20" cy="33.34" r="3" fill="#872958"/>\
            <circle cx="5.59" cy="42.72" r="3" fill="#872958"/>\
            <circle cx="5.07" cy="52.44" r="3" fill="#872958"/>\
            <circle cx="6.64" cy="62.04" r="3" fill="#872958"/>\
            <circle cx="10.24" cy="71.08" r="3" fill="#872958"/>\
            <circle cx="15.70" cy="79.13" r="3" fill="#872958"/>\
            <circle cx="22.77" cy="85.82" r="3" fill="#872958"/>\
            <circle cx="31.10" cy="90.84" r="3" fill="#872958"/>\
            <circle cx="40.33" cy="93.95" r="3" fill="#872958"/>\
            </svg>',
        "vor": '<?xml version="1.0" encoding="UTF-8"?>\
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin meet">\
            <path fill="none" stroke="mediumblue" stroke-width="3" d="M25,1 L75,1 L99,25 L99,75 L75,99 L25,99 L1,75 L 1,25 z" />\
            <circle cx="50" cy="50" r="7" fill="mediumblue"/>\
            </svg>',
        'dme': '<?xml version="1.0" encoding="UTF-8"?>\
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin meet">\
            <rect x="1" y="1" width="98" height="98" fill="none" stroke="mediumblue" stroke-width="3" />\
            </svg>'
    };
});