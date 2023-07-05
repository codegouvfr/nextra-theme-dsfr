import { Fragment, memo } from "react";
import { useStyles } from "tss-react/dsfr";

type MatchArgs = {
    value?: string;
    match: string;
    bold?: boolean;
};

export const HighlightMatches = memo<MatchArgs>(function HighlightMatches({
    value,
    match,
    bold = false
}: MatchArgs) {
    const splitText = value ? value.split("") : [];
    const escapedSearch = match.trim().replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    const regexp = RegExp("(" + escapedSearch.replaceAll(" ", "|") + ")", "ig");
    let result;
    let id = 0;
    let index = 0;
    const res = [];

    const { css, theme } = useStyles();

    if (value) {
        while ((result = regexp.exec(value)) !== null) {
            res.push(
                <Fragment key={id++}>
                    {splitText.splice(0, result.index - index).join("")}
                    <span
                        className={css({
                            "color": theme.decisions.text.active.blueFrance.default,
                            "fontWeight": bold ? "bold" : undefined
                        })}
                    >
                        {splitText.splice(0, regexp.lastIndex - result.index).join("")}
                    </span>
                </Fragment>
            );
            index = regexp.lastIndex;
        }
    }

    return (
        <>
            {res}
            {splitText.join("")}
        </>
    );
});
