$(document).ready(function() {
    table = $("#tkts-bkl").DataTable({
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
        colReorder: {
            realtime: false
        }



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
    table.on("column-reorder", (e, settings, details) => {
        var orders = table.order();
        console.log(details);
        console.log(orders)
    })

    //////////// functions ///////////

    function hideAllColumns() {
        for (var i = 0; i <= 13; i++) {
            table.column(i).visible(0);
        }
    }

    function showAllColumns() {
        for (var i = 0; i <= 13; i++) {
            table.column(i).visible(1);
        }
    }
});