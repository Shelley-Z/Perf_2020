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

    var data = {"OkPercent": 99.89832231825115, "KoPercent": 0.10167768174885612};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.999108280254777, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Anonymous - Open Contacts"], "isController": true}, {"data": [1.0, 500, 1500, "Editor - Login"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open Predefined Date"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Search by Name"], "isController": true}, {"data": [1.0, 500, 1500, "Admin- Open Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "Editor - Edit Post"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open Home page"], "isController": true}, {"data": [0.975, 500, 1500, "Admin - User List"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - Login"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open Random Page"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - LogOut"], "isController": true}, {"data": [1.0, 500, 1500, "Editor -  Get Post Content"], "isController": false}, {"data": [1.0, 500, 1500, "Anonymous - Open Random Date"], "isController": true}, {"data": [1.0, 500, 1500, "Editor - Open Page by Predefined Date"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open First Post"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - Add User"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Delete User"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open Large Calendar"], "isController": true}, {"data": [0.9864253393665159, 500, 1500, "Anonymous - Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Editor - Open Random Post"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Open Admin Page"], "isController": false}, {"data": [1.0, 500, 1500, "Editor - Open Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "Anonymous - Open Random Post"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1967, 2, 0.10167768174885612, 20.53177427554654, 1, 1319, 18.0, 29.0, 31.0, 55.0, 6.283361390708802, 126.494430833911, 4.4256001057342464], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Anonymous - Open Contacts", 64, 0, 0.0, 21.218749999999993, 5, 316, 16.5, 22.0, 25.75, 316.0, 0.547312609569419, 10.645545936310771, 0.2657225435070766], "isController": true}, {"data": ["Editor - Login", 2, 0, 0.0, 32.0, 16, 48, 32.0, 48.0, 48.0, 48.0, 40.816326530612244, 1272.8396045918366, 97.7359693877551], "isController": true}, {"data": ["Anonymous - Open Predefined Date", 416, 0, 0.0, 17.637019230769212, 6, 67, 18.0, 24.0, 26.149999999999977, 39.979999999999905, 2.1286394105306248, 55.787987946451416, 1.0437420847618073], "isController": true}, {"data": ["Anonymous - Search by Name", 384, 0, 0.0, 19.04427083333334, 7, 94, 20.0, 26.0, 28.0, 36.24999999999966, 2.159256406075158, 56.325365525489346, 1.027713708044917], "isController": true}, {"data": ["Admin- Open Login Page", 2, 0, 0.0, 96.5, 8, 185, 96.5, 185.0, 185.0, 185.0, 3.6166365280289328, 16.045292721518987, 1.6317246835443036], "isController": false}, {"data": ["Editor - Edit Post", 100, 0, 0.0, 7.639999999999999, 2, 111, 5.0, 8.0, 32.94999999999999, 110.30999999999965, 0.32749089575309803, 0.05820638967486704, 0.6336053349904374], "isController": true}, {"data": ["Anonymous - Open Home page", 512, 0, 0.0, 22.148437500000004, 7, 174, 22.0, 31.0, 33.0, 51.22000000000003, 2.623085199036836, 67.03615507646396, 1.2663942824939802], "isController": true}, {"data": ["Admin - User List", 20, 0, 0.0, 47.0, 5, 733, 11.0, 16.900000000000002, 697.1999999999995, 733.0, 0.43309729530739083, 2.6268577505467854, 0.5367192067823037], "isController": false}, {"data": ["Admin - Login", 2, 0, 0.0, 51.5, 19, 84, 51.5, 84.0, 84.0, 84.0, 6.7114093959731544, 251.25838926174498, 16.06412541946309], "isController": true}, {"data": ["Anonymous - Open Random Page", 498, 0, 0.0, 19.757028112449802, 4, 71, 21.0, 30.0, 31.049999999999955, 42.01999999999998, 2.5166259020436215, 65.27171734766328, 1.19481891853308], "isController": false}, {"data": ["Admin - LogOut", 2, 0, 0.0, 26.0, 15, 37, 26.0, 37.0, 37.0, 37.0, 1.1254924029262803, 29.27159538548115, 1.8190331316826112], "isController": true}, {"data": ["Editor -  Get Post Content", 100, 0, 0.0, 5.070000000000002, 1, 25, 5.0, 6.0, 7.949999999999989, 24.91999999999996, 0.32651781807733243, 0.2542725621771555, 0.42409052543247283], "isController": false}, {"data": ["Anonymous - Open Random Date", 128, 0, 0.0, 17.156249999999993, 5, 88, 16.0, 25.0, 27.0, 75.81999999999974, 0.8325365698192485, 19.88746884085543, 0.40637225848309233], "isController": true}, {"data": ["Editor - Open Page by Predefined Date", 100, 0, 0.0, 22.57000000000001, 7, 50, 26.0, 30.900000000000006, 32.94999999999999, 49.84999999999992, 0.3268091336616676, 9.984494566185386, 0.3900007434907791], "isController": true}, {"data": ["Anonymous - Open First Post", 670, 0, 0.0, 19.564179104477578, 6, 61, 20.0, 28.0, 30.0, 35.57999999999993, 3.357386249749449, 78.66866677001904, 1.4100895015910002], "isController": false}, {"data": ["Admin - Add User", 10, 0, 0.0, 13.200000000000001, 4, 38, 12.0, 35.50000000000001, 38.0, 38.0, 0.2423654871546292, 0.11569165050896753, 0.3639742638148328], "isController": true}, {"data": ["Admin - Delete User", 10, 0, 0.0, 10.8, 4, 20, 11.5, 19.300000000000004, 20.0, 20.0, 0.23422494964163584, 0.04162982503396261, 0.4326985715205883], "isController": true}, {"data": ["Anonymous - Open Large Calendar", 128, 0, 0.0, 20.046874999999993, 6, 72, 20.0, 28.0, 30.0, 68.80999999999993, 0.8184561870172388, 15.481130748375877, 0.39828803583303496], "isController": true}, {"data": ["Anonymous - Comment", 221, 2, 0.9049773755656109, 31.4253393665159, 5, 1319, 18.0, 32.0, 39.59999999999991, 653.5200000000007, 1.1543363349560203, 2.7387433436318243, 2.6372522959410194], "isController": false}, {"data": ["Editor - Open Random Post", 100, 0, 0.0, 54.209999999999994, 10, 105, 49.0, 85.9, 96.59999999999991, 104.96999999999998, 0.3263441298849637, 62.69314218405809, 0.38431801725544584], "isController": true}, {"data": ["Admin - Open Admin Page", 20, 0, 0.0, 10.2, 2, 96, 4.0, 35.000000000000064, 93.09999999999997, 96.0, 0.43006128373293195, 0.8658763170626814, 0.4993582679281797], "isController": false}, {"data": ["Editor - Open Login Page", 2, 0, 0.0, 96.5, 8, 185, 96.5, 185.0, 185.0, 185.0, 7.518796992481203, 33.35731907894737, 3.392269736842105], "isController": false}, {"data": ["Anonymous - Open Random Post", 434, 0, 0.0, 19.486175115207367, 6, 50, 19.0, 28.0, 30.0, 34.64999999999998, 2.292063860912917, 53.879746773814496, 0.9664383789985689], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404\/Not Found", 2, 100.0, 0.10167768174885612], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1967, 2, "404\/Not Found", 2, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Comment", 221, 2, "404\/Not Found", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
