import type { NextraThemeLayoutProps } from "nextra";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { MuiDsfrThemeProvider } from "@codegouvfr/react-dsfr/mui";
import { fr } from "@codegouvfr/react-dsfr";

export function Layout({ children, pageOpts }: NextraThemeLayoutProps) {
    console.log(pageOpts);

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <Header
                brandTop={
                    <>
                        INTITULE
                        <br />
                        OFFICIEL
                    </>
                }
                homeLinkProps={{
                    "href": "/",
                    "title": "Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)"
                }}
                quickAccessItems={[
                    {
                        iconId: "fr-icon-add-circle-line",
                        linkProps: {
                            href: "#"
                        },
                        text: "Créer un espace"
                    },
                    {
                        iconId: "ri-account-circle-line",
                        linkProps: {
                            href: "#"
                        },
                        text: "S’enregistrer"
                    },
                    headerFooterDisplayItem
                ]}
                serviceTagline="baseline - précisions sur l'organisation"
                serviceTitle="Nom du site / service"
            />
            <div
                className={fr.cx("fr-container")}
                style={{
                    flex: 1,
                    ...fr.spacing("padding", {
                        "topBottom": "10v"
                    })
                }}
            >
                <MuiDsfrThemeProvider>{children}</MuiDsfrThemeProvider>
            </div>

            <Footer
                accessibility="non compliant"
                bottomItems={[headerFooterDisplayItem]}
                contentDescription={`
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
					labore et dolore magna aliqua. 
					`}
            />
        </div>
    );
}
