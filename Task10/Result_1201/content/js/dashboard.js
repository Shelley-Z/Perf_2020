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

    var data = {"OkPercent": 50.03522229179712, "KoPercent": 49.96477770820288};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.09456498388829215, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.04979378942261038, 500, 1500, "Anonymous - Open Contacts"], "isController": true}, {"data": [0.049019607843137254, 500, 1500, "Editor - Login"], "isController": true}, {"data": [0.049771514073115496, 500, 1500, "Anonymous - Open Predefined Date"], "isController": true}, {"data": [0.049714875030332444, 500, 1500, "Anonymous - Search by Name"], "isController": true}, {"data": [0.1021021021021021, 500, 1500, "Admin- Open Login Page"], "isController": false}, {"data": [0.9932885906040269, 500, 1500, "Editor - Edit Post"], "isController": true}, {"data": [0.04973889915993643, 500, 1500, "Anonymous - Open Home page"], "isController": true}, {"data": [0.10024081878386513, 500, 1500, "Admin - User List"], "isController": false}, {"data": [0.1036036036036036, 500, 1500, "Admin - Login"], "isController": true}, {"data": [0.999330207635633, 500, 1500, "Anonymous - Open Random Page"], "isController": false}, {"data": [0.09939759036144578, 500, 1500, "Admin - LogOut"], "isController": true}, {"data": [0.04997877115302966, 500, 1500, "Anonymous - Open Random Date"], "isController": true}, {"data": [0.9932885906040269, 500, 1500, "Editor -  Get Post Content"], "isController": false}, {"data": [0.04269618501680174, 500, 1500, "Editor - Open Page by Predefined Date"], "isController": true}, {"data": [0.9988975992160706, 500, 1500, "Anonymous - Open First Post"], "isController": false}, {"data": [0.9970845481049563, 500, 1500, "Admin - Delete User"], "isController": true}, {"data": [0.051261704491350576, 500, 1500, "Admin - Add User"], "isController": true}, {"data": [0.0498604876865219, 500, 1500, "Anonymous - Open Large Calendar"], "isController": true}, {"data": [0.8701780415430267, 500, 1500, "Anonymous - Comment"], "isController": false}, {"data": [0.003756425464610518, 500, 1500, "Editor - Open Random Post"], "isController": true}, {"data": [0.10024081878386513, 500, 1500, "Admin - Open Admin Page"], "isController": false}, {"data": [0.049019607843137254, 500, 1500, "Editor - Open Login Page"], "isController": false}, {"data": [0.9981174698795181, 500, 1500, "Anonymous - Open Random Post"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 25552, 12767, 49.96477770820288, 107.69223544145305, 0, 10008, 72.0, 161.0, 177.0, 785.9900000000016, 1.4196432579612697, 13.906186784289119, 1.370210570873184], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Anonymous - Open Contacts", 8244, 7833, 95.01455604075691, 139.60019408054336, 1, 10007, 102.0, 164.0, 176.0, 189.0, 0.4588349776960785, 0.6675552427343615, 0.2239820332906928], "isController": true}, {"data": ["Editor - Login", 204, 194, 95.09803921568627, 102.74509803921563, 9, 196, 109.0, 163.5, 173.75, 191.89999999999998, 0.011352070556457353, 0.02224771283949786, 0.018219960209323278], "isController": true}, {"data": ["Anonymous - Open Predefined Date", 49456, 46994, 95.02183759301197, 142.94154399870624, 0, 10007, 107.0, 164.0, 175.0, 188.0, 2.7483811387120562, 4.90002502722276, 1.3630115385563317], "isController": true}, {"data": ["Anonymous - Search by Name", 49452, 46993, 95.02750141551404, 142.6479414381625, 0, 10009, 107.0, 165.0, 175.0, 187.0, 2.7488627700356614, 4.870034394310223, 1.3202953615581112], "isController": true}, {"data": ["Admin- Open Login Page", 666, 598, 89.7897897897898, 122.2372372372373, 2, 10005, 98.5, 163.0, 172.64999999999998, 187.33000000000004, 0.03700473455020384, 0.03363060493239774, 0.04167590511719361], "isController": false}, {"data": ["Editor - Edit Post", 298, 2, 0.6711409395973155, 70.83892617449665, 1, 10004, 3.0, 6.0, 10.050000000000011, 131.7199999999093, 0.17804480515445686, 0.03442429839592385, 0.3425381059946132], "isController": true}, {"data": ["Anonymous - Open Home page", 61662, 58590, 95.01800136226525, 142.3746553793275, 0, 10011, 106.0, 164.0, 175.0, 188.0, 3.4256938819013953, 5.993413119979925, 1.6853547520544192], "isController": true}, {"data": ["Admin - User List", 6644, 5978, 89.97591812161349, 135.56155930162566, 2, 10008, 98.0, 163.0, 175.0, 189.0, 0.3692594097929663, 0.4146937265978931, 0.45581685017416157], "isController": false}, {"data": ["Admin - Login", 666, 597, 89.63963963963964, 124.77777777777793, 0, 10006, 95.0, 161.0, 175.64999999999998, 190.0, 0.03700476950362491, 0.15841511195818017, 0.05969741872633028], "isController": true}, {"data": ["Anonymous - Open Random Page", 2986, 2, 0.06697923643670463, 19.602813127930332, 4, 10002, 9.0, 21.0, 27.0, 49.13000000000011, 1.7862077959057197, 46.206082219620406, 0.8597469786334014], "isController": false}, {"data": ["Admin - LogOut", 664, 598, 90.06024096385542, 122.90662650602407, 4, 10004, 99.0, 165.5, 175.0, 186.35000000000002, 0.03700055038318695, 0.11290403937557894, 0.045739270474246196], "isController": true}, {"data": ["Anonymous - Open Random Date", 16487, 15663, 95.00212288469703, 140.7994177230543, 0, 10008, 102.0, 164.0, 176.0, 189.0, 0.9166131137108965, 1.5344124854185295, 0.45460051128131307], "isController": true}, {"data": ["Editor -  Get Post Content", 298, 2, 0.6711409395973155, 70.98322147651007, 2, 10001, 3.0, 6.0, 7.0, 119.80999999990922, 0.17909956192727955, 0.14125970848841773, 0.23105834318481092], "isController": false}, {"data": ["Editor - Open Page by Predefined Date", 10118, 9686, 95.73038149831983, 141.69934769717304, 0, 10006, 102.0, 164.0, 175.0, 189.0, 0.5622222749486968, 1.0053755971632115, 0.6680818559138999], "isController": true}, {"data": ["Anonymous - Open First Post", 4082, 3, 0.07349338559529642, 41.55414012738855, 6, 10002, 29.0, 53.0, 62.0, 76.0, 2.4410094369353073, 56.993670664016456, 1.0402493909436277], "isController": false}, {"data": ["Admin - Delete User", 343, 1, 0.2915451895043732, 36.62390670553936, 2, 10001, 5.0, 11.0, 13.0, 112.40000000000015, 0.20572651448902454, 0.037959878231495714, 0.37889766556635973], "isController": true}, {"data": ["Admin - Add User", 6301, 5978, 94.87382955086494, 141.08300269798465, 0, 10006, 101.0, 164.0, 175.0, 189.0, 0.3503317921736845, 0.17784047678191475, 0.5239725599155768], "isController": true}, {"data": ["Anonymous - Open Large Calendar", 16486, 15664, 95.0139512313478, 139.95365764891403, 0, 10006, 102.0, 164.0, 175.0, 189.0, 0.9166289139654303, 1.3052776439776268, 0.4528353156073003], "isController": true}, {"data": ["Anonymous - Comment", 1348, 5, 0.37091988130563797, 351.86721068249255, 5, 10003, 158.0, 894.0, 1031.55, 1160.02, 0.8024334926691629, 1.8497328136068432, 1.8363704710576287], "isController": false}, {"data": ["Editor - Open Random Post", 10116, 9687, 95.75919335705812, 250.52075919335786, 1, 10005, 108.0, 172.0, 188.0, 3247.9799999999996, 0.5622002369844059, 149.18626185545514, 0.6595024166489243], "isController": true}, {"data": ["Admin - Open Admin Page", 6644, 5978, 89.97591812161349, 133.71748946417782, 1, 10004, 98.0, 163.0, 175.0, 188.0, 0.3692611131810878, 0.2357081630882501, 0.4270833214650863], "isController": false}, {"data": ["Editor - Open Login Page", 204, 194, 95.09803921568627, 102.48529411764703, 3, 191, 107.0, 167.0, 178.5, 190.89999999999998, 0.011351969483234978, 0.007877080846612077, 0.013618059439246094], "isController": false}, {"data": ["Anonymous - Open Random Post", 2656, 4, 0.15060240963855423, 49.790286144578346, 7, 10004, 29.0, 53.0, 63.0, 83.0, 1.5925762919595285, 37.147246164228136, 0.6799945401346015], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503\/Service Unavailable", 12694, 99.42821336257539, 49.679085785848464], "isController": false}, {"data": ["503", 3, 0.02349808099005248, 0.011740763932373199], "isController": false}, {"data": ["404\/Not Found", 2, 0.01566538732670165, 0.007827175954915467], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 68, 0.5326231691078562, 0.2661239824671259], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 25552, 12767, "503\/Service Unavailable", 12694, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 68, "503", 3, "404\/Not Found", 2, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Open Predefined Date", 4, 2, "503", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Anonymous - Search by Name", 8, 1, "503", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Admin- Open Login Page", 666, 598, "503\/Service Unavailable", 596, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Admin - User List", 6644, 5978, "503\/Service Unavailable", 5952, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 26, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Open Random Page", 2986, 2, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Editor -  Get Post Content", 298, 2, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Open First Post", 4082, 3, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Comment", 1348, 5, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 3, "404\/Not Found", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Admin - Open Admin Page", 6644, 5978, "503\/Service Unavailable", 5952, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 26, null, null, null, null, null, null], "isController": false}, {"data": ["Editor - Open Login Page", 204, 194, "503\/Service Unavailable", 194, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Anonymous - Open Random Post", 2656, 4, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 4, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
