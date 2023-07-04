"use client";

import { useId, type ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { TabProvider } from "./context";

export type TabsProps = {
    items: string[];
    defaultIndex?: number;
    children: ReactNode;
};

export function Tabs(props: TabsProps) {
    const { items, children, defaultIndex = 0 } = props;

    const { getPanelId, getTabId } = (function useClosure() {
        const id = useId();

        const getPanelId = (tabIndex: number) => `tabpanel-${id}-${tabIndex}-panel`;
        const getTabId = (tabIndex: number) => `tabpanel-${id}-${tabIndex}`;

        return {
            getPanelId,
            getTabId
        };
    })();

    return (
        <div className={fr.cx("fr-tabs")}>
            <ul className={fr.cx("fr-tabs__list")} role="tablist">
                {items.map((item, index) => {
                    return (
                        <li key={index} role="presentation">
                            <button
                                id={getTabId(index)}
                                className={fr.cx("fr-tabs__tab", "fr-tabs__tab--icon-left")}
                                tabIndex={index === defaultIndex ? 0 : -1}
                                role="tab"
                                aria-selected={index === defaultIndex}
                                aria-controls={getPanelId(index)}
                            >
                                {item}
                            </button>
                        </li>
                    );
                })}
            </ul>
            <TabProvider
                defaultIndex={defaultIndex}
                items={items}
                getPanelId={getPanelId}
                getTabId={getTabId}
            >
                {children}
            </TabProvider>
        </div>
    );
}
