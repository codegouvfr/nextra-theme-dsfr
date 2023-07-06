import { useFSRoute } from "nextra/hooks";
import type { Item, MenuItem, PageItem } from "nextra/normalize-pages";
import type { ReactElement } from "react";
import { useConfig } from "../contexts";
import { renderComponent } from "../utils";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { exclude } from "tsafe/exclude";
import { id } from "tsafe/id";
import type { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { NativeInputPropsProvider } from "./search";

export type NavBarProps = {
    flatDirectories: Item[];
    items: (PageItem | MenuItem)[];
};

export function Navbar(props: NavBarProps): ReactElement {
    const { flatDirectories, items } = props;

    const config = useConfig();
    const activeRoute = useFSRoute();

    return (
        <Header
            brandTop={
                <>
                    INTITULE
                    <br />
                    OFFICIEL
                </>
            }
            homeLinkProps={{
                "href": "/",
                "title": "Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)"
            }}
            serviceTagline="baseline - précisions sur l'organisation"
            serviceTitle="Nom du site / service"
            quickAccessItems={[headerFooterDisplayItem]}
            renderSearchInput={params => {
                const { className, id, placeholder, type } = params;

                return (
                    <NativeInputPropsProvider
                        nativeInputProps={{
                            className,
                            id,
                            placeholder,
                            type
                        }}
                    >
                        <>
                            {renderComponent(config.search.component, {
                                "directories": flatDirectories
                            })}
                        </>
                    </NativeInputPropsProvider>
                );
            }}
            navigation={items
                .map(pageOrMenu => {
                    if (pageOrMenu.display === "hidden") {
                        return undefined;
                    }

                    if (pageOrMenu.type === "menu") {
                        const menu = pageOrMenu as MenuItem;

                        const isActive =
                            menu.route === activeRoute || activeRoute.startsWith(menu.route + "/");

                        return id<MainNavigationProps.Item.Menu>({
                            "isActive": isActive,
                            "text": menu.title,
                            "menuLinks": Object.values(menu.items).map(({ title, href, newWindow }) => ({
                                "isActive": true,
                                "linkProps": {
                                    "href": href ?? "#",
                                    "target": newWindow ? "_blank" : undefined
                                },
                                "text": title
                            }))
                        });
                    }

                    const page = pageOrMenu as PageItem;
                    let href = page.href || page.route || "#";

                    // If it's a directory
                    if (page.children) {
                        href = (page.withIndexPage ? page.route : page.firstChildRoute) || href;
                    }

                    const isActive =
                        page.route === activeRoute || activeRoute.startsWith(page.route + "/");

                    return id<MainNavigationProps.Item.Link>({
                        isActive,
                        "linkProps": {
                            href,
                            "target": page.newWindow ? "_blank" : undefined
                        },
                        "text": page.title
                    });
                })
                .filter(exclude(undefined))}
        />
    );
}
