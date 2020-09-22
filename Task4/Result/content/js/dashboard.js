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

    var data = {"OkPercent": 99.89568120175255, "KoPercent": 0.1043187982474442};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9975609756097561, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.982078853046595, 500, 1500, "Add User"], "isController": false}, {"data": [1.0, 500, 1500, "Open Home Page"], "isController": false}, {"data": [1.0, 500, 1500, "T_Delete User"], "isController": true}, {"data": [1.0, 500, 1500, "Delete User"], "isController": false}, {"data": [0.9931506849315068, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "Login "], "isController": false}, {"data": [1.0, 500, 1500, "LogOut-0"], "isController": false}, {"data": [1.0, 500, 1500, "LogOut-1"], "isController": false}, {"data": [1.0, 500, 1500, "LogOut"], "isController": false}, {"data": [1.0, 500, 1500, "User List"], "isController": false}, {"data": [0.9609375, 500, 1500, "Manage User"], "isController": true}, {"data": [0.982078853046595, 500, 1500, "T_Add User"], "isController": true}, {"data": [1.0, 500, 1500, "Open Admin Page"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4793, 5, 0.1043187982474442, 9.507823909868584, 0, 1905, 6.0, 17.0, 26.0, 37.0, 8.005759202530843, 52.62079607080162, 10.95093614705509], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Add User", 279, 5, 1.7921146953405018, 11.272401433691758, 3, 19, 12.0, 14.0, 15.0, 18.19999999999999, 0.4864703697697897, 0.2327887813001836, 0.7329152483396365], "isController": false}, {"data": ["Open Home Page", 146, 0, 0.0, 21.01369863013699, 5, 70, 19.0, 32.0, 34.650000000000006, 56.37000000000003, 0.24426683977266453, 6.478796258032782, 0.10591257505767876], "isController": false}, {"data": ["T_Delete User", 1093, 0, 0.0, 7.000000000000003, 0, 18, 6.0, 13.0, 13.0, 16.0, 1.8466144275833174, 0.3264051766448046, 3.4036427183330122], "isController": true}, {"data": ["Delete User", 1087, 0, 0.0, 7.0386384544618235, 2, 18, 6.0, 13.0, 13.0, 16.0, 1.8445175237649198, 0.3278341692629057, 3.4185437697475374], "isController": false}, {"data": ["Login", 146, 0, 0.0, 64.57534246575344, 16, 1905, 52.0, 67.60000000000002, 78.30000000000001, 1067.460000000002, 0.24375747133345355, 15.631764700265963, 0.6880983327656789], "isController": true}, {"data": ["Login ", 145, 0, 0.0, 30.83448275862069, 10, 54, 32.0, 44.400000000000006, 48.69999999999999, 53.53999999999999, 0.24434839024965668, 9.252070444482362, 0.5878448261334817], "isController": false}, {"data": ["LogOut-0", 126, 0, 0.0, 5.007936507936507, 2, 10, 5.0, 6.0, 6.0, 9.460000000000008, 0.23613635937704977, 0.12106600456342884, 0.28294854780824225], "isController": false}, {"data": ["LogOut-1", 126, 0, 0.0, 20.690476190476186, 5, 64, 19.0, 32.0, 32.64999999999999, 56.71000000000011, 0.23612662383904412, 6.262889749480896, 0.09869354980772548], "isController": false}, {"data": ["LogOut", 254, 0, 0.0, 26.200787401574807, 0, 71, 25.0, 37.0, 39.0, 55.14999999999969, 0.47282380053537054, 12.68267094953816, 0.7581658089754616], "isController": false}, {"data": ["User List", 1372, 0, 0.0, 9.687317784256551, 3, 21, 10.0, 13.0, 14.0, 17.0, 2.3170822327755674, 21.122363886196133, 2.8714622591720653], "isController": false}, {"data": ["Manage User", 128, 5, 3.90625, 215.17968749999997, 174, 283, 215.0, 237.20000000000002, 244.55, 281.84, 0.23936866514567828, 26.672844951518496, 10.009000431284361], "isController": true}, {"data": ["T_Add User", 279, 5, 1.7921146953405018, 11.272401433691758, 3, 19, 12.0, 14.0, 15.0, 18.19999999999999, 0.4858434957048997, 0.23248880568262753, 0.7319708011759503], "isController": true}, {"data": ["Open Admin Page", 1379, 0, 0.0, 3.9702683103698306, 1, 18, 4.0, 5.0, 5.0, 7.0, 2.324229119439084, 4.159042111378441, 2.6987386943487017], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 5, 100.0, 0.1043187982474442], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4793, 5, "500\/Internal Server Error", 5, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Add User", 279, 5, "500\/Internal Server Error", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
