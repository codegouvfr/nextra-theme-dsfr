import { type ReactNode, createContext, useContext } from "react";
import { assert } from "tsafe/assert";

type TabData = {
    defaultIndex: number;
    items: string[];
    getPanelId: (tabIndex: number) => string;
    getTabId: (tabIndex: number) => string;
};
const context = createContext<TabData | undefined>(undefined);

export function useTabContext() {
    const value = useContext(context);
    assert(value !== undefined, "You must use Tab inside the Tabs");
    return value;
}

export type TabProviderProps = TabData & { children: ReactNode };

export function TabProvider(props: TabProviderProps) {
    const { children, ...value } = props;

    return <context.Provider value={value}>{children}</context.Provider>;
}
