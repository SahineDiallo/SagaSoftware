$(document).ready(function() {
    $("#tkts-bkl_wrapper")
    var table = $("#tkts-bkl").DataTable({
        'columnDefs': [{
                "targets": 0, // your case first column
                "className": "text-center",
                "width": "4%"
            },
            {
                "targets": 3,
                "className": "text-center",
            }, {
                "targets": 4,
                "className": "text-center",
            }
        ],

    })

    $("#toggle_columns").multipleSelect({
        width: 200,
        onClick: function(view) {
            var selectedCols = $("#toggle_columns").multipleSelect('getSelects')
            hideAllColumns();
            for (var i = 0; i <= selectedCols.length; i++) {
                s = selectedCols[i]
                table.column(s).visible(1);
            }
        },
        onCheckAll: function() {
            showAllColumns()
        },
        onUncheckAll: function() {
            hideAllColumns();
        },
    })

    //////////// functions ///////////

    function hideAllColumns() {
        for (var i = 0; i <= 14; i++) {
            columns = table.column(i).visible(0);
        }
    }

    function showAllColumns() {
        for (var i = 0; i <= 14; i++) {
            columns = table.column(i).visible(1);
        }
    }
});