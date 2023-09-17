import { useRouter } from "next/router";
import type { NextraThemeLayoutProps, PageOpts } from "nextra";
import type { ReactElement, ReactNode } from "react";
import { useMemo } from "react";
import { useFSRoute } from "nextra/hooks";
import { MDXProvider } from "nextra/mdx";
import { normalizePages } from "nextra/normalize-pages";
import { Banner, Breadcrumb, Head, NavLinks, Sidebar, SkipNavContent } from "./components";
import { DEFAULT_LOCALE } from "./constants";
import { ActiveAnchorProvider, ConfigProvider, useConfig } from "./contexts";
import { getComponents } from "./mdx-components";
import { renderComponent } from "./utils";
import { Body } from "./body";
import { tss } from "tss-react";
import { fr } from "@codegouvfr/react-dsfr";

const InnerLayout = ({
    filePath,
    pageMap,
    frontMatter,
    headings,
    timestamp,
    children
}: PageOpts & { children: ReactNode }): ReactElement => {
    const config = useConfig();
    const { locale = DEFAULT_LOCALE, defaultLocale } = useRouter();
    const fsPath = useFSRoute();

    const {
        activeType,
        activeIndex,
        activeThemeContext,
        activePath,
        topLevelNavbarItems,
        docsDirectories,
        flatDirectories,
        flatDocsDirectories,
        directories
    } = useMemo(
        () =>
            normalizePages({
                list: pageMap,
                locale,
                defaultLocale,
                route: fsPath
            }),
        [pageMap, locale, defaultLocale, fsPath]
    );

    const themeContext = { ...activeThemeContext, ...frontMatter };
    const hideSidebar = !themeContext.sidebar || themeContext.layout === "raw" || activeType === "page";

    const { classes, css, cx } = useStyles();

    const classesToc = css({ "order": 999 });

    const tocEl =
        activeType === "page" || !themeContext.toc || themeContext.layout !== "default" ? (
            themeContext.layout !== "full" &&
            themeContext.layout !== "raw" && (
                <nav className={classesToc} aria-label="table of contents" />
            )
        ) : (
            <nav className={cx(classes.navToc, classesToc)} aria-label="table of contents">
                {renderComponent(config.toc.component, {
                    headings: config.toc.float ? headings : [],
                    filePath
                })}
            </nav>
        );

    const localeConfig = config.i18n.find(l => l.locale === locale);
    const isRTL = localeConfig ? localeConfig.direction === "rtl" : config.direction === "rtl";

    const direction = isRTL ? "rtl" : "ltr";

    return (
        // This makes sure that selectors like `[dir=ltr] .nextra-container` work
        // before hydration as Tailwind expects the `dir` attribute to exist on the
        // `html` element.
        <div
            dir={direction}
            className={css({
                "minHeight": "100vh",
                "display": "flex",
                "flexDirection": "column"
            })}
        >
            <script
                dangerouslySetInnerHTML={{
                    __html: `document.documentElement.setAttribute('dir','${direction}')`
                }}
            />
            <Head />
            <Banner />
            {themeContext.navbar &&
                renderComponent(config.navbar.component, {
                    flatDirectories,
                    items: topLevelNavbarItems
                })}
            <div
                className={css({
                    "display": "flex",
                    "maxWith": themeContext.layout === "raw" ? undefined : "90rem"
                })}
            >
                <ActiveAnchorProvider>
                    <Sidebar
                        docsDirectories={docsDirectories}
                        flatDirectories={flatDirectories}
                        fullDirectories={directories}
                        headings={headings}
                        asPopover={hideSidebar}
                        includePlaceholder={themeContext.layout === "default"}
                    />
                    {tocEl}
                    <SkipNavContent />
                    <Body
                        themeContext={themeContext}
                        breadcrumb={
                            activeType !== "page" && themeContext.breadcrumb ? (
                                <Breadcrumb activePath={activePath} />
                            ) : null
                        }
                        timestamp={timestamp}
                        navigation={
                            activeType !== "page" && themeContext.pagination ? (
                                <NavLinks
                                    flatDirectories={flatDocsDirectories}
                                    currentIndex={activeIndex}
                                />
                            ) : null
                        }
                    >
                        <MDXProvider
                            components={getComponents({
                                isRawLayout: themeContext.layout === "raw",
                                components: config.components
                            })}
                        >
                            {children}
                        </MDXProvider>
                    </Body>
                </ActiveAnchorProvider>
            </div>
            {themeContext.footer && renderComponent(config.footer.component, { menu: hideSidebar })}
        </div>
    );
};

export function Layout({ children, ...context }: NextraThemeLayoutProps): ReactElement {
    return (
        <ConfigProvider value={context}>
            <InnerLayout {...context.pageOpts}>{children}</InnerLayout>
        </ConfigProvider>
    );
}

const useStyles = tss.withName({ Layout }).create(() => ({
    navToc: {
        paddingLeft: fr.spacing("4v"), // Equivalent to px-4
        paddingRight: fr.spacing("4v") // Equivalent to px-4
    }
}));
