import React, {useEffect, useState} from "react";
import useBoards from "@store/boards";
import BoardPreview from "@components/board_preview";
import AddItem from "@components/add_item";
import AddBoardModal from "@components/modals/add_board_modal";

const SelectBoard: React.FC = () => {
    const {fetchBoards, boards} = useBoards();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        fetchBoards();
    }, []);

    const handleAddBoard = (): void => setIsModalOpen(true);

    return (
        <div className="flex flex-1 flex-col p-8 gap-5 background-1">
            {Object.values(boards).map((board) => (
                <BoardPreview
                    board={board}
                    key={`board-preview-${board.id}`}
                />
            ))}
            <AddItem
                className="h-board-preview rounded-lg background-3 color-2 hover"
                onAdd={handleAddBoard}
            />
            <AddBoardModal
                open={isModalOpen}
                setOpen={setIsModalOpen}
            />
        </div>
    );
};

export default SelectBoard;
