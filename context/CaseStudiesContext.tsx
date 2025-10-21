"use client";
import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import z from "zod";

// Zod Schema
export const ZodCaseStudySchema = z.object({
  _id: z.string(),
  title: z.string().min(1, "This field is required"),
  slug: z.string().optional(),
  description: z.string().min(1, "This field is required"),
  status: z.string().min(1, "This field is required"),
  featuredImg: z.union([z.any(), z.instanceof(File)]).nullable(),
  categories: z
    .array(z.object({ _id: z.string(), title: z.string() }))
    .min(1, "Select at least one category"),
  createdAt: z.string(),
});

type RowItem = z.infer<typeof ZodCaseStudySchema>;

interface Categories {
  _id: string;
  title: string;
}

interface TableState {
  tableItems: RowItem[];
  currentPage: number;
  selectedRows: string[];
  searchQuery: string;
  isOpenDeleteDialog: boolean;
  selectedItem: RowItem | null;
}

type TableAction =
  | { type: "GET_ALL_TABLE_ITEMS"; payload: RowItem[] }
  | { type: "OPEN_DELETE_DIALOG"; payload: RowItem }
  | { type: "CLOSE_DELETE_DIALOG" }
  | { type: "SET_SELECTED_ITEM"; payload: RowItem }
  | { type: "REMOVE_SELECTED_ITEM" }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_SELECTED_ROWS"; payload: string[] }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "TOGGLE_ROW_SELECTION"; payload: { id: string; checked: boolean } }
  | {
      type: "SELECT_ALL";
      payload: { checked: boolean; currentData: RowItem[] };
    }
  | { type: "CLEAR_SELECTION" }
  | { type: "RESET_PAGE" };

const tableReducer = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case "GET_ALL_TABLE_ITEMS":
      return { ...state, tableItems: action.payload };
    case "OPEN_DELETE_DIALOG":
      return {
        ...state,
        isOpenDeleteDialog: true,
        selectedItem: action.payload,
      };
    case "CLOSE_DELETE_DIALOG":
      return { ...state, isOpenDeleteDialog: false };

    case "SET_SELECTED_ITEM": {
      return { ...state, selectedItem: action.payload };
    }
    case "REMOVE_SELECTED_ITEM":
      return { ...state, selectedItem: null };

    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };

    case "SET_SELECTED_ROWS":
      return { ...state, selectedRows: action.payload };

    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload, currentPage: 1 };

    case "TOGGLE_ROW_SELECTION": {
      const { id, checked } = action.payload;
      return {
        ...state,
        selectedRows: checked
          ? [...state.selectedRows, id]
          : state.selectedRows.filter((rowId) => rowId !== id),
      };
    }

    case "SELECT_ALL":
      return {
        ...state,
        selectedRows: action.payload.checked
          ? action.payload.currentData.map((item) => item._id)
          : [],
      };

    case "CLEAR_SELECTION":
      return { ...state, selectedRows: [] };

    case "RESET_PAGE":
      return { ...state, currentPage: 1 };

    default:
      return state;
  }
};

const initialState: TableState = {
  tableItems: [],
  currentPage: 1,
  selectedRows: [],
  searchQuery: "",
  isOpenDeleteDialog: false,
  selectedItem: null,
};

interface CaseStudiesContextType {
  state: TableState;
  dispatch: React.Dispatch<TableAction>;
  getTableItems: () => Promise<void>;
}

const caseStudiesContext = createContext<CaseStudiesContextType | undefined>(
  undefined
);

export const CaseStudiesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(tableReducer, initialState);

  const getTableItems = async () => {
    const res = await axios.get("http://localhost:5000/api/case-studies");
    dispatch({ type: "GET_ALL_TABLE_ITEMS", payload: res.data });
  };

  useEffect(() => {
    getTableItems();
  }, []);

  return (
    <caseStudiesContext.Provider value={{ state, dispatch, getTableItems }}>
      {children}
    </caseStudiesContext.Provider>
  );
};

export const useCaseStudies = () => {
  const context = useContext(caseStudiesContext);

  if (!context) {
    throw new Error("useCaseStudy must be used within CaseStudyProvider");
  }

  return context;
};
