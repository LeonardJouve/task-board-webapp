import React, {useEffect} from "react";
import useCards, {getSortedCardsInColumn} from "@store/cards";
import CardPreview from "@components/card_preview";
import type {Column} from "@typing/store";
import useColumns, {getColumn} from "@store/columns";

type Props = {
    columnId: Column["id"];
};

const ColumnPreview: React.FC<Props> = ({columnId}) => {
    const fetchCards = useCards(({fetchCards}) => fetchCards);
    const cardsInColumn = useCards(getSortedCardsInColumn(columnId));
    const column = useColumns(getColumn(columnId));

    useEffect(() => {
        fetchCards([columnId]);
    }, [columnId]);

    if (!column) {
        return null;
    }

    return (
        <div className="min-w-board-column max-w-board-column flex-1 background-3 rounded-lg flex flex-col items-center gap-2 p-3">
            <span className="w-full px-2 py-1 background-4 rounded font-bold truncate text-left flex-shrink-0">
                {column.name}
            </span>
            {cardsInColumn.map(({id}) => (
                <CardPreview
                    key={`card-preview-${id}`}
                    cardId={id}
                />
            ))}
        </div>
    );
};

export default ColumnPreview;
