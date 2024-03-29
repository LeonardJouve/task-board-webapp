import React, {useEffect} from "react";
import ReactDOM from "react-dom/client";
import type {MessageDescriptor} from "react-intl";
import IntlProvider from "@components/intl_provider";
import Router from "@components/router";
import Modals from "@components/modals/modals";
import Rest from "@api/rest";
import useErrors from "@store/errors";
import useAuth from "@store/auth";

const root = document.getElementById("root");

const Root: React.FC = () => {
    const setError = useErrors(({setError}) => setError);
    const setTokensExpiration = useAuth(({setTokensExpiration}) => setTokensExpiration);

    useEffect(() => {
        Rest.onError = (message: MessageDescriptor): void => setError({message});
    }, [setError]);

    useEffect(() => {
        Rest.onRefresh = setTokensExpiration;
    }, [setTokensExpiration]);

    return (
        <React.StrictMode>
            <IntlProvider>
                <div className="w-screen h-screen flex flex-col">
                    <Router/>
                </div>
                <Modals/>
            </IntlProvider>
        </React.StrictMode>
    );
};

if (root) {
    ReactDOM.createRoot(root).render(<Root/>);
}
