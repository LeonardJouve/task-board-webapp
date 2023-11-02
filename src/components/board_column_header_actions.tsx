import React, {useState} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import useColumns from "@store/columns";
import Menu from "@components/menu";
import GenericModal from "@components/modals/generic_modal";
import type {Column} from "@typing/store";

type Props = {
    column: Column;
    handleNewCard: () => void;
};

const BoardColumnHeaderActions: React.FC<Props> = ({column, handleNewCard}) => {
    const {formatMessage} = useIntl();
    const {deleteColumn} = useColumns();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const handleAskDelete = (): void => {
        setIsMenuOpen(false);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = (): void => {
        deleteColumn(column.id);
    };

    return (
        <div className="flex flex-row gap-2 mr-0 ml-auto">
            <button
                className="rounded background-5 hover"
                onClick={handleNewCard}
            >
                <i className="icon-plus"/>
            </button>
            <Menu
                className="background-5"
                isOpen={isMenuOpen}
                setIsOpen={setIsMenuOpen}
                name={`board-column-header-menu-${column.id}`}
                icon="list"
                items={[
                    {
                        leftDecorator: "delete",
                        text: formatMessage({
                            id: "components.board_column_menu.delete_column",
                            defaultMessage: "Delete column",
                        }),
                        isDangerous: true,
                        onPress: handleAskDelete,
                    },
                ]}
            />
            <GenericModal
                isDangerous={true}
                isOpen={isDeleteModalOpen}
                setIsOpen={setIsDeleteModalOpen}
                header={(
                    <FormattedMessage
                        id="components.delete_column_modal.header"
                        defaultMessage="Delete column"
                    />
                )}
                content={(
                    <FormattedMessage
                        id="components.delete_column_modal.content"
                        defaultMessage="Do you really want to delete this column ? This will also delete all cards contained inside."
                    />
                )}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default BoardColumnHeaderActions;
