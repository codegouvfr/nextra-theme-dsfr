import { useRouter } from "next/router";
import type { NextraThemeLayoutProps, PageOpts } from "nextra";
import type { ReactElement, ReactNode } from "react";
import { useMemo } from "react";
import "focus-visible";
import cn from "clsx";
import { useFSRoute, useMounted } from "nextra/hooks";
import { MDXProvider } from "nextra/mdx";
import "./polyfill";
import type { PageTheme } from "nextra/normalize-pages";
import { normalizePages } from "nextra/normalize-pages";
import { Banner, Breadcrumb, Head, NavLinks, Sidebar, SkipNavContent } from "./components";
import { DEFAULT_LOCALE, PartialDocsThemeConfig } from "./constants";
import { ActiveAnchorProvider, ConfigProvider, useConfig } from "./contexts";
import { getComponents } from "./mdx-components";
import { renderComponent } from "./utils";
import { useStyles, tss } from "./tss";

interface BodyProps {
    themeContext: PageTheme;
    breadcrumb: ReactNode;
    timestamp?: number;
    navigation: ReactNode;
    children: ReactNode;
}

const classes = {
    //toc: cn("nextra-toc nx-order-last nx-hidden nx-w-64 nx-shrink-0 xl:nx-block print:nx-hidden"),
    main: cn("nx-w-full nx-break-words")
};

const Body = ({
    themeContext,
    breadcrumb,
    timestamp,
    navigation,
    children
}: BodyProps): ReactElement => {
    const config = useConfig();
    const mounted = useMounted();

    if (themeContext.layout === "raw") {
        return <div className={classes.main}>{children}</div>;
    }

    const date = themeContext.timestamp && config.gitTimestamp && timestamp ? new Date(timestamp) : null;

    const gitTimestampEl =
        // Because a user's time zone may be different from the server page
        mounted && date ? (
            <div className="nx-mt-12 nx-mb-8 nx-block nx-text-xs nx-text-gray-500 ltr:nx-text-right rtl:nx-text-left dark:nx-text-gray-400">
                {renderComponent(config.gitTimestamp, { timestamp: date })}
            </div>
        ) : (
            <div className="nx-mt-16" />
        );

    const content = (
        <>
            {children}
            {gitTimestampEl}
            {navigation}
        </>
    );

    const body = config.main?.({ children: content }) || content;

    if (themeContext.layout === "full") {
        return (
            <article
                className={cn(
                    classes.main,
                    "nextra-content nx-min-h-[calc(100vh-var(--nextra-navbar-height))] nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]"
                )}
            >
                {body}
            </article>
        );
    }

    return (
        <article
            className={cn(
                classes.main,
                "nextra-content nx-flex nx-min-h-[calc(100vh-var(--nextra-navbar-height))] nx-min-w-0 nx-justify-center nx-pb-8 nx-pr-[calc(env(safe-area-inset-right)-1.5rem)]",
                themeContext.typesetting === "article" && "nextra-body-typesetting-article"
            )}
        >
            <main className="nx-w-full nx-min-w-0 nx-max-w-6xl nx-px-6 nx-pt-4 md:nx-px-12">
                {breadcrumb}
                {body}
            </main>
        </article>
    );
};

const ContextualizedLayout = ({
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

    const { css, isRTL } = useStyles();

    const classesToc = css({ "order": 999 });

    const tocEl =
        activeType === "page" || !themeContext.toc || themeContext.layout !== "default" ? (
            themeContext.layout !== "full" &&
            themeContext.layout !== "raw" && (
                <nav className={classesToc} aria-label="table of contents" />
            )
        ) : (
            <nav className={cn(classesToc, "nx-px-4")} aria-label="table of contents">
                {renderComponent(config.toc.component, {
                    headings: config.toc.float ? headings : [],
                    filePath
                })}
            </nav>
        );

    const direction = isRTL ? "rtl" : "ltr";

    const { classes } = useLayoutStyles({
        "isRawLayout": themeContext.layout === "raw"
    });

    return (
        // This makes sure that selectors like `[dir=ltr] .nextra-container` work
        // before hydration as Tailwind expects the `dir` attribute to exist on the
        // `html` element.
        <div dir={direction} className={classes.root}>
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
            <div className={classes.content}>
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

export default function Layout({ children, ...context }: NextraThemeLayoutProps): ReactElement {
    return (
        <ConfigProvider value={context}>
            <ContextualizedLayout {...context.pageOpts}>{children}</ContextualizedLayout>
        </ConfigProvider>
    );
}

const useLayoutStyles = tss
    .withName({ Layout })
    .withParams<{ isRawLayout: boolean }>()
    .create(({ isRawLayout }) => ({
        "root": {
            "minHeight": "100vh",
            "display": "flex",
            "flexDirection": "column"
        },
        "content": {
            "display": "flex",
            "maxWidth": isRawLayout ? undefined : "90rem",
            "margin": "auto"
        }
    }));

export { useConfig, PartialDocsThemeConfig as DocsThemeConfig };
export { useMDXComponents } from "nextra/mdx";
export { Callout } from "nextra/components";
export { useTheme } from "next-themes";
export { Link } from "./mdx-components";
export {
    Bleed,
    Collapse,
    NotFoundPage,
    ServerSideErrorPage,
    Steps,
    Tabs,
    Tab,
    Cards,
    Card,
    FileTree,
    Navbar,
    SkipNavContent,
    SkipNavLink,
    ThemeSwitch
} from "./components";
