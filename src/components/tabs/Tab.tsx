"use client";

import { useEffect, useState, type ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { useTabContext } from "./context";
import { assert } from "tsafe/assert";
import { symToStr } from "tsafe/symToStr";

export type TabProps = {
    children: ReactNode;
};

export function Tab(props: TabProps) {
    const { children } = props;
    const { defaultIndex, getPanelId, getTabId } = useTabContext();

    const [index, setTabIndex] = useState<number | undefined>(undefined);

    const [element, setElement] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (element === null) {
            return;
        }

        const parent = element.parentElement;

        assert(parent !== null);

        for (let i = 0; i < parent.children.length; i++) {
            if (parent!.children[i] === element) {
                setTabIndex(i - 1);
                break;
            }
        }
    }, [element]);

    return (
        <div
            ref={setElement}
            style={{
                "display": index === undefined ? "none" : undefined
            }}
            id={index === undefined ? undefined : getPanelId(index)}
            className={
                index === undefined
                    ? undefined
                    : fr.cx(
                          "fr-tabs__panel",
                          `fr-tabs__panel${index === defaultIndex ? "--selected" : ""}`
                      )
            }
            role="tabpanel"
            aria-labelledby={index === undefined ? undefined : getTabId(index)}
            tabIndex={0}
        >
            {children}
        </div>
    );
}

Tab.displayName = symToStr({ Tab });
