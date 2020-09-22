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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Add User"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page"], "isController": false}, {"data": [1.0, 500, 1500, "T_Delete User"], "isController": true}, {"data": [1.0, 500, 1500, "Delete User"], "isController": false}, {"data": [1.0, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "Login "], "isController": false}, {"data": [1.0, 500, 1500, "LogOut-0"], "isController": false}, {"data": [1.0, 500, 1500, "LogOut-1"], "isController": false}, {"data": [1.0, 500, 1500, "LogOut"], "isController": false}, {"data": [1.0, 500, 1500, "User List"], "isController": false}, {"data": [1.0, 500, 1500, "Manage User"], "isController": true}, {"data": [1.0, 500, 1500, "T_Add User"], "isController": true}, {"data": [1.0, 500, 1500, "Open Admin Page"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 40, 0, 0.0, 14.35, 2, 66, 12.5, 26.799999999999997, 47.899999999999906, 66.0, 1.1065006915629323, 9.107532633125865, 1.4713001383125865], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Add User", 4, 0, 0.0, 12.75, 12, 13, 13.0, 13.0, 13.0, 13.0, 0.175054704595186, 0.08372367341356673, 0.2630521745076586], "isController": false}, {"data": ["Open Home Page", 2, 0, 0.0, 44.5, 23, 66, 44.5, 66.0, 66.0, 66.0, 4.264392324093817, 113.10634328358209, 1.8490138592750534], "isController": false}, {"data": ["T_Delete User", 6, 0, 0.0, 13.333333333333332, 7, 16, 14.0, 16.0, 16.0, 16.0, 0.2595829367482911, 0.04613681102362205, 0.48012703339967117], "isController": true}, {"data": ["Delete User", 6, 0, 0.0, 13.333333333333332, 7, 16, 14.0, 16.0, 16.0, 16.0, 0.24446889133357783, 0.04345052560811637, 0.4521719533064418], "isController": false}, {"data": ["Login", 2, 0, 0.0, 82.5, 50, 115, 82.5, 115.0, 115.0, 115.0, 17.391304347826086, 1119.7860054347825, 49.38009510869565], "isController": true}, {"data": ["Login ", 2, 0, 0.0, 38.0, 27, 49, 38.0, 49.0, 49.0, 49.0, 2.840909090909091, 107.56891424005683, 6.834550337357955], "isController": false}, {"data": ["LogOut-0", 2, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 0.8051529790660226, 0.4127981582125604, 0.9647682669082126], "isController": false}, {"data": ["LogOut-1", 2, 0, 0.0, 18.5, 17, 20, 18.5, 20.0, 20.0, 20.0, 0.8009611533840608, 21.244243091710054, 0.33477673207849423], "isController": false}, {"data": ["LogOut", 4, 0, 0.0, 26.0, 25, 27, 26.0, 27.0, 27.0, 27.0, 1.06439595529537, 28.777150412453434, 1.720288384779138], "isController": false}, {"data": ["User List", 10, 0, 0.0, 10.6, 6, 14, 11.0, 14.0, 14.0, 14.0, 0.42859591976684386, 2.8686628075175724, 0.5282109870564032], "isController": false}, {"data": ["Manage User", 2, 0, 0.0, 154.0, 149, 159, 154.0, 159.0, 159.0, 159.0, 2.4600246002460024, 113.55151637453875, 50.4845575799508], "isController": true}, {"data": ["T_Add User", 4, 0, 0.0, 12.75, 12, 13, 13.0, 13.0, 13.0, 13.0, 0.18013960819635216, 0.08615563780680027, 0.27069318565638373], "isController": true}, {"data": ["Open Admin Page", 10, 0, 0.0, 7.1000000000000005, 2, 24, 5.0, 22.700000000000003, 24.0, 24.0, 0.4125242357988532, 0.9243121158368054, 0.4789954261375356], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 40, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
