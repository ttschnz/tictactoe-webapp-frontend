import React from "react";
import SortableTable, { TableProps } from "../SortableTable";
import { api } from "../../api/apiService";
import UserSpan from "../UserSpan";
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
        this.state = {
            users: [],
            offset: 0,
        };
    }

    async componentDidMount() {
        const response = await api("/users", { offset: this.state.offset });
        if (!response.success) {
            return console.log("ERROR GETTING USER INFO");
        }
        console.log("new data:", response.data);
        this.setState({
            users: response.data.map((user: any) => ({
                username: <UserSpan username={user.username} />,
                winCount: user.winCount,
                defeatCount: user.defeatCount,
                drawCount: user.drawCount,
            })),
        });
    }

    render(): React.ReactNode {
        console.log("calling table with data: ", this.state.users);
        return (
            <SortableTable
                data={this.state.users}
                columns={this.columns}
                sortBy={"username"}
            />
        );
    }
}

export default UserOverview;
