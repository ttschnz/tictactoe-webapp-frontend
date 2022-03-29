import React from "react";
import Loading from "./Loading";
import "./SortableTable.css";
export interface TableProps {
    columns: {
        name: string;
        selector: string;
        sortable?: boolean;
    }[];
    data: {
        [key: string]: any;
    }[];
}
/**
 * A component that renders a table with sortable columns.
 * @component
 * @hideconstructor
 * @param props - The properties of the component.
 * @returns The rendered component.
 * @example
 * <SortableTable
 *   columns={[
 *    { name: "Name", selector: "name" sortable: false},
 *    { name: "Age", selector: "age" sortable: true },
 *  ]}
 *  data={[
 *   { name: "John", age: "20" },
 *   { name: "Jane", age: "30" },
 *   { name: "Joe", age: "40" },
 *  ]}
 * />
 */
class SortableTable extends React.Component<
    {
        data: TableProps["data"];
        columns: TableProps["columns"];
        sortBy: string;
    },
    {
        sortBy: string;
        sortDirection: "asc" | "desc";
    }
> {
    constructor(props: any) {
        super(props);
        // initialize the sortBy and sortDirection with the data provided
        this.state = {
            sortBy: this.props.sortBy,
            sortDirection: "asc",
        };
    }
    render(): React.ReactNode {
        return (
            <table className="SortableTable">
                <thead>{this.getTableHeading()}</thead>
                <tbody>{this.getTableData()}</tbody>
            </table>
        );
    }
    /**
     * Gets the table heading, which is a row of th elements.
     * @returns The rendered table heading.
     */
    getTableHeading(): React.ReactNode {
        return (
            // map the columns to th elements
            <tr className="SortableTable-Heading">
                {this.props.columns.map((column: any) => (
                    <th
                        className="SortableTable-Heading-Cell"
                        key={column.selector}
                        onClick={() =>
                            this.setState({
                                sortBy: column.selector,
                                sortDirection:
                                    // if the sortBy is the same as the column selector,
                                    this.state.sortBy === column.selector
                                        ? // then reverse the sort direction
                                          this.state.sortDirection === "asc"
                                            ? "desc"
                                            : "asc"
                                        : // otherwise, set the sort direction to ascending (asc)
                                          "asc",
                            })
                        }
                        data-current-sorting={
                            // if the sortBy is the same as the column selector,
                            this.state.sortBy === column.selector &&
                            // then set the data-current-sorting attribute to "ASC" or "DESC"
                            (this.state.sortDirection === "asc"
                                ? "ASC"
                                : "DESC")
                        }
                    >
                        {column.name}
                    </th>
                ))}
            </tr>
        );
    }
    /**
     * Gets the table data, which is a row of td elements.
     * @returns The rendered table data.
     */
    getTableData(): React.ReactNode[] {
        if (this.props.data.length > 0)
            return (
                this.props.data
                    // sort the data by the selected column and direction
                    .sort((a, b) => {
                        if (this.state.sortBy === "username") {
                            // sort by username
                            return this.state.sortDirection === "asc"
                                ? a.username.props.username.localeCompare(
                                      b.username.props.username
                                  )
                                : b.username.props.username.localeCompare(
                                      a.username.props.username
                                  );
                        } else {
                            // sort by the selected column
                            return this.state.sortDirection === "asc"
                                ? a[this.state.sortBy] - b[this.state.sortBy]
                                : b[this.state.sortBy] - a[this.state.sortBy];
                        }
                    })
                    // map the data to a row of td elements
                    .map((row: any) => (
                        <tr
                            key={row.username.props.username}
                            className="SortableTable-Row"
                        >
                            {this.props.columns.map((column: any) => (
                                <td
                                    key={column.selector}
                                    className="SortableTable-Cell"
                                >
                                    {row[column.selector]}
                                </td>
                            ))}
                        </tr>
                    ))
            );
        else
            return [
                // if there is no data, return a loading spinner
                <tr key="loading">
                    <td>
                        <Loading />
                    </td>
                </tr>,
            ];
    }
}

export default SortableTable;
