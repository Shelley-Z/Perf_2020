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

    var data = {"OkPercent": 62.0472215255634, "KoPercent": 37.9527784744366};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.22259293269394279, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1308262711864407, 500, 1500, "Anonymous - Open Contacts"], "isController": true}, {"data": [0.10989010989010989, 500, 1500, "Editor - Login"], "isController": true}, {"data": [0.13059981462682616, 500, 1500, "Anonymous - Open Predefined Date"], "isController": true}, {"data": [0.13044054030193344, 500, 1500, "Anonymous - Search by Name"], "isController": true}, {"data": [0.24468085106382978, 500, 1500, "Admin- Open Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "Editor - Edit Post"], "isController": true}, {"data": [0.13057561597281223, 500, 1500, "Anonymous - Open Home page"], "isController": true}, {"data": [0.24421437271619975, 500, 1500, "Admin - User List"], "isController": false}, {"data": [0.24468085106382978, 500, 1500, "Admin - Login"], "isController": true}, {"data": [0.9994447529150472, 500, 1500, "Anonymous - Open Random Page"], "isController": false}, {"data": [0.24390243902439024, 500, 1500, "Admin - LogOut"], "isController": true}, {"data": [1.0, 500, 1500, "Editor -  Get Post Content"], "isController": false}, {"data": [0.130659253375695, 500, 1500, "Anonymous - Open Random Date"], "isController": true}, {"data": [0.10431216051435539, 500, 1500, "Editor - Open Page by Predefined Date"], "isController": true}, {"data": [0.9994920763917107, 500, 1500, "Anonymous - Open First Post"], "isController": false}, {"data": [0.9987864077669902, 500, 1500, "Admin - Delete User"], "isController": true}, {"data": [0.13596796657381616, 500, 1500, "Admin - Add User"], "isController": true}, {"data": [0.13080895008605853, 500, 1500, "Anonymous - Open Large Calendar"], "isController": true}, {"data": [0.856, 500, 1500, "Anonymous - Comment"], "isController": false}, {"data": [0.01402439024390244, 500, 1500, "Editor - Open Random Post"], "isController": true}, {"data": [0.24432942609225147, 500, 1500, "Admin - Open Admin Page"], "isController": false}, {"data": [0.1043956043956044, 500, 1500, "Editor - Open Login Page"], "isController": false}, {"data": [0.9996876951905059, 500, 1500, "Anonymous - Open Random Post"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 27911, 10593, 37.9527784744366, 116.14109132600052, 0, 19003, 60.0, 167.0, 184.0, 1175.0, 1.550725864825108, 17.075615049506716, 1.239777290394489], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Anonymous - Open Contacts", 3776, 3282, 86.91737288135593, 174.73649364406842, 2, 10010, 103.0, 169.0, 180.0, 191.0, 0.21019638387626738, 0.6294078167956207, 0.10224398347642664], "isController": true}, {"data": ["Editor - Login", 182, 162, 89.01098901098901, 205.47252747252742, 4, 10003, 101.0, 164.40000000000003, 176.7, 10002.17, 0.010127953334842881, 0.03791238429648037, 0.01707613972724754], "isController": true}, {"data": ["Anonymous - Open Predefined Date", 22657, 19698, 86.94001853731739, 176.45288431831284, 0, 19008, 111.0, 170.0, 180.0, 195.0, 1.259238160079477, 4.851087858914417, 0.6221618145629112], "isController": true}, {"data": ["Anonymous - Search by Name", 22654, 19699, 86.95594596980666, 177.3262558488582, 0, 19005, 112.0, 170.0, 180.0, 195.9800000000032, 1.2591471448557803, 4.828151076053482, 0.6025262509794185], "isController": true}, {"data": ["Admin- Open Login Page", 658, 496, 75.37993920972644, 160.3510638297872, 2, 10003, 86.5, 165.0, 176.04999999999995, 1052.989999999948, 0.03658813729181391, 0.05422678287376019, 0.026746473985083716], "isController": false}, {"data": ["Editor - Edit Post", 570, 0, 0.0, 3.6666666666666625, 1, 45, 3.0, 6.0, 7.0, 13.579999999999927, 0.1427726243261508, 0.025375603151718204, 0.27647861951771907], "isController": true}, {"data": ["Anonymous - Open Home page", 28248, 24558, 86.93712829226848, 174.2452563013296, 1, 19006, 111.0, 168.0, 177.0, 188.0, 1.5694746732469629, 5.9219355926962916, 0.769522641802909], "isController": true}, {"data": ["Admin - User List", 6568, 4964, 75.57856272838002, 152.44777710109636, 2, 10006, 86.0, 165.0, 176.0, 191.0, 0.3650730276676775, 0.7568333985132001, 0.3459938513917659], "isController": false}, {"data": ["Admin - Login", 658, 497, 75.53191489361703, 161.64589665653486, 5, 10006, 85.5, 163.10000000000002, 178.04999999999995, 193.2299999999999, 0.036592316603396624, 0.3499107690381398, 0.05302543791284878], "isController": true}, {"data": ["Anonymous - Open Random Page", 3602, 2, 0.0555247084952804, 18.42198778456414, 6, 10002, 10.0, 24.0, 29.0, 40.0, 0.8974008262465575, 23.21047908508902, 0.432782728596791], "isController": false}, {"data": ["Admin - LogOut", 656, 496, 75.60975609756098, 149.5426829268294, 3, 13002, 83.0, 165.0, 176.0, 191.7199999999998, 0.0365844715091457, 0.24583715481770366, 0.0369295422674732], "isController": true}, {"data": ["Editor -  Get Post Content", 570, 0, 0.0, 4.292982456140352, 2, 45, 4.0, 7.0, 8.0, 11.86999999999989, 0.14276554391167573, 0.11084949059938987, 0.18542790371340695], "isController": false}, {"data": ["Anonymous - Open Random Date", 7554, 6567, 86.9340746624305, 173.6979083929043, 0, 19004, 100.0, 166.0, 178.0, 191.0, 0.42000642853365994, 1.5108443136799443, 0.20749782382987705], "isController": true}, {"data": ["Editor - Open Page by Predefined Date", 9021, 8080, 89.56878394856446, 179.03868750692726, 0, 10021, 104.0, 168.0, 179.0, 192.0, 0.5013138858444763, 1.8205034796954818, 0.5935391029971357], "isController": true}, {"data": ["Anonymous - Open First Post", 4922, 1, 0.02031694433157253, 42.34681023974002, 7, 10002, 35.0, 60.0, 69.0, 84.0, 1.2259108029093089, 28.61939065483363, 0.5238054915642044], "isController": false}, {"data": ["Admin - Delete User", 824, 1, 0.12135922330097088, 18.61650485436893, 2, 10001, 5.0, 12.0, 13.0, 19.75, 0.20535707832702765, 0.03707873995364014, 0.3788532119473209], "isController": true}, {"data": ["Admin - Add User", 5744, 4963, 86.40320334261838, 169.4691852367684, 0, 10006, 100.0, 167.0, 177.0, 192.0, 0.3194768944064902, 0.16377366626322326, 0.37270683930214876], "isController": true}, {"data": ["Anonymous - Open Large Calendar", 7553, 6565, 86.91910499139415, 174.68092148815015, 0, 13003, 100.0, 167.0, 178.0, 191.0, 0.4200413501317989, 1.221641491204074, 0.20670081410261723], "isController": true}, {"data": ["Anonymous - Comment", 1625, 3, 0.18461538461538463, 414.844923076923, 6, 10027, 196.0, 1068.0000000000005, 1278.3999999999996, 1519.48, 0.4043147474612766, 0.9590107691721077, 0.9268806245624069], "isController": false}, {"data": ["Editor - Open Random Post", 9020, 8081, 89.58980044345898, 551.0708425720624, 0, 10068, 119.0, 203.8000000000011, 4189.7499999999945, 5456.369999999997, 0.5013182112343744, 402.21063858658505, 0.5856350530071757], "isController": true}, {"data": ["Admin - Open Admin Page", 6569, 4964, 75.56705739077485, 153.32775156035865, 1, 19003, 87.0, 165.0, 177.0, 191.0, 0.36510072783933345, 0.3026998305906779, 0.3177038659986122], "isController": false}, {"data": ["Editor - Open Login Page", 182, 162, 89.01098901098901, 220.37362637362637, 3, 10003, 108.5, 172.0, 183.85, 10003.0, 0.01012677723549442, 0.009675775716700403, 0.012004899704843393], "isController": false}, {"data": ["Anonymous - Open Random Post", 3202, 1, 0.03123048094940662, 42.520612117426666, 7, 10002, 36.0, 61.0, 68.0, 82.9699999999998, 0.7983783096421261, 18.64076003177805, 0.3417999186692614], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503\/Service Unavailable", 10491, 99.03709997167941, 37.5873311597578], "isController": false}, {"data": ["500\/Internal Server Error", 1, 0.009440196356084207, 0.0035828168105764753], "isController": false}, {"data": ["404\/Not Found", 2, 0.018880392712168414, 0.0071656336211529505], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 99, 0.9345794392523364, 0.35469886424707103], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 27911, 10593, "503\/Service Unavailable", 10491, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 99, "404\/Not Found", 2, "500\/Internal Server Error", 1, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Admin- Open Login Page", 658, 496, "503\/Service Unavailable", 492, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 4, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Admin - User List", 6568, 4964, "503\/Service Unavailable", 4919, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 44, "500\/Internal Server Error", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Open Random Page", 3602, 2, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Open First Post", 4922, 1, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Comment", 1625, 3, "404\/Not Found", 2, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Admin - Open Admin Page", 6569, 4964, "503\/Service Unavailable", 4920, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 44, null, null, null, null, null, null], "isController": false}, {"data": ["Editor - Open Login Page", 182, 162, "503\/Service Unavailable", 160, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Anonymous - Open Random Post", 3202, 1, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 1, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
