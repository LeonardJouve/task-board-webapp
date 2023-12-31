import {create} from "zustand";
import Rest from "@api/rest";
import type {UpdateBoard, CreateBoard} from "@typing/rest";
import type {Board, User} from "@typing/store";

type BoardState = {
    currentBoardId: Board["id"]|null;
    boards: Record<Board["id"], Board>;
    setCurrentBoardId: (boardId: BoardState["currentBoardId"]) => void;
    addBoard: (board: Board) => void;
    addBoards: (boards: Board[]) => void;
    removeBoard: (boardId: Board["id"]) => void;
    removeBoards: (boardIds: Board["id"][]) => void;
    fetchBoard: (boardId: Board["id"]) => Promise<void>;
    fetchBoards: () => Promise<void>;
    createBoard: (board: CreateBoard) => Promise<void>;
    updateBoard: (boardId: Board["id"], board: UpdateBoard) => Promise<void>;
    deleteBoard: (boardId: Board["id"]) => Promise<void>;
    inviteUserToBoard: (boardId: Board["id"], userId: User["id"]) => Promise<void>;
    leaveBoard: (boardId: Board["id"]) => Promise<void>;
}

const useBoards = create<BoardState>((set) => ({
    currentBoardId: null,
    boards: {},
    setCurrentBoardId: (currentBoardId): void => set(() => ({currentBoardId})),
    addBoard: (board): void => set((state) => setBoard(state, board)),
    addBoards: (boards): void => set((state) => boards.reduce(setBoard, state)),
    removeBoard: (boardId): void => set((state) => removeBoard(state, boardId)),
    removeBoards: (boardIds): void => set((state) => boardIds.reduce(removeBoard, state)),
    fetchBoard: async (boardId): Promise<void> => {
        const {error, data} = await Rest.getBoard(boardId);

        if (error) {
            return;
        }

        set((state) => setBoard(state, data));
    },
    fetchBoards: async (): Promise<void> => {
        const {error, data} = await Rest.getBoards();

        if (error) {
            return;
        }

        set((state) => data.reduce(setBoard, state));
    },
    createBoard: async (board): Promise<void> => {
        const {error, data} = await Rest.createBoard(board);

        if (error) {
            return;
        }

        set((state) => setBoard(state, data));
    },
    updateBoard: async (boardId, board): Promise<void> => {
        const {error, data} = await Rest.updateBoard(boardId, board);

        if (error) {
            return;
        }

        set((state) => setBoard(state, data));
    },
    deleteBoard: async (boardId): Promise<void> => {
        const {error} = await Rest.deleteBoard(boardId);

        if (error) {
            return;
        }

        set((state) => removeBoard(state, boardId));
    },
    inviteUserToBoard: async (boardId, userId): Promise<void> => {
        await Rest.inviteUserToBoard(boardId, userId);
    },
    leaveBoard: async (boardId): Promise<void> => {
        await Rest.leaveBoard(boardId);
    },
}));

const setBoard = (state: BoardState, board: Board): BoardState => ({
    ...state,
    boards: {
        ...state.boards,
        [board.id]: board,
    },
});

const removeBoard = (state: BoardState, boardId: Board["id"]): BoardState => {
    const {[boardId]: _, ...boards} = state.boards;
    return {
        ...state,
        boards,
    };
};

export const getBoard = (boardId: Board["id"]) => (state: BoardState): Board|undefined => state.boards[boardId];

export const getCurrentBoard = () => (state: BoardState): Board|undefined => state.boards[state.currentBoardId ?? -1];

export default useBoards;
