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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9973105885968957, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9967105263157895, 500, 1500, "Anonymous - Open Contacts"], "isController": true}, {"data": [0.9958592132505176, 500, 1500, "Comment"], "isController": false}, {"data": [0.9972972972972973, 500, 1500, "Editor - Login"], "isController": true}, {"data": [0.9966367713004485, 500, 1500, "Anonymous - Open Predefined Date"], "isController": true}, {"data": [0.9982935153583617, 500, 1500, "Anonymous - Search by Name"], "isController": true}, {"data": [1.0, 500, 1500, "Admin- Open Login Page"], "isController": false}, {"data": [0.9976787372330548, 500, 1500, "Open Random Page"], "isController": false}, {"data": [1.0, 500, 1500, "Editor - Edit Post"], "isController": true}, {"data": [0.9968587521663779, 500, 1500, "Anonymous - Open Home page"], "isController": true}, {"data": [0.9968553459119497, 500, 1500, "Admin - Login"], "isController": true}, {"data": [0.9976043805612594, 500, 1500, "Open First Post"], "isController": false}, {"data": [0.9968152866242038, 500, 1500, "Admin - LogOut"], "isController": true}, {"data": [1.0, 500, 1500, "Get Post Content"], "isController": false}, {"data": [1.0, 500, 1500, "Anonymous - Open Random Date"], "isController": true}, {"data": [1.0, 500, 1500, "Editor - Open Page by Predefined Date"], "isController": true}, {"data": [0.9968684759916493, 500, 1500, "Open Random Post"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - Delete User"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Add User"], "isController": true}, {"data": [0.9904458598726115, 500, 1500, "User List"], "isController": false}, {"data": [0.9966777408637874, 500, 1500, "Anonymous - Open Large Calendar"], "isController": true}, {"data": [1.0, 500, 1500, "Editor - Open Random Post"], "isController": true}, {"data": [0.9972972972972973, 500, 1500, "Editor - Open Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "Open Admin Page"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4768, 0, 0.0, 17.48175335570465, 0, 1466, 9.0, 19.0, 28.0, 144.650000000006, 6.635068451975074, 123.18928260714146, 4.799305280379651], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Anonymous - Open Contacts", 152, 0, 0.0, 15.769736842105255, 5, 606, 7.0, 15.0, 42.2999999999999, 364.3199999999995, 0.22652183178667606, 4.406227145232535, 0.11023670506857501], "isController": true}, {"data": ["Comment", 483, 0, 0.0, 25.594202898550726, 5, 1271, 14.0, 28.600000000000023, 53.99999999999977, 473.4799999999967, 0.6900936555675413, 1.6416681103149713, 1.5799800508640458], "isController": false}, {"data": ["Editor - Login", 185, 0, 0.0, 25.12432432432433, 12, 513, 15.0, 28.0, 37.0, 414.09999999999843, 0.2582547285044818, 7.650413257733334, 0.8121255088316137], "isController": true}, {"data": ["Anonymous - Open Predefined Date", 892, 0, 0.0, 17.860986547085197, 0, 906, 8.0, 16.0, 26.0, 426.7299999999975, 1.2510097836818956, 32.559401598859225, 0.6144275122576519], "isController": true}, {"data": ["Anonymous - Search by Name", 879, 0, 0.0, 14.99317406143346, 0, 1293, 8.0, 15.0, 22.0, 78.00000000000023, 1.2441736860803998, 32.248512912105994, 0.5931946822190736], "isController": true}, {"data": ["Admin- Open Login Page", 159, 0, 0.0, 8.867924528301888, 2, 157, 5.0, 17.0, 29.0, 115.0000000000004, 0.22234434846813136, 0.9864359131745319, 0.1003155165940202], "isController": false}, {"data": ["Open Random Page", 1077, 0, 0.0, 16.45961002785517, 6, 1292, 9.0, 18.0, 27.0, 180.92000000000098, 1.5152623640906737, 39.24454065443999, 0.7246356779743882], "isController": false}, {"data": ["Editor - Edit Post", 102, 0, 0.0, 5.029411764705879, 0, 26, 3.0, 12.700000000000003, 14.0, 25.97, 0.14368544719982418, 0.025287472143336095, 0.27505869356824497], "isController": true}, {"data": ["Anonymous - Open Home page", 4616, 0, 0.0, 20.822790294627403, 0, 1429, 11.0, 22.0, 33.0, 210.91999999999825, 6.410817281985687, 162.57421507720827, 3.120329532639476], "isController": true}, {"data": ["Admin - Login", 159, 0, 0.0, 26.125786163522008, 12, 1219, 16.0, 26.0, 35.0, 539.8000000000064, 0.22239006377979187, 8.340460589578438, 0.5330663166470851], "isController": true}, {"data": ["Open First Post", 1461, 0, 0.0, 17.763860369609837, 7, 1466, 9.0, 19.0, 27.0, 80.75999999999976, 2.043382364253536, 47.78601725843402, 0.8630585581671658], "isController": false}, {"data": ["Admin - LogOut", 157, 0, 0.0, 23.681528662420387, 10, 696, 12.0, 28.60000000000005, 48.69999999999996, 510.399999999996, 0.22300154396610375, 5.79256941455703, 0.36041753443740404], "isController": true}, {"data": ["Get Post Content", 102, 0, 0.0, 6.431372549019605, 1, 248, 3.0, 7.700000000000003, 11.699999999999989, 241.60999999999976, 0.14361747064289937, 0.11221077403832615, 0.18653441011235955], "isController": false}, {"data": ["Anonymous - Open Random Date", 304, 0, 0.0, 10.101973684210522, 5, 156, 7.0, 15.0, 21.75, 71.0999999999998, 0.43249518422303096, 10.370081256455418, 0.21273256841675464], "isController": true}, {"data": ["Editor - Open Page by Predefined Date", 185, 0, 0.0, 12.529729729729723, 0, 114, 9.0, 20.0, 31.399999999999977, 79.59999999999945, 0.258087557250098, 7.850811234150284, 0.3063263886854415], "isController": true}, {"data": ["Open Random Post", 958, 0, 0.0, 19.241127348643012, 6, 1401, 9.0, 19.0, 27.049999999999955, 231.56999999999755, 1.3503265873385035, 31.581810020378235, 0.5717846955880405], "isController": false}, {"data": ["Admin - Delete User", 80, 0, 0.0, 8.337499999999997, 3, 102, 4.0, 17.900000000000006, 20.900000000000006, 102.0, 0.11381549370315781, 0.02022892563864719, 0.2102363343159404], "isController": true}, {"data": ["Admin - Add User", 77, 0, 0.0, 12.000000000000005, 3, 340, 5.0, 22.200000000000003, 29.19999999999999, 340.0, 0.10970676947758205, 0.052368397290955174, 0.16475355469523603], "isController": true}, {"data": ["User List", 157, 0, 0.0, 22.127388535031848, 3, 1237, 5.0, 14.0, 28.299999999999983, 872.1799999999921, 0.22260283683920984, 1.4388987114556806, 0.2758623046376536], "isController": false}, {"data": ["Anonymous - Open Large Calendar", 301, 0, 0.0, 18.880398671096355, 0, 820, 9.0, 19.0, 32.89999999999998, 311.50000000000045, 0.43156534917364553, 8.135955585688661, 0.21104170609539458], "isController": true}, {"data": ["Editor - Open Random Post", 184, 0, 0.0, 47.320652173913025, 8, 372, 30.5, 108.0, 126.5, 255.55000000000078, 0.25877260216947073, 53.874524481171484, 0.304731053608823], "isController": true}, {"data": ["Editor - Open Login Page", 185, 0, 0.0, 12.956756756756759, 2, 607, 5.0, 10.0, 15.099999999999966, 385.1199999999965, 0.2582576126666285, 1.145765951508294, 0.30961466917199815], "isController": false}, {"data": ["Open Admin Page", 159, 0, 0.0, 5.918238993710692, 1, 282, 3.0, 8.0, 15.0, 151.20000000000124, 0.22242490711312055, 0.4036383106093883, 0.25826485796630894], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4768, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
