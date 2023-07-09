import { Footer as DsfrFooter } from "@codegouvfr/react-dsfr/Footer";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";

export function Footer() {
    //const config = useConfig();
    // {renderComponent(config.footer.text)}
    // {config.i18n.length > 0 && <LocaleSwitch options={config.i18n} />}

    return (
        <DsfrFooter
            accessibility="partially compliant"
            contentDescription="
    Ce message est à remplacer par les informations de votre site.

    Comme exemple de contenu, vous pouvez indiquer les informations 
    suivantes : Le site officiel d’information administrative pour les entreprises.
    Retrouvez toutes les informations et démarches administratives nécessaires à la création, 
    à la gestion et au développement de votre entreprise.
    "
            bottomItems={[headerFooterDisplayItem]}
        />
    );
}
