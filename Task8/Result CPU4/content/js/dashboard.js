/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.84701682814891, "KoPercent": 0.1529831718510964};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.995279408012248, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Anonymous - Open Contacts"], "isController": true}, {"data": [0.75, 500, 1500, "Editor - Login"], "isController": true}, {"data": [0.9987980769230769, 500, 1500, "Anonymous - Open Predefined Date"], "isController": true}, {"data": [0.9986979166666666, 500, 1500, "Anonymous - Search by Name"], "isController": true}, {"data": [0.25, 500, 1500, "Admin- Open Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "Editor - Edit Post"], "isController": true}, {"data": [0.9931640625, 500, 1500, "Anonymous - Open Home page"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - User List"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - Login"], "isController": true}, {"data": [0.9979838709677419, 500, 1500, "Anonymous - Open Random Page"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - LogOut"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open Random Date"], "isController": true}, {"data": [1.0, 500, 1500, "Editor -  Get Post Content"], "isController": false}, {"data": [0.96, 500, 1500, "Editor - Open Page by Predefined Date"], "isController": true}, {"data": [0.9992492492492493, 500, 1500, "Anonymous - Open First Post"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - Delete User"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Add User"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open Large Calendar"], "isController": true}, {"data": [0.9795454545454545, 500, 1500, "Anonymous - Comment"], "isController": false}, {"data": [0.985, 500, 1500, "Editor - Open Random Post"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Open Admin Page"], "isController": false}, {"data": [0.75, 500, 1500, "Editor - Open Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "Anonymous - Open Random Post"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1961, 3, 0.1529831718510964, 33.76848546659869, 3, 1627, 28.0, 39.0, 47.0, 126.03999999999905, 6.129101825603456, 123.47548029627377, 4.31268684618486], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Anonymous - Open Contacts", 64, 0, 0.0, 27.3125, 12, 115, 27.0, 34.0, 47.25, 115.0, 0.5153435489455588, 10.022337425214793, 0.24873881744760004], "isController": true}, {"data": ["Editor - Login", 2, 0, 0.0, 419.5, 111, 728, 419.5, 728.0, 728.0, 728.0, 2.7472527472527473, 85.4022686298077, 6.591796875], "isController": true}, {"data": ["Anonymous - Open Predefined Date", 416, 0, 0.0, 30.9326923076923, 13, 888, 28.0, 37.0, 43.14999999999998, 82.95999999999981, 2.0752787408645332, 54.3832361455813, 1.0160673530218751], "isController": true}, {"data": ["Anonymous - Search by Name", 384, 0, 0.0, 32.520833333333336, 14, 1240, 29.0, 39.0, 44.75, 73.0, 2.032907693285052, 52.866653381959004, 0.9656539020974949], "isController": true}, {"data": ["Admin- Open Login Page", 2, 0, 0.0, 1128.0, 629, 1627, 1128.0, 1627.0, 1627.0, 1627.0, 0.5625879043600562, 2.495934423347398, 0.25382383966244726], "isController": false}, {"data": ["Editor - Edit Post", 100, 0, 0.0, 10.209999999999996, 3, 85, 6.0, 24.0, 38.94999999999999, 84.75999999999988, 0.3245478237445679, 0.05768330461085094, 0.6277718412571685], "isController": true}, {"data": ["Anonymous - Open Home page", 512, 0, 0.0, 50.63867187499999, 15, 3182, 33.5, 45.0, 49.0, 660.0800000000013, 2.498877457392187, 63.86401414373182, 1.2049507331911447], "isController": true}, {"data": ["Admin - User List", 20, 0, 0.0, 23.4, 7, 241, 11.5, 19.900000000000002, 229.94999999999985, 241.0, 0.4357013702808095, 2.9887454591747815, 0.5399463270374486], "isController": false}, {"data": ["Admin - Login", 2, 0, 0.0, 43.5, 41, 46, 43.5, 46.0, 46.0, 46.0, 1.0649627263045793, 39.86954206602769, 2.5500865282215126], "isController": true}, {"data": ["Anonymous - Open Random Page", 496, 0, 0.0, 36.89717741935485, 14, 1182, 31.0, 41.0, 47.14999999999998, 145.83999999999105, 2.4541698622003416, 63.75943004564459, 1.1648638316098068], "isController": false}, {"data": ["Admin - LogOut", 2, 0, 0.0, 47.5, 46, 49, 47.5, 49.0, 49.0, 49.0, 1.0085728693898135, 26.22978914523449, 1.6300665027735752], "isController": true}, {"data": ["Anonymous - Open Random Date", 128, 0, 0.0, 30.4453125, 11, 419, 27.0, 36.0, 42.55, 321.8499999999979, 0.7649143355703094, 18.014692013666867, 0.3737267612451371], "isController": true}, {"data": ["Editor -  Get Post Content", 100, 0, 0.0, 7.710000000000001, 3, 33, 7.0, 12.0, 16.0, 32.87999999999994, 0.3204398998945753, 0.2497835278270009, 0.41619635435525887], "isController": false}, {"data": ["Editor - Open Page by Predefined Date", 100, 0, 0.0, 150.51999999999998, 17, 4038, 38.0, 52.400000000000034, 771.799999999992, 4034.579999999998, 0.3212366325406284, 9.848371666567617, 0.3833507470357889], "isController": true}, {"data": ["Anonymous - Open First Post", 666, 0, 0.0, 31.74324324324326, 13, 836, 30.0, 39.0, 46.0, 76.98000000000025, 3.26007146703216, 76.48499739188165, 1.3681770170468452], "isController": false}, {"data": ["Admin - Delete User", 11, 0, 0.0, 11.81818181818182, 5, 20, 12.0, 19.6, 20.0, 20.0, 0.2703898530062436, 0.048057571530406566, 0.49970752574848826], "isController": true}, {"data": ["Admin - Add User", 9, 0, 0.0, 17.555555555555557, 12, 29, 15.0, 29.0, 29.0, 29.0, 0.2599653379549393, 0.12411539572501445, 0.3904275436886193], "isController": true}, {"data": ["Anonymous - Open Large Calendar", 128, 0, 0.0, 28.0703125, 13, 54, 30.0, 38.10000000000001, 43.099999999999994, 53.41999999999999, 0.7548460526858956, 14.385094868078857, 0.36733322620023473], "isController": true}, {"data": ["Anonymous - Comment", 220, 3, 1.3636363636363635, 41.51818181818183, 8, 1135, 24.0, 46.900000000000006, 100.39999999999986, 747.0899999999995, 1.151338168953643, 2.725683746048817, 2.6299756943354162], "isController": false}, {"data": ["Editor - Open Random Post", 100, 0, 0.0, 150.39, 15, 1151, 137.5, 248.70000000000013, 410.1499999999989, 1145.6999999999973, 0.32098091768444365, 61.023456432858815, 0.37799264552472356], "isController": true}, {"data": ["Admin - Open Admin Page", 20, 0, 0.0, 10.4, 4, 50, 6.0, 37.80000000000005, 49.49999999999999, 50.0, 0.43864458822239283, 0.8831577612676829, 0.5093246244105714], "isController": false}, {"data": ["Editor - Open Login Page", 2, 0, 0.0, 604.5, 10, 1199, 604.5, 1199.0, 1199.0, 1199.0, 1.2128562765312312, 5.3808652971497875, 0.547206640388114], "isController": false}, {"data": ["Anonymous - Open Random Post", 435, 0, 0.0, 29.26896551724138, 13, 181, 30.0, 38.0, 42.0, 58.479999999999905, 2.2262482343548484, 52.20501631142654, 0.9348903156922354], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404\/Not Found", 3, 100.0, 0.1529831718510964], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1961, 3, "404\/Not Found", 3, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Comment", 220, 3, "404\/Not Found", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
