import React from "react";
import Menu from "@components/menu";
import type {Column} from "@typing/store";

type Props = {
    column: Column;
    onNewCard: () => void;
};

const BoardColumnHeaderActions: React.FC<Props> = ({column, onNewCard}) => (
    <div className="flex flex-row gap-2 mr-0 ml-auto">
        <button
            className="rounded background-5 hover"
            onClick={onNewCard}
        >
            <i className="icon-plus"/>
        </button>
        <Menu
            className="background-5"
            name={`board-column-header-menu-${column.id}`}
            icon="list"
            items={[
                {text: "text1"},
                {text: "text2"},
            ]}
        />
    </div>
);

export default BoardColumnHeaderActions;
