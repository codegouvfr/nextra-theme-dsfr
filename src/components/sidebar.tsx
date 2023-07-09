import type { Heading } from "nextra";
import { useFSRoute } from "nextra/hooks";
import type { Item, MenuItem, PageItem } from "nextra/normalize-pages";
import type { ReactElement } from "react";
import { SideMenu } from "@codegouvfr/react-dsfr/SideMenu";
import type { SideMenuProps } from "@codegouvfr/react-dsfr/SideMenu";
import { id } from "tsafe/id";
import { exclude } from "tsafe/exclude";
import { is } from "tsafe/is";
import { assert } from "tsafe/assert";
interface SideBarProps {
    docsDirectories: PageItem[];
    flatDirectories: Item[];
    fullDirectories: Item[];
    asPopover?: boolean;
    headings: Heading[];
    includePlaceholder: boolean;
}

export function Sidebar(props: SideBarProps): ReactElement {
    const {
        docsDirectories
        //flatDirectories,
        //fullDirectories,
        //asPopover = false,
        //headings,
        //includePlaceholder
    } = props;

    const route = useFSRoute();

    return (
        <SideMenu
            align="left"
            burgerMenuButtonText={<>Navigation</>}
            title={null}
            items={(() => {
                function getSideMenuItem(item: PageItem | Item): SideMenuProps.Item | undefined {
                    if (!(item.isUnderCurrentDocsTree ?? false)) {
                        return undefined;
                    }

                    if (
                        item.type === "menu" ||
                        (item.children && (item.children.length !== 0 || !item.withIndexPage))
                    ) {
                        assert(is<PageItem | Item | Item>(item));

                        return id<SideMenuProps.Item.SubMenu>({
                            "isActive": (() => {
                                const routeWithoutHash = route.split("#");
                                return [routeWithoutHash, routeWithoutHash + "/"].includes(
                                    item.route + "/"
                                );
                            })(),
                            "expandedByDefault": route.startsWith(item.route),
                            "text": item.title,
                            "items": ((): Item[] | PageItem[] => {
                                if (item.type === "menu") {
                                    const menu = item as MenuItem;
                                    const routes = Object.fromEntries(
                                        (menu.children || []).map(route => [route.name, route])
                                    );
                                    const out: Item[] | PageItem[] = Object.entries(
                                        menu.items || {}
                                    ).map(([key, item]) => {
                                        const route = routes[key] || {
                                            "name": key,
                                            ...("locale" in menu && { "locale": menu.locale }),
                                            "route": menu.route + "/" + key
                                        };
                                        return {
                                            ...route,
                                            ...item
                                        };
                                    });
                                    return out;
                                }

                                assert(item.children !== undefined);

                                return item.children;
                            })()
                                .map(getSideMenuItem)
                                .filter(exclude(undefined)),
                            "linkProps": !("withIndexPage" in item && !!item.withIndexPage)
                                ? undefined
                                : {
                                      "href": item.route
                                  }
                        });
                    }

                    if (item.type === "separator") {
                        return undefined;
                    }

                    return id<SideMenuProps.Item.Link>({
                        "isActive": !!(item.route && [route, route + "/"].includes(item.route + "/")),
                        "text": item.title,
                        "linkProps": {
                            "href": (item as PageItem).href ?? item.route,
                            "target": (item as PageItem).newWindow ?? false ? "_blank" : undefined
                        }
                    });
                }

                return docsDirectories.map(getSideMenuItem).filter(exclude(undefined));
            })()}
        />
    );
}
