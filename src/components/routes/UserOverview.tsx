import React from "react";
import SortableTable, { TableProps } from "../SortableTable";
import { api } from "../../api/apiService";
import UserSpan from "../UserSpan";
import jsUtils from "../../utils/jsUtils";

/**
 * Displays a table of all users.
 * @component
 * @hideconstructor
 */
class UserOverview extends React.Component<
    {},
    { users: any[]; offset: number }
> {
    columns: TableProps["columns"] = [
        { name: "username", selector: "username", sortable: true },
        { name: "wins", selector: "winCount", sortable: true },
        { name: "defeats", selector: "defeatCount", sortable: true },
        { name: "draws", selector: "drawCount", sortable: true },
    ];
    constructor(props: any) {
        super(props);
        // initial state
        this.state = {
            users: [],
            offset: 0,
        };
    }

    async componentDidMount() {
        // fetch users from the API
        const response = await api("/users", { offset: this.state.offset });
        // if the response was unsuccessful, log an error
        if (!response.success) {
            return console.log("ERROR GETTING USER INFO");
        }
        console.log("new data:", response.data);
        // update the states userdata with the new data from the API
        this.setState({
            users: response.data.map((user: any) => ({
                username: <UserSpan username={user.username} />,
                winCount: user.winCount,
                defeatCount: user.defeatCount,
                drawCount: user.drawCount,
            })),
        });
        jsUtils.changeTitle("Users");
    }

    render(): React.ReactNode {
        console.log("calling table with data: ", this.state.users);
        return (
            // render the table with the users data
            <SortableTable
                // pass the users data to the table
                data={this.state.users}
                // pass the columns to the table
                columns={this.columns}
                // sort the table by the username column by default
                sortBy={"username"}
            />
        );
    }
}

export default UserOverview;
