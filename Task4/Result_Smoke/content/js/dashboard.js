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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Add User"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page"], "isController": false}, {"data": [1.0, 500, 1500, "Delete User "], "isController": true}, {"data": [1.0, 500, 1500, "Delete User"], "isController": false}, {"data": [1.0, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "Login "], "isController": false}, {"data": [1.0, 500, 1500, "LogOut-0"], "isController": false}, {"data": [1.0, 500, 1500, "LogOut-1"], "isController": false}, {"data": [1.0, 500, 1500, "Add User "], "isController": true}, {"data": [1.0, 500, 1500, "LogOut"], "isController": false}, {"data": [1.0, 500, 1500, "User List"], "isController": false}, {"data": [1.0, 500, 1500, "Manage User"], "isController": true}, {"data": [1.0, 500, 1500, "Open Admin Page"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 28, 0, 0.0, 19.07142857142857, 2, 74, 14.0, 50.30000000000003, 72.64999999999999, 74.0, 1.267656646142702, 12.940293159747373, 1.6391730662576964], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Add User", 4, 0, 0.0, 14.5, 7, 20, 15.5, 20.0, 20.0, 20.0, 0.4929143561306223, 0.23490449784349968, 0.7398528958718422], "isController": false}, {"data": ["Open Home Page", 2, 0, 0.0, 49.5, 25, 74, 49.5, 74.0, 74.0, 74.0, 3.968253968253968, 105.25173611111111, 1.720610119047619], "isController": false}, {"data": ["Delete User ", 2, 0, 0.0, 17.0, 16, 18, 17.0, 18.0, 18.0, 18.0, 0.508130081300813, 0.09031218241869919, 0.9393459413109756], "isController": true}, {"data": ["Delete User", 2, 0, 0.0, 17.0, 16, 18, 17.0, 18.0, 18.0, 18.0, 0.691323885240235, 0.12287201866574492, 1.2780040183200831], "isController": false}, {"data": ["Login", 2, 0, 0.0, 104.0, 63, 145, 104.0, 145.0, 145.0, 145.0, 13.793103448275861, 888.1061422413794, 39.163523706896555], "isController": true}, {"data": ["Login ", 2, 0, 0.0, 54.5, 38, 71, 54.5, 71.0, 71.0, 71.0, 1.070090957731407, 40.518199906367045, 2.5743838616907437], "isController": false}, {"data": ["LogOut-0", 2, 0, 0.0, 10.5, 4, 17, 10.5, 17.0, 17.0, 17.0, 2.5641025641025643, 1.3146033653846154, 3.0724158653846154], "isController": false}, {"data": ["LogOut-1", 2, 0, 0.0, 18.0, 8, 28, 18.0, 28.0, 28.0, 28.0, 2.5974025974025974, 68.89204545454545, 1.0856331168831168], "isController": false}, {"data": ["Add User ", 4, 0, 0.0, 14.5, 7, 20, 15.5, 20.0, 20.0, 20.0, 0.4985666209647265, 0.23759815530350245, 0.7483368129128755], "isController": true}, {"data": ["LogOut", 4, 0, 0.0, 31.0, 14, 48, 31.0, 48.0, 48.0, 48.0, 1.75054704595186, 47.328022428884026, 2.829253282275711], "isController": false}, {"data": ["User List", 6, 0, 0.0, 12.333333333333332, 11, 14, 12.0, 14.0, 14.0, 14.0, 0.4081910334036329, 2.1349640069052316, 0.5030635587454929], "isController": false}, {"data": ["Manage User", 2, 0, 0.0, 103.5, 88, 119, 103.5, 119.0, 119.0, 119.0, 1.0610079575596816, 25.944442141909814, 12.76525198938992], "isController": true}, {"data": ["Open Admin Page", 6, 0, 0.0, 6.833333333333333, 2, 12, 7.0, 12.0, 12.0, 12.0, 0.41453641011468845, 1.0544230171341715, 0.48133182776012157], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 28, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
