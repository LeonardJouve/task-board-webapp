import {create} from "zustand";
import Rest from "@api/rest";
import useBoards from "@store/boards";
import type {ActionResult, CreateColumn, Status, UpdateColumn} from "@typing/rest";
import type {Board, Column} from "@typing/store";


type ColumnState = {
    columns: Record<Column["id"], Column>;
    resetColumns: () => void;
    addColumn: (column: Column) => void;
    addColumns: (columns: Column[]) => void;
    removeColumn: (columnId: Column["id"]) => void;
    removeColumns: (columnIds: Column["id"][]) => void;
    fetchColumn: (columnId: Column["id"]) => ActionResult<Column>;
    fetchColumns: (boardIds?: Board["id"][]) => ActionResult<Column[]>;
    createColumn: (column: CreateColumn) => ActionResult<Column>;
    updateColumn: (columnId: Column["id"], column: UpdateColumn) => ActionResult<Column>;
    moveColumn: (columnId: Column["id"], nextId: Column["id"]|null) => ActionResult<Column>;
    deleteColumn: (columnId: Column["id"]) => ActionResult<Status>;
};

const useColumns = create<ColumnState>((set) => ({
    columns: {},
    resetColumns: (): void => set(() => ({columns: {}})),
    addColumn: (column): void => set((state) => setColumn(state, column)),
    addColumns: (columns): void => set((state) => columns.reduce(setColumn, state)),
    removeColumn: (columnId): void => set((state) => removeColumn(state, columnId)),
    removeColumns: (columnIds): void => set((state) => columnIds.reduce(removeColumn, state)),
    fetchColumn: async (columnId): ActionResult<Column> => {
        const {error, data} = await Rest.getColumn(columnId);

        if (error) {
            return null;
        }

        set((state) => setColumn(state, data));
        return data;
    },
    fetchColumns: async (boardIds): ActionResult<Column[]> => {
        const {error, data} = await Rest.getColumns(boardIds);

        if (error) {
            return null;
        }

        set((state) => data.reduce(setColumn, state));
        return data;
    },
    createColumn: async (column): ActionResult<Column> => {
        const {error, data} = await Rest.createColumn(column);

        if (error) {
            return null;
        }

        set((state) => setColumn(state, data));
        return data;
    },
    updateColumn: async (columnId, column): ActionResult<Column> => {
        const {error, data} = await Rest.updateColumn(columnId, column);

        if (error) {
            return null;
        }

        set((state) => setColumn(state, data));
        return data;
    },
    moveColumn: async (columnId, nextId): ActionResult<Column> => {
        if (columnId === nextId) {
            return null;
        }

        const modifiedColumns: Column[] = [];
        set((state) => {
            let newState = state;

            const columns = Object.values(state.columns);
            const currentColumn = getColumn(columnId)(state);

            const previousColumn = columns.find((column) => column.nextId === columnId);
            if (previousColumn && currentColumn) {
                modifiedColumns.push(previousColumn);
                newState = setColumn(newState, {
                    ...previousColumn,
                    nextId: currentColumn.nextId,
                });
            }

            const beforeNextColumn = nextId === null ? columns.find((column) => column.boardId === currentColumn?.boardId && column.nextId === null) : columns.find((column) => column.nextId === nextId);
            if (beforeNextColumn) {
                modifiedColumns.push(beforeNextColumn);
                newState = setColumn(newState, {
                    ...beforeNextColumn,
                    nextId: columnId,
                });
            }

            if (currentColumn) {
                modifiedColumns.push(currentColumn);
                newState = setColumn(newState, {
                    ...currentColumn,
                    nextId,
                });
            }

            return newState;
        });

        const {error, data} = await Rest.moveColumn(columnId, nextId);

        if (error) {
            set((state) => {
                let newState = {...state};
                for (const oldColumn of modifiedColumns) {
                    newState = setColumn(newState, oldColumn);
                }


                return newState;
            });

            return null;
        }

        return data;
    },
    deleteColumn: async (columnId): ActionResult<Status> => {
        const {error, data} = await Rest.deleteColumn(columnId);

        if (error) {
            return null;
        }

        set((state) => removeColumn(state, columnId));
        return data;
    },
}));

const setColumn = (state: ColumnState, column: Column): ColumnState => ({
    ...state,
    columns: {
        ...state.columns,
        [column.id]: column,
    },
});

const removeColumn = (state: ColumnState, columnId: Column["id"]): ColumnState => {
    const {[columnId]: _, ...columns} = state.columns;
    return {
        ...state,
        columns,
    };
};

export const getColumnsInBoard = (boardId: Board["id"]) => (state: ColumnState): Column[] => Object.values(state.columns).filter((column) => column.boardId === boardId);

export const getColumnsInCurrentBoard = () => (state: ColumnState): Column[] => {
    const currentBoardId = useBoards(({currentBoardId}) => currentBoardId);

    return Object.values(state.columns)
        .filter((column) => column.boardId === currentBoardId);
};

export const getSortedColumnsInBoard = (boardId: Board["id"]) => (state: ColumnState): Column[] => sortColumns(getColumnsInBoard(boardId)(state));

export const getSortedColumnsInCurrentBoard = () => (state: ColumnState): Column[] => sortColumns(getColumnsInCurrentBoard()(state));

const sortColumns = (columns: Column[]): Column[] => {
    let currentColumn = columns.find((column) => !column.nextId);

    if (!currentColumn) {
        return [];
    }

    const sortedColumns = [currentColumn];

    while ((currentColumn = columns.find((column) => column.nextId === currentColumn?.id))) {
        sortedColumns.push(currentColumn);
    }

    return sortedColumns.reverse();
};

export const getColumn = (columnId: Column["id"]) => (state: ColumnState): Column|undefined => state.columns[columnId];

export default useColumns;
