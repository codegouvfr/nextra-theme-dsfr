import type { AppProps } from "next/app";
import { createNextDsfrIntegrationApi } from "@codegouvfr/react-dsfr/next-pagesdir";
import { createEmotionSsrAdvancedApproach } from "tss-react/next/pagesDir";
import Link from "next/link";
import { useRouter } from "next/router";

declare module "@codegouvfr/react-dsfr/next-pagesdir" {
    interface RegisterLink {
        Link: typeof Link;
    }
}

const { withDsfr, dsfrDocumentApi } = createNextDsfrIntegrationApi({
    "defaultColorScheme": "system",
    Link,
    "useLang": () => {
        const { locale = "en-US" } = useRouter();

        return locale;
    }
});

export { dsfrDocumentApi };

const { withAppEmotionCache, augmentDocumentWithEmotionCache } = createEmotionSsrAdvancedApproach({
    "key": "css"
});

export { augmentDocumentWithEmotionCache };

function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default withDsfr(withAppEmotionCache(App));
