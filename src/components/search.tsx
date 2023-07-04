import { createContext, useContext } from "react";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { Fragment } from "react";
import type { SearchResult } from "../types";
import { useStyles } from "tss-react/dsfr";
import { assert } from "tsafe/assert";
import Autocomplete from "@mui/material/Autocomplete";
import { fr } from "@codegouvfr/react-dsfr";

type SearchProps = {
    className?: string;
    overlayClassName?: string;
    value: string;
    onChange: (newValue: string) => void;
    onActive?: (active: boolean) => void;
    loading?: boolean;
    error?: boolean;
    results: SearchResult[];
};

export function Search(props: SearchProps): ReactElement {
    const {
        className,
        //overlayClassName,
        //value,
        onChange,
        onActive,
        loading,
        //error,
        results
    } = props;

    const nativeInputProps = useContext(nativeInputPropsContext) ?? {
        "className": "",
        "id": "",
        "placeholder": "",
        "type": "search"
    };

    assert(nativeInputProps !== undefined, "nativeInputProps must be defined by providing a context");

    const { css, cx, theme } = useStyles();

    const router = useRouter();

    const getResult = (id: string) => {
        const result = results.find(result => result.id === id);
        assert(result !== undefined);
        return result;
    };

    return (
        <Autocomplete
            className={cx(css({ "width": "100%" }), className)}
            onInputChange={(...[, newValue]) => onChange(newValue)}
            // NOTE: Just in case the user click outside of the Link
            onChange={(...[, id]) => {
                if (id === null) {
                    return;
                }
                router.push(getResult(id).route);

                const inputElement = document.getElementById(nativeInputProps.id);

                assert(inputElement !== null);

                inputElement.blur();
            }}
            value={null}
            options={results.map(result => result.id)}
            filterOptions={ids => ids} // No filtering
            getOptionLabel={() => ""}
            renderOption={(liProps, id) => {
                const { prefix, children } = getResult(id);

                return (
                    <Fragment key={id}>
                        {prefix && (
                            <div
                                style={{
                                    ...fr.spacing("padding", {
                                        "topBottom": "2v",
                                        "rightLeft": "4v"
                                    }),
                                    "marginBottom": fr.spacing("2v"),
                                    "borderBottom": `1px solid ${theme.decisions.border.actionHigh.grey.default}`
                                }}
                            >
                                <span
                                    className={cx(
                                        fr.cx("fr-text--lg"),
                                        css({
                                            "color": theme.decisions.text.title.grey.default
                                        })
                                    )}
                                >
                                    {prefix}
                                </span>
                            </div>
                        )}
                        <li {...liProps}>{children}</li>
                    </Fragment>
                );
            }}
            noOptionsText={"no result"}
            loadingText={"loading"}
            loading={loading}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            isOptionEqualToValue={() => false}
            renderInput={params => (
                <div ref={params.InputProps.ref}>
                    <input
                        {...params.inputProps}
                        className={cx(params.inputProps.className, nativeInputProps.className)}
                        id={nativeInputProps.id}
                        placeholder={nativeInputProps.placeholder}
                        type={nativeInputProps.type}
                    />
                </div>
            )}
            onOpen={() => onActive?.(true)}
            onClose={() => onActive?.(false)}
        />
    );
}

export type NativeInputProps = {
    className: string;
    id: string;
    placeholder: string;
    type: "search";
};

const nativeInputPropsContext = createContext<NativeInputProps | undefined>(undefined);

export function NativeInputPropsProvider(props: {
    children: ReactElement;
    nativeInputProps: NativeInputProps;
}) {
    const { nativeInputProps, children } = props;

    return (
        <nativeInputPropsContext.Provider value={nativeInputProps}>
            {children}
        </nativeInputPropsContext.Provider>
    );
}
