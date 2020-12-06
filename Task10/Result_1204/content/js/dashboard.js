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

    var data = {"OkPercent": 17.322196596646513, "KoPercent": 82.6778034033535};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.03543384841695213, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.019147917663954045, 500, 1500, "Anonymous - Open Contacts"], "isController": true}, {"data": [0.019417475728155338, 500, 1500, "Editor - Login"], "isController": true}, {"data": [0.018871688477497605, 500, 1500, "Anonymous - Open Predefined Date"], "isController": true}, {"data": [0.018793392386880537, 500, 1500, "Anonymous - Search by Name"], "isController": true}, {"data": [0.04160246533127889, 500, 1500, "Admin- Open Login Page"], "isController": false}, {"data": [0.9902912621359223, 500, 1500, "Editor - Edit Post"], "isController": true}, {"data": [0.0188793958593325, 500, 1500, "Anonymous - Open Home page"], "isController": true}, {"data": [0.04014204106839586, 500, 1500, "Admin - User List"], "isController": false}, {"data": [0.04160246533127889, 500, 1500, "Admin - Login"], "isController": true}, {"data": [0.9982486865148862, 500, 1500, "Anonymous - Open Random Page"], "isController": false}, {"data": [0.03863987635239567, 500, 1500, "Admin - LogOut"], "isController": true}, {"data": [1.0, 500, 1500, "Editor -  Get Post Content"], "isController": false}, {"data": [0.019025966255833433, 500, 1500, "Anonymous - Open Random Date"], "isController": true}, {"data": [0.9987146529562982, 500, 1500, "Anonymous - Open First Post"], "isController": false}, {"data": [0.012122397106266497, 500, 1500, "Editor - Open Page by Predefined Date"], "isController": true}, {"data": [1.0, 500, 1500, "Admin - Delete User"], "isController": true}, {"data": [0.020636420919974797, 500, 1500, "Admin - Add User"], "isController": true}, {"data": [0.01890856869315462, 500, 1500, "Anonymous - Open Large Calendar"], "isController": true}, {"data": [0.8023255813953488, 500, 1500, "Anonymous - Comment"], "isController": false}, {"data": [0.0012710207274149394, 500, 1500, "Editor - Open Random Post"], "isController": true}, {"data": [0.040290213028712565, 500, 1500, "Admin - Open Admin Page"], "isController": false}, {"data": [0.019417475728155338, 500, 1500, "Editor - Open Login Page"], "isController": false}, {"data": [0.996078431372549, 500, 1500, "Anonymous - Open Random Post"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 16043, 13264, 82.6778034033535, 166.17758523966944, 0, 10013, 100.0, 169.0, 181.0, 906.9599999999919, 0.8913628038852373, 3.0462585154129704, 0.999516620991708], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Anonymous - Open Contacts", 4178, 4098, 98.08520823360459, 181.3925323121112, 3, 10020, 111.0, 170.0, 180.0, 191.0, 0.23256936320025687, 0.20411023861224226, 0.11318471495334724], "isController": true}, {"data": ["Editor - Login", 206, 202, 98.05825242718447, 107.16990291262134, 8, 193, 109.0, 173.60000000000002, 178.0, 191.93, 0.011470014931064096, 0.012235338714412887, 0.017863717409845683], "isController": true}, {"data": ["Anonymous - Open Predefined Date", 25064, 24591, 98.11283115225024, 175.9869533992995, 0, 10018, 111.0, 168.0, 178.0, 189.0, 1.3927583567029524, 1.3860244713384846, 0.6887828481675009], "isController": true}, {"data": ["Anonymous - Search by Name", 25062, 24591, 98.12066076131195, 179.3569547522141, 0, 21021, 111.0, 169.0, 179.0, 189.0, 1.392951184569867, 1.381055391631766, 0.6672171718416657], "isController": true}, {"data": ["Admin- Open Login Page", 649, 622, 95.83975346687211, 191.16949152542404, 3, 10005, 105.0, 165.0, 177.0, 4659.5, 0.03608896190462527, 0.024545398808886315, 0.042090068143911884], "isController": false}, {"data": ["Editor - Edit Post", 103, 1, 0.970873786407767, 101.81553398058252, 1, 10002, 3.0, 5.0, 7.599999999999994, 9606.279999999939, 0.15879255987481597, 0.03180909819701069, 0.3045892784188578], "isController": true}, {"data": ["Anonymous - Open Home page", 31251, 30661, 98.11206041406675, 183.21343317013728, 0, 10021, 112.0, 169.0, 179.0, 189.0, 1.7361793021938103, 1.7050753431872199, 0.8514642045797667], "isController": true}, {"data": ["Admin - User List", 6477, 6217, 95.98579589316041, 175.52308167361434, 2, 10007, 110.0, 169.0, 179.0, 191.0, 0.3599929502075337, 0.28438808453417597, 0.4430934353622292], "isController": false}, {"data": ["Admin - Login", 649, 622, 95.83975346687211, 181.10939907550127, 5, 10007, 110.0, 172.0, 181.0, 192.0, 0.03608919268809601, 0.07415814946311347, 0.0561511315470258], "isController": true}, {"data": ["Anonymous - Open Random Page", 571, 1, 0.17513134851138354, 30.472854640980742, 6, 10002, 10.0, 26.0, 31.0, 47.95999999999981, 0.8772509321751367, 22.6630774171067, 0.4210400584693123], "isController": false}, {"data": ["Admin - LogOut", 647, 622, 96.13601236476043, 199.04327666151516, 4, 10011, 114.0, 173.20000000000005, 183.0, 4808.5999999998385, 0.03608351230550945, 0.054107132153688765, 0.04348541203411348], "isController": true}, {"data": ["Editor -  Get Post Content", 103, 0, 0.0, 4.932038834951458, 2, 55, 4.0, 8.0, 9.799999999999997, 53.759999999999806, 0.16123326226546822, 0.1252419477291156, 0.20941429571589132], "isController": false}, {"data": ["Anonymous - Open Random Date", 8357, 8198, 98.09740337441666, 181.5014957520642, 0, 10020, 111.0, 169.0, 179.0, 191.0, 0.4646270224229657, 0.44506848411611616, 0.22972443401206571], "isController": true}, {"data": ["Anonymous - Open First Post", 778, 1, 0.12853470437017994, 54.736503856041125, 7, 10013, 38.0, 62.0, 72.0, 88.21000000000004, 1.1890897197232997, 27.760154989075808, 0.5046458011415567], "isController": false}, {"data": ["Editor - Open Page by Predefined Date", 10229, 10105, 98.78776028937335, 181.15778668491578, 0, 10019, 111.0, 169.0, 179.0, 191.0, 0.568423578425644, 0.49825470120238613, 0.6734926293316458], "isController": true}, {"data": ["Admin - Delete User", 129, 0, 0.0, 6.968992248062015, 4, 32, 5.0, 13.0, 16.5, 28.099999999999852, 0.20481099438119296, 0.03640195407946984, 0.37832263417501655], "isController": true}, {"data": ["Admin - Add User", 6348, 6217, 97.93635790800252, 175.17328292375478, 0, 10019, 112.0, 170.0, 180.0, 191.0, 0.35286205422747136, 0.18136453147417797, 0.5262729628539314], "isController": true}, {"data": ["Anonymous - Open Large Calendar", 8356, 8198, 98.10914313068454, 176.47510770703664, 2, 10016, 111.0, 170.0, 180.0, 190.0, 0.46469419662793066, 0.4004853186163858, 0.22891153427331024], "isController": true}, {"data": ["Anonymous - Comment", 258, 2, 0.7751937984496124, 570.2054263565892, 9, 10005, 227.0, 1409.1, 1488.4999999999995, 5080.2200000002085, 0.3919042902886724, 0.9326833177888092, 0.8915914575307904], "isController": false}, {"data": ["Editor - Open Random Post", 10228, 10105, 98.7974188502151, 237.617324990223, 0, 10017, 113.0, 172.0, 183.0, 5728.389999999992, 0.5684149780570034, 61.9448619309744, 0.6647286720869121], "isController": true}, {"data": ["Admin - Open Admin Page", 6478, 6217, 95.97097869712874, 175.16764433467137, 1, 10012, 110.0, 169.0, 180.0, 191.0, 0.3600059708307357, 0.2040342926839929, 0.4152400257526809], "isController": false}, {"data": ["Editor - Open Login Page", 206, 202, 98.05825242718447, 109.46601941747574, 4, 189, 113.5, 170.0, 179.64999999999998, 184.93, 0.011470104342314238, 0.006622780305129275, 0.013760601703299359], "isController": false}, {"data": ["Anonymous - Open Random Post", 510, 2, 0.39215686274509803, 78.75098039215688, 7, 10010, 38.0, 61.0, 72.0, 88.77999999999997, 0.7860617382136978, 18.296154407282476, 0.3337240281733775], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503\/Service Unavailable", 13166, 99.2611580217129, 82.06694508508383], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 98, 0.7388419782870929, 0.6108583182696503], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 16043, 13264, "503\/Service Unavailable", 13166, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 98, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Admin- Open Login Page", 649, 622, "503\/Service Unavailable", 617, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 5, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Admin - User List", 6477, 6217, "503\/Service Unavailable", 6173, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 44, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Open Random Page", 571, 1, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Open First Post", 778, 1, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Anonymous - Comment", 258, 2, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Admin - Open Admin Page", 6478, 6217, "503\/Service Unavailable", 6174, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 43, null, null, null, null, null, null], "isController": false}, {"data": ["Editor - Open Login Page", 206, 202, "503\/Service Unavailable", 202, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Anonymous - Open Random Post", 510, 2, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 2, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
