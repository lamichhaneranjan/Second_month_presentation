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

    var data = {"OkPercent": 68.88888888888889, "KoPercent": 31.11111111111111};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5777777777777777, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Stage = Dpr, Step 4- Return project"], "isController": false}, {"data": [0.0, 500, 1500, "Add project "], "isController": false}, {"data": [1.0, 500, 1500, "Development/Criteria - Climate impact and disaster risk analysis method"], "isController": false}, {"data": [1.0, 500, 1500, "Stage = Readiness - Assessment"], "isController": false}, {"data": [1.0, 500, 1500, "Click on - Approval"], "isController": false}, {"data": [0.0, 500, 1500, "Stage = Dpr, Step 7 - Climate disaster"], "isController": false}, {"data": [0.0, 500, 1500, "Stage = Dpr, Step 2- Estimate_total"], "isController": false}, {"data": [0.0, 500, 1500, "Stage = Dpr, Step 10 - Operational Management"], "isController": false}, {"data": [0.5, 500, 1500, "Stage = Identification, Step 2 - Detailed Description"], "isController": false}, {"data": [1.0, 500, 1500, "Stage = Dpr, Click on - Approval"], "isController": false}, {"data": [1.0, 500, 1500, "Development/Criteria- Gender and social inclusion analysis"], "isController": false}, {"data": [1.0, 500, 1500, "Development/Criteria - Environmental impact analysis"], "isController": false}, {"data": [0.5, 500, 1500, "Stage = PrefeasibilityDevelopment , Step 4 - prefeasibility analysis"], "isController": false}, {"data": [1.0, 500, 1500, "Stage = Identification, Click on  Approval"], "isController": false}, {"data": [1.0, 500, 1500, "Stage = Feasibility Development, Step 7 - Conclusions and recommendations"], "isController": false}, {"data": [1.0, 500, 1500, "Stage = Identification, Click on Verification"], "isController": false}, {"data": [1.0, 500, 1500, "Stage = Identification, Identification - Assessment"], "isController": false}, {"data": [1.0, 500, 1500, "Stage = Identification, Step  3 - Financial"], "isController": false}, {"data": [1.0, 500, 1500, "Stage = PrefeasibilityDevelopment , Step 5 - implementation operation framework"], "isController": false}, {"data": [0.0, 500, 1500, "Stage = Dpr, Dpr - Assessment"], "isController": false}, {"data": [0.5, 500, 1500, "Stage = Feasibility Development, Step 2 - Study Methodology"], "isController": false}, {"data": [0.0, 500, 1500, "Stage = Dpr, Step 1 - General Description"], "isController": false}, {"data": [0.5, 500, 1500, "Stage = Identification, Step 1 - General detail"], "isController": false}, {"data": [1.0, 500, 1500, "Stage = Feasibility Development, Step 6 - Expected Result"], "isController": false}, {"data": [0.0, 500, 1500, "Stage = Dpr, Step 8 - Implementation Expenditure"], "isController": false}, {"data": [1.0, 500, 1500, "Stage = Identification, Step 4 - Land Acquistion"], "isController": false}, {"data": [1.0, 500, 1500, "Click on - Verification"], "isController": false}, {"data": [1.0, 500, 1500, "Click on - Evaluation"], "isController": false}, {"data": [1.0, 500, 1500, "Stage = Dpr, Click on - Verification"], "isController": false}, {"data": [1.0, 500, 1500, "Stage = Feasibility Development, Step 4 - Probability Analysis"], "isController": false}, {"data": [0.0, 500, 1500, "Stage = Prefeasibility Development , Step 3 - policy identify"], "isController": false}, {"data": [1.0, 500, 1500, "Stage = Dpr, Click on - Evaluation"], "isController": false}, {"data": [0.0, 500, 1500, "Stage = Dpr, Step 3- Source Cost  Bearings"], "isController": false}, {"data": [0.0, 500, 1500, "Stage = Feasibility Development, Step 3 - Policy Identify"], "isController": false}, {"data": [1.0, 500, 1500, "Stage = Identification, Click on Evaluation"], "isController": false}, {"data": [0.0, 500, 1500, "Development - Assessment"], "isController": false}, {"data": [1.0, 500, 1500, "Stage = Feasibility Development, Step 5 - Implementation and Oprn Framework"], "isController": false}, {"data": [1.0, 500, 1500, "Stage =  Prefeasibility Development , Step 1- Project Background"], "isController": false}, {"data": [0.0, 500, 1500, "Stage = Dpr, Step 5- Economic Financial"], "isController": false}, {"data": [0.0, 500, 1500, "Stage = Dpr, Step 6 - Environment Social"], "isController": false}, {"data": [0.0, 500, 1500, "Stage = Dpr, Step 9 - Organization Structure Staffing"], "isController": false}, {"data": [0.5, 500, 1500, "Stage = Prefeasibility Development , Step 6 - study recommendations suggestion"], "isController": false}, {"data": [1.0, 500, 1500, "Stage = Prefeasibility Development , Step 2 - study methodology"], "isController": false}, {"data": [0.5, 500, 1500, "Stage = Feasibility Development, Step 1 -Project Background"], "isController": false}, {"data": [0.0, 500, 1500, "Stage = Readiness, Click on - Evaluation"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 90, 28, 31.11111111111111, 493.3333333333335, 68, 6110, 115.0, 1230.800000000002, 3090.0000000000014, 6110.0, 3.895092183848351, 5.47510657405003, 377.92322103836665], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Stage = Dpr, Step 4- Return project", 2, 2, 100.0, 104.5, 97, 112, 104.5, 112.0, 112.0, 112.0, 1.2300123001230012, 0.529722094095941, 1.0174027521525215], "isController": false}, {"data": ["Add project ", 2, 0, 0.0, 3909.5, 2847, 4972, 3909.5, 4972.0, 4972.0, 4972.0, 0.3403096818104475, 0.31438765526629237, 0.27051961034541433], "isController": false}, {"data": ["Development/Criteria - Climate impact and disaster risk analysis method", 2, 0, 0.0, 100.0, 89, 111, 100.0, 111.0, 111.0, 111.0, 1.2547051442910915, 1.5659308343789209, 3.8976729140526976], "isController": false}, {"data": ["Stage = Readiness - Assessment", 2, 0, 0.0, 136.0, 96, 176, 136.0, 176.0, 176.0, 176.0, 2.055498458376156, 3.3723021582733814, 3.3040531860226108], "isController": false}, {"data": ["Click on - Approval", 2, 0, 0.0, 82.0, 80, 84, 82.0, 84.0, 84.0, 84.0, 1.10803324099723, 0.596217105263158, 0.6773718836565097], "isController": false}, {"data": ["Stage = Dpr, Step 7 - Climate disaster", 2, 2, 100.0, 82.5, 69, 96, 82.5, 96.0, 96.0, 96.0, 1.4760147601476015, 0.6356665129151292, 0.9844903136531366], "isController": false}, {"data": ["Stage = Dpr, Step 2- Estimate_total", 2, 2, 100.0, 79.0, 72, 86, 79.0, 86.0, 86.0, 86.0, 1.221001221001221, 0.5258413461538461, 1.7337263431013432], "isController": false}, {"data": ["Stage = Dpr, Step 10 - Operational Management", 2, 2, 100.0, 93.5, 72, 115, 93.5, 115.0, 115.0, 115.0, 1.5467904098994587, 0.666147041763341, 2.927421693735499], "isController": false}, {"data": ["Stage = Identification, Step 2 - Detailed Description", 2, 0, 0.0, 2844.0, 121, 5567, 2844.0, 5567.0, 5567.0, 5567.0, 0.35925992455541583, 0.445917347763607, 0.3231234282378301], "isController": false}, {"data": ["Stage = Dpr, Click on - Approval", 2, 0, 0.0, 194.0, 73, 315, 194.0, 315.0, 315.0, 315.0, 1.6326530612244898, 1.2244897959183672, 0.9725765306122448], "isController": false}, {"data": ["Development/Criteria- Gender and social inclusion analysis", 2, 0, 0.0, 94.5, 93, 96, 94.5, 96.0, 96.0, 96.0, 1.5600624024960998, 2.9053115249609984, 5.74511261700468], "isController": false}, {"data": ["Development/Criteria - Environmental impact analysis", 2, 0, 0.0, 250.5, 100, 401, 250.5, 401.0, 401.0, 401.0, 1.2634238787113075, 2.3096967782691094, 6.173380251105496], "isController": false}, {"data": ["Stage = PrefeasibilityDevelopment , Step 4 - prefeasibility analysis", 2, 0, 0.0, 776.0, 720, 832, 776.0, 832.0, 832.0, 832.0, 0.7689350249903883, 2.6589833237216456, 115.6954356497501], "isController": false}, {"data": ["Stage = Identification, Click on  Approval", 2, 0, 0.0, 119.5, 103, 136, 119.5, 136.0, 136.0, 136.0, 0.4439511653718091, 0.4136029411764706, 0.26836501109877914], "isController": false}, {"data": ["Stage = Feasibility Development, Step 7 - Conclusions and recommendations", 2, 0, 0.0, 331.0, 329, 333, 331.0, 333.0, 333.0, 333.0, 1.3175230566534915, 6.094830780632411, 781.9737370306324], "isController": false}, {"data": ["Stage = Identification, Click on Verification", 2, 0, 0.0, 148.0, 117, 179, 148.0, 179.0, 179.0, 179.0, 0.44583147570218457, 0.41709624386981725, 0.2703724086045475], "isController": false}, {"data": ["Stage = Identification, Identification - Assessment", 2, 0, 0.0, 193.5, 123, 264, 193.5, 264.0, 264.0, 264.0, 0.4288164665523156, 1.1361123767152659, 1.134437312392796], "isController": false}, {"data": ["Stage = Identification, Step  3 - Financial", 2, 0, 0.0, 180.5, 102, 259, 180.5, 259.0, 259.0, 259.0, 0.4491354143274197, 0.6109820626543903, 0.33290408151807765], "isController": false}, {"data": ["Stage = PrefeasibilityDevelopment , Step 5 - implementation operation framework", 2, 0, 0.0, 160.0, 101, 219, 160.0, 219.0, 219.0, 219.0, 1.0695187165775402, 3.858205213903743, 1.4402991310160427], "isController": false}, {"data": ["Stage = Dpr, Dpr - Assessment", 2, 2, 100.0, 75.0, 69, 81, 75.0, 81.0, 81.0, 81.0, 2.0682523267838677, 0.7735748448810755, 11.852055325749742], "isController": false}, {"data": ["Stage = Feasibility Development, Step 2 - Study Methodology", 2, 0, 0.0, 931.5, 931, 932, 931.5, 932.0, 932.0, 932.0, 0.9319664492078285, 2.317174394221808, 552.7498470992545], "isController": false}, {"data": ["Stage = Dpr, Step 1 - General Description", 2, 2, 100.0, 97.5, 78, 117, 97.5, 117.0, 117.0, 117.0, 1.1883541295306002, 0.5117814171122994, 1.2626262626262625], "isController": false}, {"data": ["Stage = Identification, Step 1 - General detail", 2, 0, 0.0, 1043.0, 169, 1917, 1043.0, 1917.0, 1917.0, 1917.0, 0.6311139160618492, 0.6212527611233828, 0.6163221836541496], "isController": false}, {"data": ["Stage = Feasibility Development, Step 6 - Expected Result", 2, 0, 0.0, 335.0, 302, 368, 335.0, 368.0, 368.0, 368.0, 1.3449899125756557, 4.7705110961667785, 200.40087004034967], "isController": false}, {"data": ["Stage = Dpr, Step 8 - Implementation Expenditure", 2, 2, 100.0, 85.5, 68, 103, 85.5, 103.0, 103.0, 103.0, 1.5060240963855422, 0.6485904555722891, 1.267766378012048], "isController": false}, {"data": ["Stage = Identification, Step 4 - Land Acquistion", 2, 0, 0.0, 166.0, 144, 188, 166.0, 188.0, 188.0, 188.0, 0.4449388209121246, 0.7260671579532814, 0.4032258064516129], "isController": false}, {"data": ["Click on - Verification", 2, 0, 0.0, 195.5, 86, 305, 195.5, 305.0, 305.0, 305.0, 1.1049723756906078, 0.5945700966850829, 0.6798169889502762], "isController": false}, {"data": ["Click on - Evaluation", 2, 0, 0.0, 144.0, 111, 177, 144.0, 177.0, 177.0, 177.0, 1.0922992900054613, 0.5877508874931732, 0.669886673948662], "isController": false}, {"data": ["Stage = Dpr, Click on - Verification", 2, 0, 0.0, 90.0, 77, 103, 90.0, 103.0, 103.0, 103.0, 1.5936254980079683, 1.1952191235059761, 0.9555527888446216], "isController": false}, {"data": ["Stage = Feasibility Development, Step 4 - Probability Analysis", 2, 0, 0.0, 222.5, 206, 239, 222.5, 239.0, 239.0, 239.0, 1.465201465201465, 4.296875, 3.899095695970696], "isController": false}, {"data": ["Stage = Prefeasibility Development , Step 3 - policy identify", 2, 0, 0.0, 4748.5, 3387, 6110, 4748.5, 6110.0, 6110.0, 6110.0, 0.2502502502502503, 0.5936111893143143, 222.5267259446947], "isController": false}, {"data": ["Stage = Dpr, Click on - Evaluation", 2, 0, 0.0, 78.5, 73, 84, 78.5, 84.0, 84.0, 84.0, 2.0366598778004072, 1.5274949083503055, 1.2172225050916496], "isController": false}, {"data": ["Stage = Dpr, Step 3- Source Cost  Bearings", 2, 2, 100.0, 84.5, 73, 96, 84.5, 96.0, 96.0, 96.0, 1.2307692307692308, 0.5300480769230769, 0.8365384615384616], "isController": false}, {"data": ["Stage = Feasibility Development, Step 3 - Policy Identify", 2, 2, 100.0, 1384.5, 1357, 1412, 1384.5, 1412.0, 1412.0, 1412.0, 0.7776049766718507, 0.2908424863919129, 806.5973403479782], "isController": false}, {"data": ["Stage = Identification, Click on Evaluation", 2, 0, 0.0, 116.0, 115, 117, 116.0, 117.0, 117.0, 117.0, 0.44277175116227585, 0.41336893956165593, 0.26851685299977857], "isController": false}, {"data": ["Development - Assessment", 2, 2, 100.0, 123.5, 99, 148, 123.5, 148.0, 148.0, 148.0, 1.1409013120365088, 0.4523495436394752, 7.370177909298346], "isController": false}, {"data": ["Stage = Feasibility Development, Step 5 - Implementation and Oprn Framework", 2, 0, 0.0, 89.0, 86, 92, 89.0, 92.0, 92.0, 92.0, 1.6515276630883566, 5.211021366639141, 2.8434016308835672], "isController": false}, {"data": ["Stage =  Prefeasibility Development , Step 1- Project Background", 2, 0, 0.0, 153.5, 126, 181, 153.5, 181.0, 181.0, 181.0, 0.4235493434985176, 0.5352273930537907, 1.3161464951291824], "isController": false}, {"data": ["Stage = Dpr, Step 5- Economic Financial", 2, 2, 100.0, 82.5, 77, 88, 82.5, 88.0, 88.0, 88.0, 1.2578616352201257, 0.5417158018867925, 0.9888463050314464], "isController": false}, {"data": ["Stage = Dpr, Step 6 - Environment Social", 2, 2, 100.0, 196.0, 88, 304, 196.0, 304.0, 304.0, 304.0, 1.257071024512885, 0.5413753142677561, 0.8335461187932118], "isController": false}, {"data": ["Stage = Dpr, Step 9 - Organization Structure Staffing", 2, 2, 100.0, 79.5, 78, 81, 79.5, 81.0, 81.0, 81.0, 1.5360983102918586, 0.6615423387096774, 4.519789266513056], "isController": false}, {"data": ["Stage = Prefeasibility Development , Step 6 - study recommendations suggestion", 2, 0, 0.0, 1033.5, 803, 1264, 1033.5, 1264.0, 1264.0, 1264.0, 0.8149959250203749, 3.8417825488997552, 483.73629469743275], "isController": false}, {"data": ["Stage = Prefeasibility Development , Step 2 - study methodology", 2, 0, 0.0, 111.0, 107, 115, 111.0, 115.0, 115.0, 115.0, 0.4244482173174873, 0.5890048015704584, 0.6300403225806452], "isController": false}, {"data": ["Stage = Feasibility Development, Step 1 -Project Background", 2, 0, 0.0, 576.5, 565, 588, 576.5, 588.0, 588.0, 588.0, 1.124859392575928, 2.027822694038245, 336.808606931946], "isController": false}, {"data": ["Stage = Readiness, Click on - Evaluation", 2, 2, 100.0, 79.0, 75, 83, 79.0, 83.0, 83.0, 83.0, 2.0833333333333335, 0.8646647135416667, 1.26953125], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["413/Request Entity Too Large", 2, 7.142857142857143, 2.2222222222222223], "isController": false}, {"data": ["405/Method Not Allowed", 20, 71.42857142857143, 22.22222222222222], "isController": false}, {"data": ["403/Forbidden", 4, 14.285714285714286, 4.444444444444445], "isController": false}, {"data": ["409/Conflict", 2, 7.142857142857143, 2.2222222222222223], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 90, 28, "405/Method Not Allowed", 20, "403/Forbidden", 4, "413/Request Entity Too Large", 2, "409/Conflict", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Stage = Dpr, Step 4- Return project", 2, 2, "405/Method Not Allowed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Stage = Dpr, Step 7 - Climate disaster", 2, 2, "405/Method Not Allowed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Stage = Dpr, Step 2- Estimate_total", 2, 2, "405/Method Not Allowed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Stage = Dpr, Step 10 - Operational Management", 2, 2, "405/Method Not Allowed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Stage = Dpr, Dpr - Assessment", 2, 2, "409/Conflict", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Stage = Dpr, Step 1 - General Description", 2, 2, "405/Method Not Allowed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Stage = Dpr, Step 8 - Implementation Expenditure", 2, 2, "405/Method Not Allowed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Stage = Dpr, Step 3- Source Cost  Bearings", 2, 2, "405/Method Not Allowed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Stage = Feasibility Development, Step 3 - Policy Identify", 2, 2, "413/Request Entity Too Large", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Development - Assessment", 2, 2, "403/Forbidden", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Stage = Dpr, Step 5- Economic Financial", 2, 2, "405/Method Not Allowed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Stage = Dpr, Step 6 - Environment Social", 2, 2, "405/Method Not Allowed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Stage = Dpr, Step 9 - Organization Structure Staffing", 2, 2, "405/Method Not Allowed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Stage = Readiness, Click on - Evaluation", 2, 2, "403/Forbidden", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
