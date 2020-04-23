# Table Report Item Cells, Rows, and Columns (Report Builder)

To control how the rows and columns of a table report item display data in a Report Builder, you must understand how to specify rows and columns for detail data, for group data, and for labels and totals. In many cases, you can use the default structures for a table, matrix, or list to display your data.

A table report item displays detail data on detail rows and detail columns and grouped data on group rows and group columns. You can add and remove rows and columns to customize a table report item and control the way your data displays in the report.

## Row and Column Handles

When you select a table report item, the row and column handle graphics indicate the purpose of each row and column. Handles indicate rows and columns that are inside a group or outside a group.

## Group Rows

Rows inside a group repeat once per unique group value and are typically used for aggregate summaries. Rows outside a group repeat once with respect to the group and are used for labels or subtotals. When you select a table cell, row and column handles and brackets inside the table report item show the groups to which a cell belongs.

## Displaying Data on Rows and Columns

Rows and row groups and columns and column groups have identical relationships. The following discussion describes how to add rows to display detail and group data on rows in a table report item, but the same principles apply to adding columns to display detail and grouped data.

For each row in a table report item, a row is either inside or outside each row group. If the row is inside a row group, it repeats once for every unique value of the group, known as a group instance. If the row is outside a row group, it repeats only once in relation to that group. Rows outside all row groups are static and repeat only once for the data region. For example, a table header or footer row is a static row. Rows that repeat with at least one group are dynamic.

When you have nested groups, a row can be inside a parent group but outside a child group. The row repeats for every group value in the parent group, but displays only once in relation to the child group. To display labels or totals for a group, add a row outside the group. To display data that changes for every group instance, add a row inside the group.

When you have detail groups, each detail row is inside the detail group. The row repeats for every value in the dataset query result set.
