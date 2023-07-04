import { createContext, useContext, useState, useRef, type ReactNode } from "react";
import { useRouter } from "next/router";
import type { SearchResult } from "../types";
import { useStyles } from "tss-react/dsfr";
import { assert } from "tsafe/assert";
import Autocomplete from "@mui/material/Autocomplete";
import { fr } from "@codegouvfr/react-dsfr";
import Popper from "@mui/material/Popper";

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

export function Search(props: SearchProps) {
    const {
        className,
        overlayClassName,
        //value,
        onChange,
        onActive,
        loading,
        //error,
        results
    } = props;

    const nativeInputProps = useContext(nativeInputPropsContext);

    assert(nativeInputProps !== undefined, "nativeInputProps must be defined by providing a context");

    const { css, cx } = useStyles();

    const router = useRouter();

    const getResult = (id: string) => {
        const result = results.find(result => result.id === id);
        assert(result !== undefined);
        return result;
    };

    const [isOpen, setIsOpen] = useState(false);

    const valueRef = useRef(props.value);

    return (
        <Autocomplete
            PopperComponent={props => (
                <Popper
                    {...props}
                    style={{
                        ...props.style,
                        "width": undefined
                    }}
                    className={cx(
                        props.className,
                        css({
                            "zIndex": 100000,
                            "width": "40em",
                            [fr.breakpoints.down("lg")]: {
                                "width": "calc(100vw - 3rem)"
                            }
                            /*
                            "& .Mui-focused": {
                                "border": "1px solid red"
                            }
                            */
                        }),
                        overlayClassName
                    )}
                    placement="bottom-start"
                />
            )}
            className={className}
            fullWidth
            onInputChange={(...[, newValue]) => {
                valueRef.current = newValue;
                onChange(newValue);
                if (newValue === "") {
                    setIsOpen(false);
                }
            }}
            blurOnSelect
            onChange={(...[, id]) => {
                if (id === null) {
                    return;
                }
                router.push(getResult(id).route);
            }}
            value={null}
            options={results.map(result => result.id)}
            filterOptions={ids => ids} // No filtering
            getOptionLabel={() => ""}
            // @ts-expect-error: We return a ReactNode instead of a string
            // but it's okay as long as we always return the same object reference
            // for a given group.
            groupBy={id => {
                const index = results.findIndex(result => result.id === id);

                const getPrefix = (index: number): ReactNode => {
                    const result = results[index];

                    if (result.prefix) {
                        return result.prefix;
                    }

                    if (index === 0) {
                        return "";
                    }

                    return getPrefix(index - 1);
                };

                return getPrefix(index);
            }}
            renderOption={(liProps, id) => (
                <li {...liProps} id={id} key={id}>
                    {getResult(id).children}
                </li>
            )}
            noOptionsText={"no result"}
            loadingText={"loading"}
            loading={loading}
            selectOnFocus
            clearOnBlur
            onFocus={() => onActive?.(true)}
            onBlur={() => onActive?.(false)}
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
            open={isOpen}
            onOpen={() => {
                const value = valueRef.current;

                if (value === "") {
                    return;
                }

                setIsOpen(true);
            }}
            onClose={() => setIsOpen(false)}
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
    children: ReactNode;
    nativeInputProps: NativeInputProps;
}) {
    const { nativeInputProps, children } = props;

    return (
        <nativeInputPropsContext.Provider value={nativeInputProps}>
            {children}
        </nativeInputPropsContext.Provider>
    );
}
