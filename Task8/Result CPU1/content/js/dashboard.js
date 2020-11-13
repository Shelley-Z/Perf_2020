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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9974489795918368, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Anonymous - Open Contacts"], "isController": true}, {"data": [0.9977272727272727, 500, 1500, "Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Editor - Login"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open Predefined Date"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Search by Name"], "isController": true}, {"data": [0.75, 500, 1500, "Admin- Open Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "Open Random Page"], "isController": false}, {"data": [1.0, 500, 1500, "Editor - Edit Post"], "isController": true}, {"data": [0.998046875, 500, 1500, "Anonymous - Open Home page"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Login"], "isController": true}, {"data": [0.9970014992503748, 500, 1500, "Open First Post"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - LogOut"], "isController": true}, {"data": [1.0, 500, 1500, "Get Post Content"], "isController": false}, {"data": [1.0, 500, 1500, "Anonymous - Open Random Date"], "isController": true}, {"data": [0.995, 500, 1500, "Editor - Open Page by Predefined Date"], "isController": true}, {"data": [0.9988505747126437, 500, 1500, "Open Random Post"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - Delete User"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Add User"], "isController": true}, {"data": [1.0, 500, 1500, "User List"], "isController": false}, {"data": [1.0, 500, 1500, "Anonymous - Open Large Calendar"], "isController": true}, {"data": [0.955, 500, 1500, "Editor - Open Random Post"], "isController": true}, {"data": [0.75, 500, 1500, "Editor - Open Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "Open Admin Page"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1962, 0, 0.0, 27.831294597349608, 1, 1067, 12.0, 52.0, 103.0, 249.10999999999967, 5.984517120843323, 120.25428919465999, 4.205096366701134], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Anonymous - Open Contacts", 64, 0, 0.0, 27.03125, 5, 228, 8.0, 96.0, 173.0, 228.0, 0.5472377320416243, 10.642611542440852, 0.2641330557241922], "isController": true}, {"data": ["Comment", 220, 0, 0.0, 47.40454545454543, 5, 561, 35.0, 70.80000000000001, 127.64999999999992, 257.3799999999998, 1.1864315375074153, 2.8247266488701936, 2.7121452080973953], "isController": false}, {"data": ["Editor - Login", 2, 0, 0.0, 19.0, 16, 22, 19.0, 22.0, 22.0, 22.0, 2.0942408376963355, 65.38367146596859, 5.020860602094241], "isController": true}, {"data": ["Anonymous - Open Predefined Date", 416, 0, 0.0, 18.192307692307722, 6, 280, 7.5, 24.900000000000034, 95.74999999999989, 227.59999999999968, 2.14497117694981, 55.9526827366558, 1.048628182008023], "isController": true}, {"data": ["Anonymous - Search by Name", 384, 0, 0.0, 21.3046875, 6, 442, 8.0, 35.5, 115.25, 226.99999999999955, 2.1320067513547123, 55.38428866483078, 1.00902927761615], "isController": true}, {"data": ["Admin- Open Login Page", 2, 0, 0.0, 548.0, 29, 1067, 548.0, 1067.0, 1067.0, 1067.0, 0.6381620931716656, 2.831221083280153, 0.28792078813018507], "isController": false}, {"data": ["Open Random Page", 496, 0, 0.0, 20.27016129032257, 6, 258, 9.0, 33.60000000000002, 86.64999999999975, 234.3299999999997, 2.540228825451454, 65.75899438979452, 1.2021354438742586], "isController": false}, {"data": ["Editor - Edit Post", 100, 0, 0.0, 5.130000000000002, 1, 94, 2.0, 10.900000000000006, 17.799999999999955, 93.42999999999971, 0.3134992789516584, 0.05571959840742366, 0.6071017628456329], "isController": true}, {"data": ["Anonymous - Open Home page", 512, 0, 0.0, 27.273437500000025, 7, 1227, 10.0, 42.799999999999955, 116.0499999999999, 268.22, 2.6277297338910417, 66.92011498723345, 1.2652184268264517], "isController": true}, {"data": ["Admin - Login", 2, 0, 0.0, 42.0, 20, 64, 42.0, 64.0, 64.0, 64.0, 1.1983223487118035, 44.905491686638705, 2.87527149490713], "isController": true}, {"data": ["Open First Post", 667, 0, 0.0, 27.709145427286355, 7, 626, 12.0, 53.200000000000045, 109.00000000000023, 248.88000000000045, 3.380724296104818, 79.0536240939963, 1.4133588424060417], "isController": false}, {"data": ["Admin - LogOut", 2, 0, 0.0, 33.0, 12, 54, 33.0, 54.0, 54.0, 54.0, 21.052631578947366, 546.2582236842105, 34.02549342105263], "isController": true}, {"data": ["Get Post Content", 100, 0, 0.0, 11.620000000000005, 1, 240, 3.0, 26.50000000000003, 70.84999999999997, 238.47999999999922, 0.3126406883097394, 0.24272702501281826, 0.40606651899604823], "isController": false}, {"data": ["Anonymous - Open Random Date", 128, 0, 0.0, 24.671874999999996, 5, 288, 8.0, 61.90000000000016, 157.1, 273.2099999999997, 0.8025480901863417, 18.872438302156223, 0.3902159865385098], "isController": true}, {"data": ["Editor - Open Page by Predefined Date", 100, 0, 0.0, 20.209999999999997, 7, 549, 9.0, 18.900000000000006, 37.29999999999984, 545.8999999999984, 0.3126387334379631, 9.537536114658693, 0.37309036353631925], "isController": true}, {"data": ["Open Random Post", 435, 0, 0.0, 26.20229885057472, 6, 586, 12.0, 44.80000000000007, 132.39999999999998, 258.64, 2.2468427984814445, 52.55994506372512, 0.9423332542418843], "isController": false}, {"data": ["Admin - Delete User", 8, 0, 0.0, 14.625, 4, 38, 11.0, 38.0, 38.0, 38.0, 0.25762406208739896, 0.04578865166006505, 0.47587491546710464], "isController": true}, {"data": ["Admin - Add User", 12, 0, 0.0, 9.416666666666668, 4, 27, 6.5, 24.60000000000001, 27.0, 27.0, 0.3436130916587922, 0.16403274704349569, 0.5160348301978639], "isController": true}, {"data": ["User List", 20, 0, 0.0, 29.000000000000004, 3, 385, 5.0, 54.100000000000065, 368.5999999999998, 385.0, 0.47458592378150066, 3.62404749122016, 0.5881343137487541], "isController": false}, {"data": ["Anonymous - Open Large Calendar", 128, 0, 0.0, 20.2890625, 6, 276, 8.0, 26.900000000000077, 103.29999999999998, 275.71, 0.7942565324497229, 15.023393336932306, 0.3865116780530786], "isController": true}, {"data": ["Editor - Open Random Post", 100, 0, 0.0, 310.21, 9, 1051, 301.0, 420.0, 614.8, 1048.0099999999984, 0.3123594382527862, 413.61444417883047, 0.36784289354946526], "isController": true}, {"data": ["Editor - Open Login Page", 2, 0, 0.0, 458.5, 5, 912, 458.5, 912.0, 912.0, 912.0, 1.0828370330265296, 4.80403187601516, 0.48854561451001627], "isController": false}, {"data": ["Open Admin Page", 20, 0, 0.0, 24.35, 1, 196, 3.0, 116.20000000000016, 192.39999999999995, 196.0, 0.47001316036849033, 0.9463145827458169, 0.5457477028106787], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1962, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
