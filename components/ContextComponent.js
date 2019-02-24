import { Alert } from 'react-native';
export default class ContextComponent {

    constructor(contextState) {
        this.state = {
            contextState,
            events: contextState.events
        };
        this.updateState = this.updateState.bind(this);
        this.serverUrl = contextState.config.serverUrl;
    }

    log(){
        // console.log('logging');
        if (true)
            console.log(...arguments);
    }

    getApi({ url, method = "get", body, contentType, skipError }) {

        const { contextState } = this.state;
        const requestUrl = `${this.serverUrl}${url}`;
        console.log(`request ${method} url`, requestUrl);

        if (body) {
            console.log('post body', body)
        }

        if (body && (!contentType || contentType === 'application/json')) {
            body = JSON.stringify(body);
        }

        return contextState
            .addToState({ apiactive: true })
            .then(() =>
                fetch(requestUrl, {
                    method,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': contentType || 'application/json',
                        'X-Spree-Token': contextState.key.spree_api_key
                    },
                    body,
                })
            )
            .then((result) => {
                contextState.addToState({ apiactive: false });
                if (skipError) {
                    result.skipError = skipError;
                }
                return result;
            })
            .then(this.processResult.bind(this))
    }


    processResult(result) {
        console.log('raw result', result);
        return Promise.resolve(true)
            .then(() => {
                if (result.status === 200 || result.status === 201 || result.status === 204) {
                    if (result._bodyText !== "") {
                        return result.json();
                    } else {
                        return { "success": "" }
                    }
                } else if (result.status >= 500 && result.status <= 599) {
                    return { "error": "Ha ocurrido un error en el servidor, intente de nuevo" }
                } else if (result.status === 401) {
                    if (this.state.contextState.Auth)
                        this.state.contextState.Auth.logout();
                    return result.json();
                    // return { error: "No Autorizado" };
                } else if (result.status === 422 || result.status === 404) {
                    return result.json();
                } else {
                    return { error: "Estado desconocido" };
                }
            })
            .then(processedResult => {
                if (processedResult.error) {
                    if (!result.skipError || result.skipError.findIndex(item => item === result.status) === -1) {
                        Alert.alert("", processedResult.error);
                    }
                    throw new Error(processedResult.error);
                }
                console.log('api result', processedResult);
                return processedResult;
            })

    }

    setState(value, callback) {
        this.state = Object.assign(this.state, value);
        if (callback) {
            callback();
        } else {
            return Promise.resolve(true);
        }
    }

    updateState(contextState) {
        this.setState({ contextState });
    }
}
