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

    var data = {"OkPercent": 99.94910941475827, "KoPercent": 0.05089058524173028};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9955391282182003, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Anonymous - Open Contacts"], "isController": true}, {"data": [1.0, 500, 1500, "Editor - Login"], "isController": true}, {"data": [0.9951923076923077, 500, 1500, "Anonymous - Open Predefined Date"], "isController": true}, {"data": [0.9947916666666666, 500, 1500, "Anonymous - Search by Name"], "isController": true}, {"data": [0.75, 500, 1500, "Admin- Open Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "Editor - Edit Post"], "isController": true}, {"data": [0.99609375, 500, 1500, "Anonymous - Open Home page"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - User List"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - Login"], "isController": true}, {"data": [0.9969818913480886, 500, 1500, "Anonymous - Open Random Page"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - LogOut"], "isController": true}, {"data": [1.0, 500, 1500, "Editor -  Get Post Content"], "isController": false}, {"data": [0.98828125, 500, 1500, "Anonymous - Open Random Date"], "isController": true}, {"data": [0.9970014992503748, 500, 1500, "Anonymous - Open First Post"], "isController": false}, {"data": [0.995, 500, 1500, "Editor - Open Page by Predefined Date"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Add User"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Delete User"], "isController": true}, {"data": [0.99609375, 500, 1500, "Anonymous - Open Large Calendar"], "isController": true}, {"data": [0.9886877828054299, 500, 1500, "Anonymous - Comment"], "isController": false}, {"data": [0.985, 500, 1500, "Editor - Open Random Post"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Open Admin Page"], "isController": false}, {"data": [0.75, 500, 1500, "Editor - Open Login Page"], "isController": false}, {"data": [0.9988532110091743, 500, 1500, "Anonymous - Open Random Post"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1965, 1, 0.05089058524173028, 34.94503816793895, 2, 1213, 16.0, 56.0, 105.69999999999982, 433.3599999999997, 6.168673185892104, 124.01872552347392, 4.3412325721248175], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Anonymous - Open Contacts", 64, 0, 0.0, 32.109374999999986, 10, 406, 12.0, 64.0, 108.5, 406.0, 0.5342147877330929, 10.389823873453699, 0.2583527142702125], "isController": true}, {"data": ["Editor - Login", 2, 0, 0.0, 53.0, 35, 71, 53.0, 71.0, 71.0, 71.0, 2.5839793281653747, 80.58028504521964, 6.222747093023256], "isController": true}, {"data": ["Anonymous - Open Predefined Date", 416, 0, 0.0, 37.478365384615394, 12, 713, 16.0, 69.0, 130.44999999999993, 522.9499999999989, 2.086844851111646, 54.52769360847329, 1.022641373078698], "isController": true}, {"data": ["Anonymous - Search by Name", 384, 0, 0.0, 34.73958333333335, 13, 1144, 16.0, 46.5, 82.75, 526.9499999999997, 2.0692330904858385, 53.75883524472454, 0.9819300785123076], "isController": true}, {"data": ["Admin- Open Login Page", 2, 0, 0.0, 357.0, 7, 707, 357.0, 707.0, 707.0, 707.0, 0.8492569002123143, 3.767748142250531, 0.3831608280254777], "isController": false}, {"data": ["Editor - Edit Post", 100, 0, 0.0, 12.299999999999999, 3, 109, 4.5, 36.80000000000001, 65.84999999999997, 108.86999999999993, 0.3212211543403402, 0.057092041103458904, 0.6213935396804492], "isController": true}, {"data": ["Anonymous - Open Home page", 512, 0, 0.0, 36.824218750000014, 14, 1184, 18.0, 54.69999999999999, 109.39999999999986, 458.87, 2.5274963963430284, 64.42049771192465, 1.2184518035562664], "isController": true}, {"data": ["Admin - User List", 20, 0, 0.0, 40.05, 6, 362, 7.5, 214.80000000000044, 355.6499999999999, 362.0, 0.4678909814013335, 3.1481889329161308, 0.5798375540998948], "isController": false}, {"data": ["Admin - Login", 2, 0, 0.0, 32.0, 30, 34, 32.0, 34.0, 34.0, 34.0, 1.29366106080207, 48.43143596377749, 3.1052918822768434], "isController": true}, {"data": ["Anonymous - Open Random Page", 497, 0, 0.0, 38.66197183098596, 12, 821, 17.0, 58.0, 124.19999999999993, 478.39999999999964, 2.4697124797503456, 63.9971389598386, 1.1691448294432463], "isController": false}, {"data": ["Admin - LogOut", 2, 0, 0.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 21.0, 2.6954177897574128, 70.1019204851752, 4.3563637129380055], "isController": true}, {"data": ["Editor -  Get Post Content", 100, 0, 0.0, 10.1, 2, 107, 4.0, 26.700000000000017, 37.74999999999994, 106.88999999999994, 0.32112934768995605, 0.24999480673633032, 0.41709182854261867], "isController": false}, {"data": ["Anonymous - Open Random Date", 128, 0, 0.0, 39.71875, 9, 916, 15.0, 59.70000000000006, 91.64999999999999, 855.9699999999987, 0.7885755122660457, 18.703465910666097, 0.383795235278897], "isController": true}, {"data": ["Anonymous - Open First Post", 667, 0, 0.0, 33.18290854572711, 12, 1051, 16.0, 50.600000000000136, 92.80000000000007, 433.2800000000002, 3.280300981139499, 76.78767105392579, 1.3744972505348316], "isController": false}, {"data": ["Editor - Open Page by Predefined Date", 100, 0, 0.0, 33.490000000000016, 15, 515, 18.0, 59.80000000000001, 73.89999999999998, 513.1899999999991, 0.3209644339310761, 9.808638622332385, 0.3830259162732178], "isController": true}, {"data": ["Admin - Add User", 10, 0, 0.0, 8.6, 5, 14, 8.0, 13.9, 14.0, 14.0, 0.2746875429199286, 0.13112038181568467, 0.4125141635764318], "isController": true}, {"data": ["Admin - Delete User", 10, 0, 0.0, 7.5, 6, 19, 6.0, 17.800000000000004, 19.0, 19.0, 0.2751031636863824, 0.04889528885832187, 0.5082960797799174], "isController": true}, {"data": ["Anonymous - Open Large Calendar", 128, 0, 0.0, 36.999999999999986, 12, 507, 15.0, 50.80000000000015, 176.34999999999968, 488.1499999999996, 0.7878038122318851, 14.957255248050492, 0.38337156951445434], "isController": true}, {"data": ["Anonymous - Comment", 221, 1, 0.45248868778280543, 37.669683257918564, 7, 1040, 12.0, 89.40000000000015, 113.79999999999995, 667.82, 1.0973896031024841, 2.6071149701817893, 2.5084680320105073], "isController": false}, {"data": ["Editor - Open Random Post", 100, 0, 0.0, 155.87999999999997, 15, 1276, 128.0, 338.2000000000001, 475.1999999999998, 1271.5299999999977, 0.32062277768337216, 64.06727865706348, 0.3775834180311838], "isController": true}, {"data": ["Admin - Open Admin Page", 20, 0, 0.0, 12.599999999999998, 3, 94, 5.0, 24.700000000000006, 90.54999999999995, 94.0, 0.47332796894968526, 0.9529885484214513, 0.5495966358214607], "isController": false}, {"data": ["Editor - Open Login Page", 2, 0, 0.0, 350.5, 7, 694, 350.5, 694.0, 694.0, 694.0, 1.277139208173691, 5.666058030012771, 0.5762092911877394], "isController": false}, {"data": ["Anonymous - Open Random Post", 436, 0, 0.0, 35.58715596330275, 12, 1213, 16.0, 64.0, 104.14999999999998, 423.55999999999995, 2.227114609565355, 52.19313004101773, 0.9360521839514938], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404\/Not Found", 1, 100.0, 0.05089058524173028], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1965, 1, "404\/Not Found", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Comment", 221, 1, "404\/Not Found", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
