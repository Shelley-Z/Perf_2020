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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.98989898989899, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Comment"], "isController": false}, {"data": [1.0, 500, 1500, "OpenLargeCalendar"], "isController": false}, {"data": [1.0, 500, 1500, "OpenRandomPagebyPager"], "isController": false}, {"data": [1.0, 500, 1500, "Search by Name"], "isController": true}, {"data": [1.0, 500, 1500, "SearchName"], "isController": false}, {"data": [1.0, 500, 1500, "OpenFirstPost"], "isController": false}, {"data": [0.9888888888888889, 500, 1500, "Open to Home page"], "isController": true}, {"data": [1.0, 500, 1500, "OpenPagebyDefineDate"], "isController": false}, {"data": [1.0, 500, 1500, "Open Predefined Date"], "isController": true}, {"data": [1.0, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.99, 500, 1500, "HomePage"], "isController": false}, {"data": [1.0, 500, 1500, "OpenContact"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "OpenPagebyRandomDate"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "Open Random Date"], "isController": true}, {"data": [1.0, 500, 1500, "Open Home page"], "isController": true}, {"data": [1.0, 500, 1500, "Open Large Calendar"], "isController": true}, {"data": [1.0, 500, 1500, "OpenRandomPost"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 110, 0, 0.0, 73.55454545454545, 0, 1429, 28.5, 129.9, 168.69999999999948, 1346.8300000000004, 0.6202214754505063, 14.24529354095717, 0.32948715260549405], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Comment", 6, 0, 0.0, 47.5, 32, 69, 42.0, 69.0, 69.0, 69.0, 0.06385016494625945, 0.1514570807172502, 0.14435915385229328], "isController": false}, {"data": ["OpenLargeCalendar", 8, 0, 0.0, 50.75, 22, 123, 25.5, 123.0, 123.0, 123.0, 0.057317265393268084, 1.1155036933812887, 0.024908381933597946], "isController": false}, {"data": ["OpenRandomPagebyPager", 9, 0, 0.0, 84.22222222222223, 24, 250, 36.0, 250.0, 250.0, 250.0, 0.06375834171637457, 1.637965358410434, 0.03007351469629777], "isController": false}, {"data": ["Search by Name", 6, 0, 0.0, 56.5, 17, 194, 30.5, 194.0, 194.0, 194.0, 0.06347594261774787, 1.3315690657928145, 0.02671692506664974], "isController": true}, {"data": ["SearchName", 6, 0, 0.0, 56.5, 17, 194, 30.5, 194.0, 194.0, 194.0, 0.06383793675788398, 1.339162812007916, 0.026869287834617187], "isController": false}, {"data": ["OpenFirstPost", 4, 0, 0.0, 51.75, 23, 129, 27.5, 129.0, 129.0, 129.0, 0.059221532949380394, 1.448787716713797, 0.024810583628207213], "isController": false}, {"data": ["Open to Home page", 45, 0, 0.0, 90.35555555555557, 0, 1429, 28.0, 129.4, 263.9999999999992, 1429.0, 0.2512562814070352, 6.357710863344501, 0.10652219430485763], "isController": true}, {"data": ["OpenPagebyDefineDate", 8, 0, 0.0, 38.25000000000001, 21, 126, 26.0, 126.0, 126.0, 126.0, 0.05107774032076821, 1.3066224684594954, 0.022346511390336093], "isController": false}, {"data": ["Open Predefined Date", 8, 0, 0.0, 38.25000000000001, 21, 126, 26.0, 126.0, 126.0, 126.0, 0.05127284846309636, 1.3116135405183686, 0.02243187120260466], "isController": true}, {"data": ["Open Contacts", 9, 0, 0.0, 64.66666666666667, 20, 148, 32.0, 148.0, 148.0, 148.0, 0.05424595114248, 1.0829059895064221, 0.023308807131534378], "isController": true}, {"data": ["HomePage", 50, 0, 0.0, 86.00000000000006, 19, 1429, 28.0, 129.0, 216.4999999999992, 1429.0, 0.2849084019487735, 7.373084436166272, 0.12353450240747599], "isController": false}, {"data": ["OpenContact", 9, 0, 0.0, 64.66666666666667, 20, 148, 32.0, 148.0, 148.0, 148.0, 0.0542080504978106, 1.08214938308227, 0.023292521698277995], "isController": false}, {"data": ["OpenPagebyRandomDate", 7, 0, 0.0, 117.28571428571429, 20, 682, 23.0, 682.0, 682.0, 682.0, 0.05204654448120748, 1.2969958223354028, 0.02277036321052827], "isController": false}, {"data": ["Open Random Date", 7, 0, 0.0, 117.28571428571429, 20, 682, 23.0, 682.0, 682.0, 682.0, 0.051952678531668864, 1.294656690206178, 0.02272929685760513], "isController": true}, {"data": ["Open Home page", 6, 0, 0.0, 39.0, 22, 82, 27.5, 82.0, 82.0, 82.0, 0.08120618249736081, 2.101527183769591, 0.03521049319221504], "isController": true}, {"data": ["Open Large Calendar", 8, 0, 0.0, 50.75, 22, 123, 25.5, 123.0, 123.0, 123.0, 0.05736658683149999, 1.116463582973597, 0.024929815566423336], "isController": true}, {"data": ["OpenRandomPost", 2, 0, 0.0, 43.5, 26, 61, 43.5, 61.0, 61.0, 61.0, 0.02108926029419518, 0.5159969453524543, 0.008845544234723468], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 110, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
