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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9966802860061287, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Anonymous - Open Contacts"], "isController": true}, {"data": [1.0, 500, 1500, "Editor - Login"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open Predefined Date"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Search by Name"], "isController": true}, {"data": [0.0, 500, 1500, "Admin- Open Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "Editor - Edit Post"], "isController": true}, {"data": [0.986328125, 500, 1500, "Anonymous - Open Home page"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - User List"], "isController": false}, {"data": [0.75, 500, 1500, "Admin - Login"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open Random Page"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - LogOut"], "isController": true}, {"data": [1.0, 500, 1500, "Editor -  Get Post Content"], "isController": false}, {"data": [0.99609375, 500, 1500, "Anonymous - Open Random Date"], "isController": true}, {"data": [1.0, 500, 1500, "Editor - Open Page by Predefined Date"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open First Post"], "isController": false}, {"data": [1.0, 500, 1500, "Admin - Delete User"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Add User"], "isController": true}, {"data": [1.0, 500, 1500, "Anonymous - Open Large Calendar"], "isController": true}, {"data": [0.9954545454545455, 500, 1500, "Anonymous - Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Editor - Open Random Post"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Open Admin Page"], "isController": false}, {"data": [0.0, 500, 1500, "Editor - Open Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "Anonymous - Open Random Post"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1958, 0, 0.0, 26.95914198161395, 2, 5115, 15.0, 26.0, 39.0, 138.87000000000057, 6.100524682510999, 122.5831602501589, 4.291752972954236], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Anonymous - Open Contacts", 64, 0, 0.0, 16.312499999999986, 10, 97, 13.0, 20.5, 33.25, 97.0, 0.5806199932865813, 11.380775581300407, 0.28024553875184843], "isController": true}, {"data": ["Editor - Login", 2, 0, 0.0, 68.5, 24, 113, 68.5, 113.0, 113.0, 113.0, 17.699115044247787, 551.9392975663717, 42.346515486725664], "isController": true}, {"data": ["Anonymous - Open Predefined Date", 416, 0, 0.0, 18.733173076923087, 12, 442, 15.0, 24.30000000000001, 33.14999999999998, 58.829999999999984, 2.156032485604855, 56.33469476883548, 1.0556048098700679], "isController": true}, {"data": ["Anonymous - Search by Name", 384, 0, 0.0, 18.434895833333332, 12, 166, 16.0, 25.0, 32.75, 62.04999999999984, 2.1548942474424657, 56.03690650971666, 1.0222397958181584], "isController": true}, {"data": ["Admin- Open Login Page", 2, 0, 0.0, 3714.0, 2313, 5115, 3714.0, 5115.0, 5115.0, 5115.0, 0.39100684261974583, 1.7347110215053763, 0.17641129032258063], "isController": false}, {"data": ["Editor - Edit Post", 100, 0, 0.0, 9.049999999999995, 3, 174, 4.0, 12.0, 14.949999999999989, 173.90999999999997, 0.3226930672621429, 0.05735365062666994, 0.6238911207372246], "isController": true}, {"data": ["Anonymous - Open Home page", 512, 0, 0.0, 73.46289062499999, 13, 6490, 17.0, 26.0, 38.0, 2889.1100000000065, 2.587949858471492, 65.98611192282905, 1.24759512105742], "isController": true}, {"data": ["Admin - User List", 20, 0, 0.0, 26.550000000000004, 6, 357, 7.0, 40.60000000000007, 341.3499999999998, 357.0, 0.4536484678023, 2.6108045242928752, 0.562187407852655], "isController": false}, {"data": ["Admin - Login", 2, 0, 0.0, 509.0, 469, 549, 509.0, 549.0, 549.0, 549.0, 3.6429872495446265, 136.38433515482694, 8.72680441712204], "isController": true}, {"data": ["Anonymous - Open Random Page", 495, 0, 0.0, 19.951515151515146, 12, 329, 16.0, 25.0, 38.19999999999999, 76.2000000000001, 2.550875800691571, 66.09275517454175, 1.2069404837516942], "isController": false}, {"data": ["Admin - LogOut", 2, 0, 0.0, 24.5, 18, 31, 24.5, 31.0, 31.0, 31.0, 0.8591065292096219, 22.343481529209622, 1.3884973689862543], "isController": true}, {"data": ["Editor -  Get Post Content", 100, 0, 0.0, 9.780000000000005, 2, 205, 4.0, 9.0, 30.849999999999966, 204.30999999999966, 0.32254422887738476, 0.25074663949231535, 0.41892951602238454], "isController": false}, {"data": ["Anonymous - Open Random Date", 128, 0, 0.0, 21.81249999999999, 9, 505, 14.0, 27.10000000000001, 50.49999999999997, 406.97999999999786, 0.831417176559232, 19.368889205541915, 0.4046460306325266], "isController": true}, {"data": ["Editor - Open Page by Predefined Date", 100, 0, 0.0, 20.069999999999997, 14, 116, 17.0, 25.0, 28.899999999999977, 115.50999999999975, 0.32350315092068993, 9.879501900176633, 0.3860555179932453], "isController": true}, {"data": ["Anonymous - Open First Post", 665, 0, 0.0, 18.905263157894723, 12, 163, 15.0, 26.0, 37.0, 98.0200000000001, 3.49380309661285, 81.91610677705859, 1.463404587980792], "isController": false}, {"data": ["Admin - Delete User", 9, 0, 0.0, 8.666666666666666, 6, 19, 7.0, 19.0, 19.0, 19.0, 0.3117746908234316, 0.05541307981432085, 0.5761539452489001], "isController": true}, {"data": ["Admin - Add User", 11, 0, 0.0, 18.272727272727273, 5, 127, 8.0, 103.60000000000008, 127.0, 127.0, 0.28843380444188055, 0.13768719517791123, 0.43316284054854864], "isController": true}, {"data": ["Anonymous - Open Large Calendar", 128, 0, 0.0, 21.382812500000007, 12, 414, 14.0, 24.200000000000017, 39.49999999999997, 344.1099999999985, 0.8396801343488215, 15.882582541213207, 0.4086163153786105], "isController": true}, {"data": ["Anonymous - Comment", 220, 0, 0.0, 25.66818181818183, 7, 864, 11.0, 32.900000000000006, 77.94999999999999, 498.12999999999727, 1.1601356304018815, 2.76098684696229, 2.653135637323145], "isController": false}, {"data": ["Editor - Open Random Post", 100, 0, 0.0, 104.11000000000004, 15, 474, 118.0, 150.9, 197.44999999999987, 473.81999999999994, 0.3230349782274424, 67.10966812900563, 0.380405233247406], "isController": true}, {"data": ["Admin - Open Admin Page", 20, 0, 0.0, 13.0, 3, 99, 6.0, 37.50000000000003, 95.99999999999996, 99.0, 0.4539058599246516, 0.9138844837955609, 0.5270449877445418], "isController": false}, {"data": ["Editor - Open Login Page", 2, 0, 0.0, 3665.5, 2216, 5115, 3665.5, 5115.0, 5115.0, 5115.0, 0.39100684261974583, 1.7347110215053763, 0.17641129032258063], "isController": false}, {"data": ["Anonymous - Open Random Post", 434, 0, 0.0, 18.80875576036866, 12, 167, 15.0, 26.0, 32.0, 89.64999999999952, 2.262183997915038, 52.91810720452176, 0.9481284206411259], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1958, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
