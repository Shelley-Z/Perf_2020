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

    var data = {"OkPercent": 96.29005059021922, "KoPercent": 3.709949409780776};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.47389720760825577, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4765625, 500, 1500, "Anonymous - Open Contacts"], "isController": true}, {"data": [1.0, 500, 1500, "Editor - Login"], "isController": true}, {"data": [0.2980769230769231, 500, 1500, "Anonymous - Open Predefined Date"], "isController": true}, {"data": [0.2890625, 500, 1500, "Anonymous - Search by Name"], "isController": true}, {"data": [1.0, 500, 1500, "Admin- Open Login Page"], "isController": false}, {"data": [0.95, 500, 1500, "Editor - Edit Post"], "isController": true}, {"data": [0.330078125, 500, 1500, "Anonymous - Open Home page"], "isController": true}, {"data": [0.95, 500, 1500, "Admin - User List"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - Login"], "isController": true}, {"data": [0.9726027397260274, 500, 1500, "Anonymous - Open Random Page"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - LogOut"], "isController": true}, {"data": [0.95, 500, 1500, "Editor -  Get Post Content"], "isController": false}, {"data": [0.328125, 500, 1500, "Anonymous - Open Random Date"], "isController": true}, {"data": [0.9533678756476683, 500, 1500, "Anonymous - Open First Post"], "isController": false}, {"data": [0.2, 500, 1500, "Editor - Open Page by Predefined Date"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Delete User"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Add User"], "isController": true}, {"data": [0.3125, 500, 1500, "Anonymous - Open Large Calendar"], "isController": true}, {"data": [0.9296875, 500, 1500, "Anonymous - Comment"], "isController": false}, {"data": [0.2, 500, 1500, "Editor - Open Random Post"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Open Admin Page"], "isController": false}, {"data": [1.0, 500, 1500, "Editor - Open Login Page"], "isController": false}, {"data": [0.9682539682539683, 500, 1500, "Anonymous - Open Random Post"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 593, 22, 3.709949409780776, 399.8566610455312, 2, 10010, 19.0, 34.60000000000002, 232.39999999999964, 10002.0, 6.89422652126398, 130.69592958704396, 4.624769477933825], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Anonymous - Open Contacts", 64, 33, 51.5625, 5179.578125000001, 6, 10008, 10001.5, 10006.0, 10007.0, 10008.0, 0.184850891761138, 1.9792776102967722, 0.04249517113148964], "isController": true}, {"data": ["Editor - Login", 2, 0, 0.0, 152.5, 45, 260, 152.5, 260.0, 260.0, 260.0, 1.229256299938537, 38.333829517516904, 2.9482944068838353], "isController": true}, {"data": ["Anonymous - Open Predefined Date", 416, 292, 70.1923076923077, 5573.149038461535, 6, 10017, 10002.0, 10005.0, 10007.0, 10009.66, 0.9773884931300867, 9.043227469403746, 0.20822827924412157], "isController": true}, {"data": ["Anonymous - Search by Name", 384, 273, 71.09375, 6163.174479166665, 6, 10015, 10002.0, 10006.0, 10007.0, 10010.0, 0.9195292201961184, 8.36526610822428, 0.16444685318662372], "isController": true}, {"data": ["Admin- Open Login Page", 2, 0, 0.0, 164.0, 5, 323, 164.0, 323.0, 323.0, 323.0, 0.963855421686747, 4.276167168674698, 0.43486445783132527], "isController": false}, {"data": ["Editor - Edit Post", 20, 1, 5.0, 530.45, 3, 10011, 5.5, 287.2000000000003, 9525.499999999993, 10011.0, 0.26411705667952035, 0.07766176344355818, 0.48486371972558234], "isController": true}, {"data": ["Anonymous - Open Home page", 512, 343, 66.9921875, 5198.962890625004, 7, 10012, 10002.0, 10005.0, 10007.0, 10009.87, 1.1924280816813235, 11.673690061274968, 0.26973190455451634], "isController": true}, {"data": ["Admin - User List", 20, 0, 0.0, 106.10000000000001, 4, 1032, 10.5, 709.3000000000013, 1019.0499999999998, 1032.0, 0.4436163605713779, 2.757937786964333, 0.549755040590897], "isController": false}, {"data": ["Admin - Login", 2, 0, 0.0, 54.0, 51, 57, 54.0, 57.0, 57.0, 57.0, 1.1799410029498525, 44.174041297935105, 2.8277101769911503], "isController": true}, {"data": ["Anonymous - Open Random Page", 146, 4, 2.73972602739726, 296.513698630137, 7, 10001, 20.0, 32.30000000000001, 107.70000000000044, 10000.53, 2.034304504730455, 51.3018547353314, 0.9033431042650726], "isController": false}, {"data": ["Admin - LogOut", 2, 0, 0.0, 35.0, 34, 36, 35.0, 36.0, 36.0, 36.0, 0.5157297576070139, 13.413002836513666, 0.8335280750386798], "isController": true}, {"data": ["Editor -  Get Post Content", 20, 1, 5.0, 508.6, 2, 10000, 5.0, 77.30000000000017, 9504.249999999993, 10000.0, 0.2982314872804271, 0.25879736288807376, 0.3679838712683785], "isController": false}, {"data": ["Anonymous - Open Random Date", 128, 86, 67.1875, 6418.898437499999, 6, 10013, 10003.0, 10007.0, 10008.0, 10012.42, 0.3161532058676059, 2.933508199143175, 0.05359591853621065], "isController": true}, {"data": ["Anonymous - Open First Post", 193, 9, 4.66321243523316, 485.4766839378238, 6, 10002, 20.0, 29.0, 3089.5999999998317, 10002.0, 2.6983949443543427, 60.619075415245234, 1.0300028224791677], "isController": false}, {"data": ["Editor - Open Page by Predefined Date", 100, 80, 80.0, 2955.21, 9, 10009, 115.0, 10004.9, 10005.95, 10008.99, 0.20503735780659235, 1.4544897638943566, 0.17372510974624578], "isController": true}, {"data": ["Admin - Delete User", 11, 0, 0.0, 29.27272727272727, 3, 239, 10.0, 194.00000000000017, 239.0, 239.0, 0.28606350609835385, 0.0508433184666996, 0.5285978174654773], "isController": true}, {"data": ["Admin - Add User", 9, 0, 0.0, 10.666666666666666, 5, 14, 12.0, 14.0, 14.0, 14.0, 0.21410219811590067, 0.10224216296745646, 0.3215714655295461], "isController": true}, {"data": ["Anonymous - Open Large Calendar", 128, 88, 68.75, 6497.328124999998, 8, 10013, 10003.0, 10006.0, 10008.0, 10012.13, 0.3172879809825516, 2.4193595864349473, 0.05278611536640565], "isController": true}, {"data": ["Anonymous - Comment", 64, 4, 6.25, 683.421875, 6, 10010, 20.0, 235.5, 10001.75, 10010.0, 0.8220092989801947, 1.9489733111883172, 1.7454025878843535], "isController": false}, {"data": ["Editor - Open Random Post", 100, 80, 80.0, 2960.189999999999, 7, 10009, 116.5, 10004.9, 10006.0, 10008.99, 0.20489661941067636, 2.1719341799064034, 0.17132478854668878], "isController": true}, {"data": ["Admin - Open Admin Page", 20, 0, 0.0, 7.1499999999999995, 2, 33, 4.0, 25.500000000000032, 32.699999999999996, 33.0, 0.4410726887791108, 0.8880464477108327, 0.5121439716390261], "isController": false}, {"data": ["Editor - Open Login Page", 2, 0, 0.0, 163.5, 4, 323, 163.5, 323.0, 323.0, 323.0, 0.9905894006934125, 4.394773093115403, 0.4469260772659732], "isController": false}, {"data": ["Anonymous - Open Random Post", 126, 4, 3.1746031746031744, 343.6190476190476, 6, 10002, 21.0, 45.99999999999997, 215.99999999999966, 10001.73, 1.8958486932185792, 43.22274646973413, 0.7359079714042822], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 22, 100.0, 3.709949409780776], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 593, 22, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 22, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Open Random Page", 146, 4, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Editor -  Get Post Content", 20, 1, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Open First Post", 193, 9, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Comment", 64, 4, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Open Random Post", 126, 4, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 4, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
