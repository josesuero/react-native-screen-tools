export default class ApiComponent {
    constructor(contextState) {
        this.contextState = contextState;
        this.serverUrl = contextState.config.serverUrl;
        this.updateState = this.updateState.bind(this);
    }

    updateState(contextState) {
        this.contextState = contextState;
    }

}