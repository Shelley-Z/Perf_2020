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

    var data = {"OkPercent": 99.84709480122324, "KoPercent": 0.1529051987767584};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9991071428571429, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Anonymous - Open Contacts"], "isController": true}, {"data": [1.0, 500, 1500, "Editor - Login"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open Predefined Date"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Search by Name"], "isController": true}, {"data": [1.0, 500, 1500, "Admin- Open Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "Editor - Edit Post"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open Home page"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - User List"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - Login"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open Random Page"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - LogOut"], "isController": true}, {"data": [1.0, 500, 1500, "Editor -  Get Post Content"], "isController": false}, {"data": [1.0, 500, 1500, "Anonymous - Open Random Date"], "isController": true}, {"data": [1.0, 500, 1500, "Editor - Open Page by Predefined Date"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open First Post"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - Add User"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Delete User"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open Large Calendar"], "isController": true}, {"data": [0.9840909090909091, 500, 1500, "Anonymous - Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Editor - Open Random Post"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Open Admin Page"], "isController": false}, {"data": [1.0, 500, 1500, "Editor - Open Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "Anonymous - Open Random Post"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1962, 3, 0.1529051987767584, 20.42150866462794, 2, 960, 18.0, 29.0, 31.0, 59.36999999999989, 6.3285014805209885, 127.7726347699467, 4.436488416495713], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Anonymous - Open Contacts", 64, 0, 0.0, 19.87500000000001, 6, 206, 17.5, 22.5, 44.0, 206.0, 0.5431738326006144, 10.561621320845994, 0.26011608218899057], "isController": true}, {"data": ["Editor - Login", 2, 0, 0.0, 72.5, 68, 77, 72.5, 77.0, 77.0, 77.0, 0.6508298080052066, 20.295847909209243, 1.5603390416531078], "isController": true}, {"data": ["Anonymous - Open Predefined Date", 416, 0, 0.0, 17.668269230769244, 6, 81, 16.0, 25.0, 26.0, 49.10999999999973, 2.122492295761138, 55.62948350986755, 1.033622816281965], "isController": true}, {"data": ["Anonymous - Search by Name", 384, 0, 0.0, 19.260416666666643, 6, 80, 21.0, 26.0, 27.75, 37.2999999999995, 2.114339516675201, 54.98404394618896, 0.9983341489232836], "isController": true}, {"data": ["Admin- Open Login Page", 2, 0, 0.0, 10.0, 9, 11, 10.0, 11.0, 11.0, 11.0, 0.9119927040583675, 4.046077006383949, 0.4114654582763338], "isController": false}, {"data": ["Editor - Edit Post", 100, 0, 0.0, 6.999999999999997, 2, 168, 5.0, 6.900000000000006, 13.849999999999966, 166.71999999999935, 0.3296467834715103, 0.058589565031069206, 0.6377377577425788], "isController": true}, {"data": ["Anonymous - Open Home page", 512, 0, 0.0, 22.43359374999999, 6, 114, 24.0, 31.0, 33.0, 41.870000000000005, 2.5837967682354486, 65.9798078190762, 1.240093132752652], "isController": true}, {"data": ["Admin - User List", 20, 0, 0.0, 31.399999999999995, 4, 454, 10.0, 14.900000000000002, 432.04999999999967, 454.0, 0.4620324808834061, 3.3643093625106846, 0.5725773615635179], "isController": false}, {"data": ["Admin - Login", 2, 0, 0.0, 84.5, 55, 114, 84.5, 114.0, 114.0, 114.0, 0.8984725965858041, 33.636567834681045, 2.1540529537286615], "isController": true}, {"data": ["Anonymous - Open Random Page", 496, 0, 0.0, 19.782258064516128, 6, 60, 19.0, 31.0, 32.0, 37.08999999999992, 2.501828453254647, 64.96264871945222, 1.1793474234571637], "isController": false}, {"data": ["Admin - LogOut", 2, 0, 0.0, 21.5, 16, 27, 21.5, 27.0, 27.0, 27.0, 3.284072249589491, 85.40832820197045, 5.307753489326766], "isController": true}, {"data": ["Editor -  Get Post Content", 100, 0, 0.0, 4.69, 2, 20, 5.0, 6.0, 7.949999999999989, 19.889999999999944, 0.32813889463131957, 0.25510555920610073, 0.4261960252535693], "isController": false}, {"data": ["Anonymous - Open Random Date", 128, 0, 0.0, 16.562500000000004, 5, 39, 15.0, 25.0, 27.549999999999997, 36.969999999999956, 0.7819563570608216, 18.545148100166777, 0.38020384701146054], "isController": true}, {"data": ["Editor - Open Page by Predefined Date", 100, 0, 0.0, 23.869999999999987, 6, 79, 27.0, 30.0, 33.94999999999999, 78.81999999999991, 0.32891490971285725, 10.050396573734501, 0.39251369108311684], "isController": true}, {"data": ["Anonymous - Open First Post", 666, 0, 0.0, 19.460960960960932, 6, 59, 19.0, 28.0, 29.0, 33.0, 3.3354534664175928, 78.35091135725662, 1.3898211857637237], "isController": false}, {"data": ["Admin - Add User", 10, 0, 0.0, 10.4, 5, 27, 9.0, 25.700000000000003, 27.0, 27.0, 0.27834994154651227, 0.13286860491009297, 0.4180141993263931], "isController": true}, {"data": ["Admin - Delete User", 10, 0, 0.0, 12.6, 5, 21, 12.5, 20.300000000000004, 21.0, 21.0, 0.31876573905836597, 0.056655629402951775, 0.5890940279238788], "isController": true}, {"data": ["Anonymous - Open Large Calendar", 128, 0, 0.0, 20.031250000000007, 7, 33, 21.0, 29.0, 29.0, 32.41999999999999, 0.7896652559625896, 14.99259664723864, 0.3831568218132689], "isController": true}, {"data": ["Anonymous - Comment", 220, 3, 1.3636363636363635, 32.30909090909092, 6, 960, 20.0, 35.900000000000006, 95.34999999999985, 368.9599999999982, 1.152562618203155, 2.728582513333054, 2.631217371345198], "isController": false}, {"data": ["Editor - Open Random Post", 100, 0, 0.0, 55.300000000000004, 9, 102, 55.5, 89.0, 93.84999999999997, 101.94999999999997, 0.3283985970811933, 64.80380916203352, 0.38673424630879977], "isController": true}, {"data": ["Admin - Open Admin Page", 20, 0, 0.0, 6.600000000000001, 2, 30, 4.0, 27.70000000000005, 30.0, 30.0, 0.465105462663659, 0.936433527708658, 0.5400492139717681], "isController": false}, {"data": ["Editor - Open Login Page", 2, 0, 0.0, 60.5, 7, 114, 60.5, 114.0, 114.0, 114.0, 0.6161429451632779, 2.7335326170671594, 0.27798636783733827], "isController": false}, {"data": ["Anonymous - Open Random Post", 436, 0, 0.0, 20.220183486238543, 7, 68, 20.0, 29.0, 30.0, 38.51999999999998, 2.207360230051488, 52.07998453329014, 0.922261509535695], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404\/Not Found", 3, 100.0, 0.1529051987767584], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1962, 3, "404\/Not Found", 3, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Comment", 220, 3, "404\/Not Found", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
