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

    var data = {"OkPercent": 24.187347081440056, "KoPercent": 75.81265291855995};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.05290130262566867, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.030346820809248554, 500, 1500, "Anonymous - Open Contacts"], "isController": true}, {"data": [0.058823529411764705, 500, 1500, "Editor - Login"], "isController": true}, {"data": [0.028950542822677925, 500, 1500, "Anonymous - Open Predefined Date"], "isController": true}, {"data": [0.02775766352884383, 500, 1500, "Anonymous - Search by Name"], "isController": true}, {"data": [0.06363636363636363, 500, 1500, "Admin- Open Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "Editor - Edit Post"], "isController": true}, {"data": [0.028786707882534776, 500, 1500, "Anonymous - Open Home page"], "isController": true}, {"data": [0.06377079482439926, 500, 1500, "Admin - User List"], "isController": false}, {"data": [0.07272727272727272, 500, 1500, "Admin - Login"], "isController": true}, {"data": [0.986013986013986, 500, 1500, "Anonymous - Open Random Page"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "Admin - LogOut"], "isController": true}, {"data": [1.0, 500, 1500, "Editor -  Get Post Content"], "isController": false}, {"data": [0.02888086642599278, 500, 1500, "Anonymous - Open Random Date"], "isController": true}, {"data": [0.020808561236623068, 500, 1500, "Editor - Open Page by Predefined Date"], "isController": true}, {"data": [0.9792746113989638, 500, 1500, "Anonymous - Open First Post"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - Delete User"], "isController": true}, {"data": [0.034318398474737846, 500, 1500, "Admin - Add User"], "isController": true}, {"data": [0.0296028880866426, 500, 1500, "Anonymous - Open Large Calendar"], "isController": true}, {"data": [0.765625, 500, 1500, "Anonymous - Comment"], "isController": false}, {"data": [0.0035671819262782403, 500, 1500, "Editor - Open Random Post"], "isController": true}, {"data": [0.06515711645101664, 500, 1500, "Admin - Open Admin Page"], "isController": false}, {"data": [0.029411764705882353, 500, 1500, "Editor - Open Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "Anonymous - Open Random Post"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2861, 2169, 75.81265291855995, 456.6183152743786, 0, 10018, 92.0, 175.0, 230.70000000000027, 10004.0, 0.7949989260150824, 3.6254855031834694, 0.83644781433649], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Anonymous - Open Contacts", 692, 671, 96.96531791907515, 533.0346820809244, 0, 10018, 113.5, 175.0, 188.35000000000002, 10004.0, 0.19395825637133252, 0.2198762721678591, 0.09075753434630743], "isController": true}, {"data": ["Editor - Login", 34, 32, 94.11764705882354, 661.470588235294, 6, 10010, 80.5, 160.5, 10006.25, 10010.0, 0.00979691852335081, 0.02284418762871062, 0.01463909953064116], "isController": true}, {"data": ["Anonymous - Open Predefined Date", 4145, 4025, 97.1049457177322, 523.9256936067572, 0, 10017, 114.0, 176.0, 189.0, 10004.0, 1.1538552544953729, 1.5214098368770193, 0.5501625175200882], "isController": true}, {"data": ["Anonymous - Search by Name", 4143, 4028, 97.22423364711561, 528.5684286748723, 0, 10015, 113.0, 174.0, 187.79999999999973, 10004.0, 1.1555376555220362, 1.4844338659519143, 0.533706524220549], "isController": true}, {"data": ["Admin- Open Login Page", 110, 102, 92.72727272727273, 473.98181818181854, 3, 10003, 106.5, 174.9, 884.1499999999824, 10003.0, 0.030614360639951464, 0.026329328592282118, 0.03392584297337803], "isController": false}, {"data": ["Editor - Edit Post", 16, 0, 0.0, 11.0625, 2, 114, 4.0, 39.800000000000075, 114.0, 114.0, 0.10164409320763347, 0.01806564937870048, 0.1968113533275735], "isController": true}, {"data": ["Anonymous - Open Home page", 5176, 5026, 97.10200927357033, 528.1595826893334, 0, 10024, 113.0, 174.0, 189.0, 10004.0, 1.4378073327062835, 1.860248741918584, 0.6792636371205963], "isController": true}, {"data": ["Admin - User List", 1082, 1013, 93.62292051756008, 511.7606284658035, 2, 10018, 107.5, 175.0, 189.0, 10004.0, 0.3013881402931153, 0.2903044617352659, 0.35796397313202727], "isController": false}, {"data": ["Admin - Login", 110, 102, 92.72727272727273, 468.8272727272727, 6, 10009, 112.0, 179.8, 188.0, 10008.67, 0.030628741231130605, 0.09989635738645508, 0.04712622311353406], "isController": true}, {"data": ["Anonymous - Open Random Page", 143, 2, 1.3986013986013985, 152.02797202797203, 6, 10001, 10.0, 20.19999999999999, 30.799999999999983, 10001.0, 0.8144528357766918, 20.822765558612126, 0.3806401214844684], "isController": false}, {"data": ["Admin - LogOut", 108, 102, 94.44444444444444, 553.6018518518518, 4, 10004, 112.5, 175.0, 5100.7499999999745, 10003.91, 0.03049346042330005, 0.060661560212019905, 0.035893344039926105], "isController": true}, {"data": ["Editor -  Get Post Content", 16, 0, 0.0, 5.187499999999999, 2, 18, 3.5, 11.700000000000006, 18.0, 18.0, 0.10122674157445544, 0.07856440709599458, 0.1314761389590095], "isController": false}, {"data": ["Anonymous - Open Random Date", 1385, 1345, 97.11191335740072, 534.548014440434, 3, 10016, 117.0, 175.0, 189.0, 10004.0, 0.38657089012343476, 0.4854252525759298, 0.18421047099825164], "isController": true}, {"data": ["Editor - Open Page by Predefined Date", 1682, 1647, 97.9191438763377, 528.8953626634961, 2, 10012, 115.0, 174.0, 189.8499999999999, 10004.0, 0.46808466822342387, 0.5658418257166606, 0.535346184372484], "isController": true}, {"data": ["Anonymous - Open First Post", 193, 4, 2.0725388601036268, 248.27979274611403, 14, 10002, 38.0, 65.0, 72.59999999999997, 10001.06, 1.098813509143495, 25.13072206779053, 0.4471546939405843], "isController": false}, {"data": ["Admin - Delete User", 33, 0, 0.0, 7.9393939393939394, 3, 33, 6.0, 14.400000000000006, 21.09999999999995, 33.0, 0.2061430632859204, 0.03663870851370851, 0.3808205157636976], "isController": true}, {"data": ["Admin - Add User", 1049, 1013, 96.56816015252622, 531.0352716873206, 4, 10010, 116.0, 177.0, 190.0, 10004.5, 0.29234135325899296, 0.1707788462047599, 0.4206374959207373], "isController": true}, {"data": ["Anonymous - Open Large Calendar", 1385, 1344, 97.03971119133574, 532.4953068592063, 0, 10011, 112.0, 178.0, 189.0, 10004.0, 0.38668810156523525, 0.4262280396581454, 0.18326623207065476], "isController": true}, {"data": ["Anonymous - Comment", 64, 3, 4.6875, 805.4062499999999, 11, 10004, 240.5, 1575.0, 1805.25, 10004.0, 0.35251802523808734, 0.8349496147088147, 0.7791962984918839], "isController": false}, {"data": ["Editor - Open Random Post", 1682, 1647, 97.9191438763377, 623.3436385255642, 0, 16596, 117.0, 180.0, 5932.949999999997, 10004.0, 0.4680603102110056, 85.35820672106568, 0.527652690762404], "isController": true}, {"data": ["Admin - Open Admin Page", 1082, 1011, 93.4380776340111, 504.03327171903794, 1, 10014, 110.0, 173.70000000000005, 187.0, 10004.0, 0.30133484093586466, 0.20218302401488292, 0.3356613518223517], "isController": false}, {"data": ["Editor - Open Login Page", 34, 32, 94.11764705882354, 751.176470588235, 11, 10014, 129.5, 1082.0, 10005.75, 10014.0, 0.00979134640804457, 0.008325569251601316, 0.010687911560527511], "isController": false}, {"data": ["Anonymous - Open Random Post", 125, 0, 0.0, 38.919999999999995, 9, 94, 37.0, 56.80000000000001, 69.79999999999995, 91.91999999999996, 0.7896099958308592, 18.447942098688614, 0.329594316150367], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503\/Service Unavailable", 2063, 95.11295527893039, 72.10765466620063], "isController": false}, {"data": ["503", 2, 0.09220839096357769, 0.06990562740300595], "isController": false}, {"data": ["404\/Not Found", 1, 0.046104195481788846, 0.03495281370150297], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 103, 4.748732134624251, 3.600139811254806], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2861, 2169, "503\/Service Unavailable", 2063, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 103, "503", 2, "404\/Not Found", 1, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Open Predefined Date", 2, 1, "503", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Admin- Open Login Page", 110, 102, "503\/Service Unavailable", 98, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 4, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Open Home page", 4, 1, "503", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Admin - User List", 1082, 1013, "503\/Service Unavailable", 968, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 45, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Open Random Page", 143, 2, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Open First Post", 193, 4, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Comment", 64, 3, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 2, "404\/Not Found", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Admin - Open Admin Page", 1082, 1011, "503\/Service Unavailable", 967, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 44, null, null, null, null, null, null], "isController": false}, {"data": ["Editor - Open Login Page", 34, 32, "503\/Service Unavailable", 30, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
