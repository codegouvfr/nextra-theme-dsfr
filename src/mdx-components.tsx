import cn from "clsx";
import { Code, Pre, Table, Td, Th, Tr } from "nextra/components";
import type { Components } from "nextra/mdx";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { Children, cloneElement, useEffect, useRef, useState } from "react";
import { Anchor, Collapse } from "./components";
import type { AnchorProps } from "./components/anchor";
import type { DocsThemeConfig } from "./constants";
import { DetailsProvider, useDetails, useSetActiveAnchor } from "./contexts";
import { useIntersectionObserver, useSlugs } from "./contexts/active-anchor";
import { tss } from "./tss";
import { fr } from "@codegouvfr/react-dsfr";

// Anchor links
function HeadingLink({
    tag: Tag,
    context,
    children,
    id,
    ...props
}: ComponentProps<"h2"> & {
    tag: `h${2 | 3 | 4 | 5 | 6}`;
    context: { index: number };
}): ReactElement {
    const setActiveAnchor = useSetActiveAnchor();
    const slugs = useSlugs();
    const observer = useIntersectionObserver();
    const obRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        if (!id) return;
        const heading = obRef.current;
        if (!heading) return;
        slugs.set(heading, [id, (context.index += 1)]);
        observer?.observe(heading);

        return () => {
            observer?.disconnect();
            slugs.delete(heading);
            setActiveAnchor(f => {
                const ret = { ...f };
                delete ret[id];
                return ret;
            });
        };
    }, [id, context, slugs, observer, setActiveAnchor]);

    const { cx, classes } = useHeadingLinkStyles();

    return (
        <Tag {...props} className={cx(classes.root, props.className)}>
            {children}
            <span id={id} ref={obRef} />
            <a
                className={classes.subheadingAnchor}
                href={`#${id}`}
                aria-label="Permalink for this section"
            />
        </Tag>
    );
}

const useHeadingLinkStyles = tss
    .withName({ HeadingLink })
    .withNestedSelectors<"subheadingAnchor">()
    .create(({ isRTL, classes }) => ({
        "root": {
            "&:hover, &:active": {
                [`& .${classes.subheadingAnchor}`]: {
                    "opacity": 1,
                    "color": fr.colors.decisions.text.disabled.grey.default
                }
            }
        },
        "subheadingAnchor": {
            "opacity": 0,
            "backgroundImage": "unset",
            "marginLeft": isRTL ? undefined : fr.spacing("1v"),
            "marginRight": isRTL ? fr.spacing("1v") : undefined,
            "&:after": {
                "content": '"#"',
                ...fr.spacing("padding", {
                    "rightLeft": "1v"
                })
            },
            "&&:hover": {
                "color": fr.colors.decisions.text.actionHigh.blueFrance.default
            }
        }
    }));

const findSummary = (children: ReactNode) => {
    let summary: ReactNode = null;
    const restChildren: ReactNode[] = [];

    Children.forEach(children, (child, index) => {
        if (child && (child as ReactElement).type === Summary) {
            summary ||= child;
            return;
        }

        let c = child;
        if (
            !summary &&
            child &&
            typeof child === "object" &&
            (child as ReactElement).type !== Details &&
            "props" in child &&
            child.props
        ) {
            const result = findSummary(child.props.children);
            summary = result[0];
            c = cloneElement(child, {
                ...child.props,
                children: result[1]?.length ? result[1] : undefined,
                key: index
            });
        }
        restChildren.push(c);
    });

    return [summary, restChildren];
};

const Details = ({ children, open, ...props }: ComponentProps<"details">): ReactElement => {
    const [openState, setOpen] = useState(!!open);
    const [summary, restChildren] = findSummary(children);

    // To animate the close animation we have to delay the DOM node state here.
    const [delayedOpenState, setDelayedOpenState] = useState(openState);
    useEffect(() => {
        if (openState) {
            setDelayedOpenState(true);
        } else {
            const timeout = setTimeout(() => setDelayedOpenState(openState), 500);
            return () => clearTimeout(timeout);
        }
    }, [openState]);

    return (
        <details
            className="nx-my-4 nx-rounded nx-border nx-border-gray-200 nx-bg-white nx-p-2 nx-shadow-sm first:nx-mt-0 dark:nx-border-neutral-800 dark:nx-bg-neutral-900"
            {...props}
            open={delayedOpenState}
            {...(openState && { "data-expanded": true })}
        >
            <DetailsProvider value={setOpen}>{summary}</DetailsProvider>
            <Collapse isOpen={openState}>{restChildren}</Collapse>
        </details>
    );
};

const Summary = (props: ComponentProps<"summary">): ReactElement => {
    const setOpen = useDetails();
    return (
        <summary
            className={cn(
                "nx-flex nx-items-center nx-cursor-pointer nx-list-none nx-p-1 nx-transition-colors hover:nx-bg-gray-100 dark:hover:nx-bg-neutral-800",
                "before:nx-mr-1 before:nx-inline-block before:nx-transition-transform before:nx-content-[''] dark:before:nx-invert",
                "rtl:before:nx-rotate-180 [[data-expanded]>&]:before:nx-rotate-90"
            )}
            {...props}
            onClick={e => {
                e.preventDefault();
                setOpen(v => !v);
            }}
        />
    );
};

const EXTERNAL_HREF_REGEX = /https?:\/\//;

export const Link = ({ href = "", className, ...props }: AnchorProps) => (
    <Anchor
        href={href}
        newWindow={EXTERNAL_HREF_REGEX.test(href)}
        className={cn(
            "nx-text-primary-600 nx-underline nx-decoration-from-font [text-underline-position:from-font]",
            className
        )}
        {...props}
    />
);

const A = ({ href = "", ...props }) => (
    <Anchor href={href} newWindow={EXTERNAL_HREF_REGEX.test(href)} {...props} />
);

export const getComponents = ({
    isRawLayout,
    components
}: {
    isRawLayout?: boolean;
    components?: DocsThemeConfig["components"];
}): Components => {
    if (isRawLayout) {
        return { a: A };
    }

    const { cx, classes } = useMdxComponentsStyles();

    const context = { index: 0 };
    return {
        "h1": props => <h1 {...props} />,
        "h2": props => <HeadingLink tag="h2" context={context} {...props} />,
        "h3": props => <HeadingLink tag="h3" context={context} {...props} />,
        "h4": props => <HeadingLink tag="h4" context={context} {...props} />,
        "h5": props => <HeadingLink tag="h5" context={context} {...props} />,
        "h6": props => <HeadingLink tag="h6" context={context} {...props} />,
        "ul": props => <ul {...props} className={cx(classes.ulAndOl, props.className)} />,
        "ol": props => <ol {...props} className={cx(classes.ulAndOl, props.className)} />,
        "li": props => <li {...props} className={cx(classes.li, props.className)} />,
        "blockquote": props => (
            <blockquote {...props} className={cx(props.className, classes.blockquote)} />
        ),
        hr: props => <hr className="nx-my-8 dark:nx-border-gray-900" {...props} />,
        a: Link,
        table: props => <Table className="nextra-scrollbar nx-mt-6 nx-p-0 first:nx-mt-0" {...props} />,
        p: props => <p className="nx-mt-6 nx-leading-7 first:nx-mt-0" {...props} />,
        tr: Tr,
        th: Th,
        td: Td,
        details: Details,
        summary: Summary,
        pre: Pre,
        code: Code,
        ...components
    };
};

const useMdxComponentsStyles = tss
    .withName("MDXComponents")
    .withNestedSelectors<"ulAndOl">()
    .create(({ isRTL, classes }) => ({
        "ulAndOl": {
            [`margin${isRTL ? "Right" : "Left"}`]: fr.spacing("6v"),
            "marginBottom": fr.spacing("6v")
        },
        "li": {
            [`& > .${classes.ulAndOl}`]: {
                [`margin${isRTL ? "Right" : "Left"}`]: "unset",
                "marginBottom": "unset"
            }
        },
        "blockquote": {
            "marginTop": fr.spacing("6v"),
            "& > p:first-of-type": {
                "marginTop": 0
            },
            "& > p:last-of-type": {
                "marginBottom": 0
            },
            "borderColor": fr.colors.decisions.text.mention.grey.default,
            "color": fr.colors.decisions.text.mention.grey.default,
            "fontStyle": "italic",
            "borderWidth": 0,
            [`border${isRTL ? "Right" : "Left"}Width`]: 2,
            "borderStyle": "solid",
            "paddingLeft": fr.spacing("6v"),
            "margin": 0,
            "marginBottom": fr.spacing("6v")
        }
    }));
