import { Html, Head, Main, NextScript, DocumentProps } from "next/document";
import { augmentDocumentWithEmotionCache, dsfrDocumentApi } from "./_app";

const { getColorSchemeHtmlAttributes, augmentDocumentForDsfr } = dsfrDocumentApi;

export default function Document(props: DocumentProps) {
    return (
        <Html
            {...getColorSchemeHtmlAttributes(props)}
            style={{
                "overflow": "-moz-scrollbars-vertical",
                "overflowY": "scroll"
            }}
        >
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

augmentDocumentForDsfr(Document);

augmentDocumentWithEmotionCache(Document);
