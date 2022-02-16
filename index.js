import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Grid} from 'ag-grid-community';
import axios from 'axios';
import 'ag-grid-enterprise';

const emptyLine = {
  name: 'empty',
  account: '101010',
  calls: 0,
  minutes: new Date(),
  callRecords: [],
}

var columnDefs = [
    // group cell renderer needed for expand / collapse icons
    {field: 'name', cellRenderer: 'agGroupCellRenderer'},
    {field: 'account'},
    {field: 'calls', editable: true}, // Here we set calls number editable to changed it on the grid.
    {field: 'minutes', valueFormatter: "x.toLocaleString() + 'm'"}
];

var gridOptions = {
    columnDefs: columnDefs,
    masterDetail: true,
    detailCellRendererParams: {
        detailGridOptions: {
            columnDefs: [
                {field: 'callId'},
                {field: 'direction'},
                {field: 'number'},
                {field: 'duration', valueFormatter: "x.toLocaleString() + 's'"},
                {field: 'switchCode'}
            ],
            onFirstDataRendered(params) {
                params.api.sizeColumnsToFit();
            }
        },
        getDetailRowData: function (params) {
            params.successCallback(params.data.callRecords);
        }
    },
    isRowMaster: function (dataItem) {
        // Here we make a row dynamically master depending of the value inside 'calls' column.
        return dataItem ? dataItem.calls > 0 : false;
    },
    isFullWidthCell: function () {
        return false;
    },
    onGridReady: function (params) {
        params.api.sizeColumnsToFit();

        // arbitrarily expand a row for presentational purposes
        setTimeout(function () {
            var rowCount = 0;
            params.api.forEachNode(function (node) {
                node.setExpanded(rowCount++ === 1);
            });
        }, 500);
    }
};

var gridData = [];
var gridDiv = document.querySelector('#myGrid');
new Grid(gridDiv, gridOptions);

axios.get('https://raw.githubusercontent.com/ag-grid/ag-grid-docs/latest/src/javascript-grid-master-detail/dynamic-master-nodes/data/data.json').then(function (data) {
    gridData = data.data;
    gridOptions.api.setRowData(data.data);
});

function addRow() {
  console.log('function addRow called');
  gridData = [...gridData, {...emptyLine}],
  console.log(gridData);
  gridOptions.api.setRowData(gridData);
}

document.querySelector('#addRow').addEventListener('click', function() {
  addRow();
});
