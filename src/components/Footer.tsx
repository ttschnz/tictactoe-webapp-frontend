import { api } from "../api/apiService";
import React from "react";
import config from "../utils/config";
import "./Footer.css";
/**
 * A footer component showing the server version of the game and a refferal link to DigitalOcean.
 */
class Footer extends React.Component<{}, { version: string }> {
    // set the default version to "loading"
    defaultVersion: string = "loading...";
    constructor(props: any) {
        super(props);
        // initialize the state with the default version
        this.state = {
            version: this.defaultVersion,
        };
    }

    componentDidMount() {
        // load the version as soon as the component is mounted
        this.loadState();
    }

    async loadState() {
        this.setState({
            // query the server for the version, use the default version if the query fails
            version: `${
                (await api("/version")).data.versionHash ?? this.defaultVersion
                // add the environment to the version
            }#${config.environment}`,
        });
    }

    render() {
        return (
            <footer>
                {/* display the version */}
                <a
                    href={
                        this.state.version === this.defaultVersion
                            ? config.versionInfo.default
                            : `${config.versionInfo.template}${this.state.version}`
                    }
                >
                    <span className="Footer-VersionSpan">
                        {this.state.version}
                    </span>
                </a>
                {/* display the DigitalOcean link */}
                <a
                    href={config.refferralBadge.href}
                    className="Footer-ReferralBadge"
                >
                    <img
                        src={config.refferralBadge.image}
                        alt={config.refferralBadge.alt}
                    />
                </a>
            </footer>
        );
    }
}

export default Footer;
