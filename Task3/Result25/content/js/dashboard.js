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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9971193006854078, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9957264957264957, 500, 1500, "Comment"], "isController": false}, {"data": [0.9968487394957983, 500, 1500, "OpenRandomPagebyPager"], "isController": false}, {"data": [0.9973684210526316, 500, 1500, "OpenLargeCalendar"], "isController": false}, {"data": [0.9971830985915493, 500, 1500, "Search by Name"], "isController": true}, {"data": [0.9971751412429378, 500, 1500, "SearchName"], "isController": false}, {"data": [0.9971751412429378, 500, 1500, "OpenFirstPost"], "isController": false}, {"data": [0.996638278798745, 500, 1500, "Open to Home page"], "isController": true}, {"data": [0.9986876640419947, 500, 1500, "OpenPagebyDefineDate"], "isController": false}, {"data": [0.9986876640419947, 500, 1500, "Open Predefined Date"], "isController": true}, {"data": [0.9960732984293194, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.9970986460348162, 500, 1500, "HomePage"], "isController": false}, {"data": [0.9960629921259843, 500, 1500, "OpenContact"], "isController": false}, {"data": [0.998587570621469, 500, 1500, "OpenPagebyRandomDate"], "isController": false}, {"data": [0.9985915492957746, 500, 1500, "Open Random Date"], "isController": true}, {"data": [0.9958904109589041, 500, 1500, "Open Home page"], "isController": true}, {"data": [0.9973890339425587, 500, 1500, "Open Large Calendar"], "isController": true}, {"data": [1.0, 500, 1500, "OpenRandomPost"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5628, 0, 0.0, 63.5836886993605, 0, 2066, 35.0, 130.0, 138.55000000000018, 344.1300000000001, 6.265376779810079, 143.41039538153896, 3.450506337877253], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Comment", 351, 0, 0.0, 55.327635327635356, 31, 882, 39.0, 91.80000000000001, 124.39999999999998, 434.2800000000034, 0.40822592688220066, 0.09767124227162027, 0.9360220346049978], "isController": false}, {"data": ["OpenRandomPagebyPager", 476, 0, 0.0, 62.99369747899158, 16, 882, 36.0, 129.0, 139.0, 324.46000000000004, 0.5333835341365462, 13.546126776567766, 0.25133120897372974], "isController": false}, {"data": ["OpenLargeCalendar", 380, 0, 0.0, 55.89473684210523, 14, 688, 32.0, 125.0, 133.0, 321.22999999999973, 0.4418933502028058, 8.600090406437223, 0.19246526776411266], "isController": false}, {"data": ["Search by Name", 355, 0, 0.0, 57.554929577464776, 0, 1257, 31.0, 126.40000000000003, 133.2, 350.1199999999997, 0.4097830804606193, 8.57202581532404, 0.1723902589367341], "isController": true}, {"data": ["SearchName", 354, 0, 0.0, 57.71468926553672, 16, 1257, 31.0, 126.5, 133.25, 351.3499999999986, 0.4102411963282254, 8.60585072102208, 0.17307050470097007], "isController": false}, {"data": ["OpenFirstPost", 177, 0, 0.0, 63.66666666666668, 17, 1201, 33.0, 130.0, 142.29999999999998, 516.159999999999, 0.205644655330263, 5.032068484971094, 0.08655551410873374], "isController": false}, {"data": ["Open to Home page", 2231, 0, 0.0, 66.64813984760184, 0, 2066, 36.0, 132.0, 140.0, 321.4399999999987, 2.478429002618403, 63.88029075438224, 1.0702961922621024], "isController": true}, {"data": ["OpenPagebyDefineDate", 381, 0, 0.0, 63.39107611548555, 15, 937, 34.0, 128.0, 134.0, 440.26000000000005, 0.4319727891156463, 11.050319541879253, 0.18898809523809523], "isController": false}, {"data": ["Open Predefined Date", 381, 0, 0.0, 63.39107611548555, 15, 937, 34.0, 128.0, 134.0, 440.26000000000005, 0.43204969592092923, 11.052286899071037, 0.18902174196540655], "isController": true}, {"data": ["Open Contacts", 382, 0, 0.0, 60.41884816753927, 0, 885, 31.0, 128.0, 138.84999999999997, 524.3600000000065, 0.43674313101379286, 8.695831650528895, 0.18717179954176272], "isController": true}, {"data": ["HomePage", 2585, 0, 0.0, 66.22437137330752, 15, 1571, 36.0, 132.0, 140.0, 330.4199999999996, 2.877753904727977, 74.47312351102676, 1.2477761071281464], "isController": false}, {"data": ["OpenContact", 381, 0, 0.0, 60.57480314960628, 16, 885, 31.0, 128.0, 138.89999999999998, 528.4400000000028, 0.43677884202018813, 8.71936825056317, 0.18767840868054958], "isController": false}, {"data": ["OpenPagebyRandomDate", 354, 0, 0.0, 63.2994350282486, 17, 857, 34.0, 131.0, 153.25, 403.44999999999953, 0.3984606362538397, 10.004643563101983, 0.17432652836105486], "isController": false}, {"data": ["Open Random Date", 355, 0, 0.0, 63.126760563380266, 0, 857, 34.0, 131.0, 153.2, 403.0399999999999, 0.3984506443115278, 9.976211295219938, 0.17383110855703623], "isController": true}, {"data": ["Open Home page", 365, 0, 0.0, 69.01643835616446, 0, 1622, 36.0, 133.0, 141.7, 375.15999999999815, 0.4064035843682707, 10.45965132660151, 0.17524849769853093], "isController": true}, {"data": ["Open Large Calendar", 383, 0, 0.0, 55.45953002610964, 0, 688, 32.0, 125.0, 133.0, 317.7199999999963, 0.44382898098951845, 8.570102780304653, 0.19179416127331406], "isController": true}, {"data": ["OpenRandomPost", 176, 0, 0.0, 62.426136363636374, 18, 354, 36.5, 130.0, 134.0, 270.8399999999989, 0.2095577379194727, 5.127603109327819, 0.08817461815246277], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5628, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
