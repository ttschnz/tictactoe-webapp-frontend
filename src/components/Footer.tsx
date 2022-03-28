import { api } from "../api/apiService";
import React from "react";
import config from "../utils/config";
import "./Footer.css";
class Footer extends React.Component<{}, { version: string }> {
    defaultVersion: string = "loading...";
    constructor(props: any) {
        super(props);

        this.state = {
            version: this.defaultVersion,
        };
    }

    componentDidMount() {
        this.loadState();
    }

    async loadState() {
        this.setState({
            version: `${
                (await api("/version")).data.versionHash ?? this.defaultVersion
            }#${config.environment}`,
        });
    }

    render() {
        return (
            <footer>
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
