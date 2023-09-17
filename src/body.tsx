import type { ReactElement, ReactNode } from "react";
import "focus-visible";
import { useMounted } from "nextra/hooks";
import "./polyfill";
import type { PageTheme } from "nextra/normalize-pages";
import { useConfig } from "./contexts";
import { renderComponent } from "./utils";
import { tss } from "tss-react/dsfr";
import { fr } from "@codegouvfr/react-dsfr";

interface BodyProps {
    themeContext: PageTheme;
    breadcrumb: ReactNode;
    timestamp?: number;
    navigation: ReactNode;
    children: ReactNode;
}

export const Body = ({
    themeContext,
    breadcrumb,
    timestamp,
    navigation,
    children
}: BodyProps): ReactElement => {
    const config = useConfig();
    const mounted = useMounted();
    const { classes, cx } = useStyles();

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
                className={cx(
                    classes.main,
                    classes.nextraContent,
                    "nx-min-h-[calc(100vh-var(--nextra-navbar-height))] nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]"
                )}
            >
                {body}
            </article>
        );
    }

    return (
        <article
            className={cx(
                classes.main,
                classes.nextraContent,
                "nx-flex nx-min-h-[calc(100vh-var(--nextra-navbar-height))] nx-min-w-0 nx-justify-center nx-pb-8 nx-pr-[calc(env(safe-area-inset-right)-1.5rem)]",
                themeContext.typesetting === "article" && "nextra-body-typesetting-article"
            )}
        >
            <main className={classes.main}>
                {breadcrumb}
                {body}
            </main>
        </article>
    );
};

const useStyles = tss.withName({ Body }).create(() => ({
    nextraContent: {
        //TODO ->   @apply nx-text-slate-700 dark:nx-text-slate-200;
    },
    main: {
        width: "100%", // This is equivalent to w-full in Tailwind CSS
        wordBreak: "break-word" // This is equivalent to break-words in Tailwind CSS
    },
    article: {
        //nx-min-h-[calc(100vh-var(--nextra-navbar-height))] nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]
        minHeight: `calc(100vh - 4rem)`, //TODO -> calc(100vh-var(--nextra-navbar-height))
        paddingLeft: `max(env(safe-area-inset-left), 1.5rem)`,
        paddingRight: `max(env(safe-area-inset-right), 1.5rem)`
    },
    body: {
        width: "100%", // Equivalent to nx-w-full
        minWidth: 0, // Equivalent to nx-min-w-0
        maxWidth: 6 * fr.breakpoints.getPxValues().xl, // Equivalent to nx-max-w-6xl (assuming 72rem as equivalent to 6xl)
        paddingLeft: fr.spacing("6v"), // Equivalent to nx-px-6
        paddingRight: fr.spacing("6v"), // Equivalent to nx-px-6
        paddingTop: fr.spacing("4v"), // Equivalent to nx-pt-4
        [fr.breakpoints.up("md")]: {
            paddingLeft: fr.spacing("12v") // Equivalent to md:nx-px-12
        }
    }
}));
