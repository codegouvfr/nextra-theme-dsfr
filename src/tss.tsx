import { createTss } from "tss-react";
import { useConfig } from "./contexts";
import { useRouter } from "next/router";
import { DEFAULT_LOCALE } from "./constants";

export const { tss } = createTss({
    "useContext": function useContext() {
        const config = useConfig();
        const { locale = DEFAULT_LOCALE } = useRouter();

        const localeConfig = config.i18n.find(l => l.locale === locale);
        const isRTL = localeConfig ? localeConfig.direction === "rtl" : config.direction === "rtl";

        return { isRTL };
    }
});

export const useStyles = tss.create({});
