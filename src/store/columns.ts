import {create} from "zustand";
import Rest, {type CreateColumn, type UpdateColumn} from "@api/rest";
import type {Board} from "@store/boards";

export type Column = {
    id: number;
    boardId: number;
    nextId: number;
    name: string;
};

type ColumnState = {
    columns: Record<Column["id"], Column>;
    addColumn: (column: Column) => void;
    addColumns: (columns: Column[]) => void;
    removeColumn: (columnId: Column["id"]) => void;
    removeColumns: (columnIds: Column["id"][]) => void;
    fetchColumn: (columnId: Column["id"]) => Promise<void>;
    fetchColumns: (boardIds?: Board["id"][]) => Promise<void>;
    createColumn: (column: CreateColumn) => Promise<void>;
    updateColumn: (columnId: Column["id"], column: UpdateColumn) => Promise<void>;
    moveColumn: (columnId: Column["id"], nextId: Column["id"]|null) => Promise<void>;
    deleteColumn: (columnId: Column["id"]) => Promise<void>;
};

const useColumns = create<ColumnState>((set) => ({
    columns: {},
    addColumn: (column): void => set((state) => setColumn(state, column)),
    addColumns: (columns): void => set((state) => columns.reduce(setColumn, state)),
    removeColumn: (columnId): void => set((state) => removeColumn(state, columnId)),
    removeColumns: (columnIds): void => set((state) => columnIds.reduce(removeColumn, state)),
    fetchColumn: async (columnId): Promise<void> => {
        const {error, data} = await Rest.getColumn(columnId);

        if (error) {
            return;
        }

        set((state) => setColumn(state, data));
    },
    fetchColumns: async (boardIds): Promise<void> => {
        const {error, data} = await Rest.getColumns(boardIds);

        if (error) {
            return;
        }

        set((state) => data.reduce(setColumn, state));
    },
    createColumn: async (column): Promise<void> => {
        const {error, data} = await Rest.createColumn(column);

        if (error) {
            return;
        }

        set((state) => setColumn(state, data));
    },
    updateColumn: async (columnId, column): Promise<void> => {
        const {error, data} = await Rest.updateColumn(columnId, column);

        if (error) {
            return;
        }

        set((state) => setColumn(state, data));
    },
    moveColumn: async (columnId, nextId): Promise<void> => {
        const {error, data} = await Rest.moveColumn(columnId, nextId);

        if (error) {
            return;
        }

        // TODO: update other modified columns
        set((state) => setColumn(state, data));
    },
    deleteColumn: async (columnId): Promise<void> => {
        const {error} = await Rest.deleteColumn(columnId);

        if (error) {
            return;
        }

        set((state) => removeColumn(state, columnId));
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
    delete state.columns[columnId];
    return state;
};

export const getColumns = (state: ColumnState): ColumnState & {columns: Column[]} => ({
    ...state,
    columns: Object.values(state.columns),
});

export default useColumns;
