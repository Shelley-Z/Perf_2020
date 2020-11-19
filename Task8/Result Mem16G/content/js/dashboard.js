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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9946564885496183, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9921875, 500, 1500, "Anonymous - Open Contacts"], "isController": true}, {"data": [0.0, 500, 1500, "Editor - Login"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open Predefined Date"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Search by Name"], "isController": true}, {"data": [0.0, 500, 1500, "Admin- Open Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "Editor - Edit Post"], "isController": true}, {"data": [0.9794921875, 500, 1500, "Anonymous - Open Home page"], "isController": true}, {"data": [0.95, 500, 1500, "Admin - User List"], "isController": false}, {"data": [0.0, 500, 1500, "Admin - Login"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open Random Page"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - LogOut"], "isController": true}, {"data": [1.0, 500, 1500, "Editor -  Get Post Content"], "isController": false}, {"data": [1.0, 500, 1500, "Anonymous - Open Random Date"], "isController": true}, {"data": [1.0, 500, 1500, "Editor - Open Page by Predefined Date"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open First Post"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - Delete User"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Add User"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open Large Calendar"], "isController": true}, {"data": [0.995475113122172, 500, 1500, "Anonymous - Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Editor - Open Random Post"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Open Admin Page"], "isController": false}, {"data": [0.0, 500, 1500, "Editor - Open Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "Anonymous - Open Random Post"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1972, 0, 0.0, 31.496450304259707, 2, 6519, 18.0, 29.0, 31.0, 74.53999999999996, 6.108724137824216, 122.88286470159564, 4.288840867077942], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Anonymous - Open Contacts", 64, 0, 0.0, 27.10937500000001, 6, 823, 14.0, 22.0, 22.75, 823.0, 0.5148336443786602, 10.011030398815079, 0.24703153657732158], "isController": true}, {"data": ["Editor - Login", 2, 0, 0.0, 2236.5, 2233, 2240, 2236.5, 2240.0, 2240.0, 2240.0, 0.8928571428571428, 27.843366350446427, 2.1475655691964284], "isController": true}, {"data": ["Anonymous - Open Predefined Date", 416, 0, 0.0, 16.822115384615383, 5, 36, 16.5, 25.0, 26.0, 30.829999999999984, 2.135304383533518, 56.00504732734063, 1.0417268183451391], "isController": true}, {"data": ["Anonymous - Search by Name", 384, 0, 0.0, 18.471354166666675, 6, 62, 19.0, 26.5, 28.0, 33.299999999999955, 2.101633691815122, 54.75419155173358, 0.9956485339189448], "isController": true}, {"data": ["Admin- Open Login Page", 2, 0, 0.0, 5586.5, 4654, 6519, 5586.5, 6519.0, 6519.0, 6519.0, 0.3067484662576687, 1.3608967599693251, 0.13839628067484663], "isController": false}, {"data": ["Editor - Edit Post", 100, 0, 0.0, 6.410000000000003, 2, 56, 5.0, 7.900000000000006, 19.94999999999999, 55.87999999999994, 0.32518527431003813, 0.05779660148869819, 0.6292366814273682], "isController": true}, {"data": ["Anonymous - Open Home page", 512, 1, 0.1953125, 147.0449218749999, 6, 10061, 21.5, 32.0, 37.0, 6563.360000000003, 2.485907526182141, 63.278263808136, 1.1930637808857016], "isController": true}, {"data": ["Admin - User List", 20, 0, 0.0, 72.95, 3, 724, 10.0, 515.9000000000012, 716.3499999999999, 724.0, 0.4516915849857717, 2.949206399058223, 0.5597623255341253], "isController": false}, {"data": ["Admin - Login", 2, 0, 0.0, 2033.5, 1733, 2334, 2033.5, 2334.0, 2334.0, 2334.0, 0.8568980291345331, 32.08011996572408, 2.0476850364181662], "isController": true}, {"data": ["Anonymous - Open Random Page", 500, 0, 0.0, 19.021999999999977, 5, 56, 19.0, 30.0, 31.94999999999999, 36.99000000000001, 2.5329922237138733, 65.68745903676638, 1.1997131782086679], "isController": false}, {"data": ["Admin - LogOut", 2, 0, 0.0, 16.5, 13, 20, 16.5, 20.0, 20.0, 20.0, 24.390243902439025, 634.3368902439024, 39.41977896341463], "isController": true}, {"data": ["Editor -  Get Post Content", 100, 0, 0.0, 4.780000000000003, 2, 31, 5.0, 6.0, 7.0, 30.769999999999882, 0.3242342397841897, 0.2523929246820073, 0.42112454971969954], "isController": false}, {"data": ["Anonymous - Open Random Date", 128, 0, 0.0, 18.859375, 6, 169, 17.0, 26.0, 37.949999999999974, 137.67999999999932, 0.8039746496743274, 19.4003047880459, 0.3916702063011513], "isController": true}, {"data": ["Editor - Open Page by Predefined Date", 100, 0, 0.0, 23.410000000000014, 8, 51, 27.0, 31.0, 34.94999999999999, 50.97999999999999, 0.32428891548058, 9.938872552834772, 0.3869932174973327], "isController": true}, {"data": ["Anonymous - Open First Post", 670, 0, 0.0, 19.195522388059693, 6, 74, 18.0, 28.0, 29.0, 38.0, 3.463087109562772, 81.03697027204618, 1.447951811724359], "isController": false}, {"data": ["Admin - Delete User", 10, 0, 0.0, 13.7, 6, 31, 12.0, 29.900000000000006, 31.0, 31.0, 0.23994625203954315, 0.04264669713984067, 0.4433381922449371], "isController": true}, {"data": ["Admin - Add User", 10, 0, 0.0, 10.7, 4, 18, 12.5, 17.5, 18.0, 18.0, 0.23988869164707574, 0.11453279428345248, 0.36027814344144315], "isController": true}, {"data": ["Anonymous - Open Large Calendar", 128, 0, 0.0, 18.7890625, 6, 52, 17.0, 29.0, 30.0, 46.48999999999988, 0.7878086609714665, 14.957347306294468, 0.3830012778810409], "isController": true}, {"data": ["Anonymous - Comment", 221, 0, 0.0, 34.48416289592762, 5, 876, 20.0, 36.0, 83.39999999999986, 676.2000000000003, 1.1848404754373454, 2.8140694277649407, 2.707728864201734], "isController": false}, {"data": ["Editor - Open Random Post", 100, 0, 0.0, 62.23000000000001, 9, 192, 61.0, 92.80000000000001, 98.94999999999999, 191.37999999999968, 0.3238992284720378, 67.08982919983934, 0.3814387877018702], "isController": true}, {"data": ["Admin - Open Admin Page", 20, 0, 0.0, 7.2, 3, 52, 4.0, 19.500000000000032, 50.449999999999974, 52.0, 0.45065344749887337, 0.9073361452230734, 0.5232685049571879], "isController": false}, {"data": ["Editor - Open Login Page", 2, 0, 0.0, 5247.5, 4001, 6494, 5247.5, 6494.0, 6494.0, 6494.0, 0.30792917628945343, 1.3661350076982295, 0.13892898383371824], "isController": false}, {"data": ["Anonymous - Open Random Post", 437, 0, 0.0, 19.151029748283754, 6, 42, 19.0, 28.0, 30.0, 31.620000000000005, 2.2314475814069863, 52.25177100407482, 0.933483186910543], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1972, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
