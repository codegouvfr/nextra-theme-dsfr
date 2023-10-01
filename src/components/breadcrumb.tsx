import type { Item } from "nextra/normalize-pages";
import type { ReactElement } from "react";
import { Breadcrumb as DsfrBreadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";

type Props = {
    activePath: Item[];
};

export function Breadcrumb(props: Props): ReactElement {
    const { activePath } = props;

    return (
        <DsfrBreadcrumb
            currentPageLabel={activePath[activePath.length - 1].title}
            homeLinkProps={{
                "href": "/"
            }}
            segments={activePath
                .filter((...[, i]) => i < activePath.length - 1)
                .map(item => ({
                    "label": item.title,
                    "linkProps": {
                        "href": item.route
                    }
                }))}
        />
    );
}
